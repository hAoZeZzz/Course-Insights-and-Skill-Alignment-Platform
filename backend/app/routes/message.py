from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, Namespace, fields

from app.models import db, User, Message
from app.services.search_service import search_users

messageBp = Blueprint('message', __name__)
message_ns = Namespace('messages', description='Message related operations')

# Define a response model
message_request_model = message_ns.model('MessageRequest', {
    # 'sender_id': fields.Integer(required=True, description='sender id'),
    'receiver_id': fields.Integer(required=True, description='receiver id'),
    'content': fields.String(required=False, description='message content'),
    'pic': fields.String(required=False, description='picture'),
})

message_emoji_model = message_ns.model('MessageEmoji', {
    'message_id': fields.Integer(required=True, description='message id'),
    'emoji': fields.String(required=True, description='emoji')
})

message_pin_model = message_ns.model('MessagePin', {
    'other_id': fields.Integer(required=True, description='id of the user to be pinned'),
})

message_return_model = message_ns.model('MessageResponse', {
    'id': fields.Integer,
    'sender_id': fields.Integer,
    'receiver_id': fields.Integer,
    'content': fields.String,
    'emoji': fields.String,
    'pic': fields.String,
    'timestamp': fields.DateTime,
    'is_read': fields.Boolean,
})

receive_message_list = message_ns.model('ResponseModelMsgList', {
    'data': fields.List(fields.Nested(message_return_model))
})

user_return_model = message_ns.model('UserResponse', {
    'id': fields.Integer(required=False, description='User id'),
    'user_name': fields.String(required=False, description='User username'),
    'email': fields.String(required=False, description='User email'),
    'password': fields.String(required=False, description='User password'),
    'avatar': fields.String(required=False, description='User avatar'),
    'bio': fields.String(required=False, description='User bio'),
    'role': fields.String(required=False, description='User role')
})

user_resp_list = message_ns.model('ResponseModelUserList', {
    'data': fields.List(fields.Nested(user_return_model))
})

nested_model = message_ns.model('NestedModel', {
    'user': fields.Nested(user_return_model),
    'message': fields.Nested(message_return_model),
    'unread_count': fields.Integer,
    'is_pin': fields.Boolean,
})

response_user_last_msg_model = message_ns.model('ResponseUserAndLastMsgModel', {
    'data': fields.List(fields.List(fields.Nested(nested_model))),
})

parser_get_users = message_ns.parser()
parser_get_users.add_argument('keyword', type=str, location='args', required=False,
                              help='enter keyword. Query user\'s names and emails.')

parser_get_other = message_ns.parser()
parser_get_other.add_argument('other', type=int, location='args', required=False,
                              help='Parameter other: id of another user.')

parser_del_msg = message_ns.parser()
parser_del_msg.add_argument('message_id', type=int, location='args', required=False,
                            help='The ids of messages to be deleted.')


# send a message
@message_ns.route('send')
class SendMessage(Resource):
    @jwt_required()
    @message_ns.doc(description='To send a message, you must have: Receiver ID and (Text Message/Image)')
    @message_ns.expect(message_request_model, validate=True)
    @message_ns.response(201, 'Message sent successfully')
    @message_ns.response(404, 'User not found')
    @message_ns.response(400, 'No content provided')
    @message_ns.response(400, 'Cannot message yourself')
    def post(self):
        data = request.json
        sender_email = get_jwt_identity()
        sender = User.query.filter_by(email=sender_email).first()
        if not sender:
            return {"msg": "Sender not found"}, 404
        # get receiver id and check if it exists
        receiver_id = data.get('receiver_id')
        if not receiver_id:
            return {"msg": "Receiver not found"}, 404
        if sender.id == receiver_id:
            return {"msg": "Cannot message yourself"}, 400
        receiver = User.query.filter_by(id=receiver_id).first()
        if not receiver:
            return {"msg": "Receiver not found"}, 404
        # get content and pic then check if they exist
        content = data.get('content', '')
        pic = data.get('pic', '')
        if content == '' and pic == '':
            return {"msg": "No content provided"}, 400
        new_message = Message(
            sender_id=sender.id,
            receiver_id=receiver_id,
            content=content,
            pic=pic
        )
        db.session.add(new_message)
        db.session.commit()
        return {"msg": "Message sent successfully"}, 201

    @jwt_required()
    @message_ns.doc(description='Edit messages, mainly to use emojis.')
    @message_ns.expect(message_emoji_model, validate=True)
    @message_ns.response(201, 'Emoji reply successful')
    @message_ns.response(404, 'User not found')
    @message_ns.response(404, 'No message found')
    @message_ns.response(400, 'No emoji provided')
    @message_ns.response(403, 'No message_id provided')
    def put(self):
        data = request.json
        sender_email = get_jwt_identity()
        sender = User.query.filter_by(email=sender_email).first()
        if not sender:
            return {"msg": "Sender not found"}, 404

        emoji = data.get('emoji', '')
        if not emoji:
            return {"msg": "No emoji provided"}, 400
        message_id = data.get('message_id')
        if not message_id:
            return {"msg": "No message_id provided"}, 403
        msg = Message.query.filter_by(id=message_id).first()
        if not msg:
            return {"msg": "No message found"}, 404
        msg.emoji = emoji
        db.session.commit()
        return {"msg": "Emoji reply successful"}, 201


# receive messages
@message_ns.route('received')
class ReceivedMessages(Resource):
    @jwt_required()
    @message_ns.doc(description='Get the conversations of the current user and the other user. Parameter \'other\' '
                                'needed.')
    @message_ns.doc(parser=parser_get_other)
    @message_ns.response(200, 'Successful query', receive_message_list)
    @message_ns.response(403, 'Other id not found')
    @message_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        other_id = request.args.get('other', '')
        if not other_id:
            return {"msg": "Other id not found"}, 403
        other_user = User.query.filter_by(id=other_id).first()
        messages = user.chat_with_other_user(other_user)
        if messages:
            user.set_isread(other_user)
        if not messages:
            return {"data": []}, 200
        return {'data': [message.to_dict() for message in messages]}, 200


@message_ns.route('contact_users_and_last_messages')
class AllMsgUsers(Resource):
    @jwt_required()
    @message_ns.doc(description='Retrieve for the current user: all users who have sent messages and their last '
                                'message.')
    @message_ns.response(200, 'Query Successfully', response_user_last_msg_model)
    @message_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        res = user.get_contact_user_with_message()
        return {"data": res}, 200


@message_ns.route('search_users')
class AllMsgUsers(Resource):
    @jwt_required()
    @message_ns.doc(
        description='Search users:\ncan have parameter keyword. Can search user\'s names and emails\nif no parameter '
                    'added, then this will get all users except the current user.')
    @message_ns.doc(parser=parser_get_users)
    @message_ns.response(404, 'User not found')
    @message_ns.response(200, 'Query Successfully', user_resp_list)
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        keyword = request.args.get("keyword", "")
        # find users based on keywords
        users = search_users(keyword)
        if not users:
            return {"data": []}, 200
        return {"data": [user.to_dict() for user in users if user.email != user_email]}, 200


@message_ns.route('convert_pin')
class PinMsg(Resource):
    @jwt_required()
    @message_ns.doc(description='Check if a user is pinned or not. If not, then pin; if is, unpin.')
    @message_ns.expect(message_pin_model)
    @message_ns.response(404, 'User not found')
    @message_ns.response(200, 'Convert pin Successfully')
    def post(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # get payload from post request
        data = request.get_json()
        other_id = data.get('other_id', '')
        if not other_id:
            return {"msg": "No other's user id found"}, 400
        other = User.query.filter_by(id=other_id).first()
        if not other:
            return {"msg": "No other user found"}, 404
        pin_state = user.is_pinned(other)
        is_pinned = pin_state.is_pin if pin_state else False
        if is_pinned:
            user.unpin_someone(other)
            return {"msg": "Unpin Successfully"}, 200
        else:
            user.pin_someone(other)
        return {"msg": "Pin Successfully"}, 200


@message_ns.route('delete')
class ReceivedMessages(Resource):
    @jwt_required()
    @message_ns.doc(description='Delete the conversation records of the current user and the other user.')
    @message_ns.doc(parser=parser_get_other)
    @message_ns.response(200, 'Message deleted successfully')
    @message_ns.response(403, 'Message id not found')
    @message_ns.response(404, 'User not found')
    def delete(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        other_id = request.args.get('other', '')
        if not other_id:
            return {"msg": "Other id not provided"}, 404
        other_user = User.query.filter_by(id=other_id).first()
        if not other_user:
            return {"msg": "Other user not found"}, 404
        # Call the API defined in the models.py to delete the user
        user.delete_user_message(other_user)
        return {"msg": "Message deleted successfully"}, 200
