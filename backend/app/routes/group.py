from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, Namespace, fields

from app.extensions import db
from app.models import User, Project, Group

groupBp = Blueprint('group', __name__)
group_ns = Namespace('group', description='Group related operations')

req_create_group_model = group_ns.model('req_create_group_model', {
    'project_id': fields.Integer(required=True, description='Project id'),
    'group_name': fields.String(required=True, description='Group name'),
    'group_size': fields.String(required=True, description='Group size'),
    'description': fields.String(required=False, description='Group description'),
})

req_join_group_model = group_ns.model('req_join_group_model', {
    'group_id': fields.Integer(required=True, description='group id')
})


@group_ns.route('groups')
class AllGroups(Resource):
    @jwt_required()
    @group_ns.doc(
        description='Create groups. Need to provide: \nproject_id, group_name, group_size, description (optional). Only student users can create groups.')
    @group_ns.expect(req_create_group_model)
    @group_ns.response(200, 'Created successfully')
    @group_ns.response(404, 'User not found')
    @group_ns.response(403, 'Group name or size or project_id not provided')
    @group_ns.response(406, 'Group name already exists in this project')
    def post(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # check user identity
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        data = request.get_json()
        group_name = data.get('group_name')
        group_size = data.get('group_size')
        project_id = data.get('project_id')
        if not (group_name and group_size and project_id):
            return {"msg": "Group name or size or project_id not provided"}, 403
        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {"msg": "Project not found"}, 404
        existing_group = Group.query.filter_by(name=group_name).join(Group.projects).filter(
            Project.id == project_id).first()
        if existing_group:
            return {"msg": "Group name already exists in this project"}, 406
        if group_size < 1:
            return {"msg": "Group size must be greater than 0"}, 406
        if project.size == len(project.group):
            return {"msg": "Project is full"}, 406
        if project in user.projects:
            return {"msg": "User is already a member of the project"}, 400
        new_group = Group(name=group_name, create_by=user.id, description=data.get('description', ''), size=group_size)
        project = Project.query.filter_by(id=project_id).first()
        db.session.add(new_group)
        db.session.commit()
        user.groups.append(new_group)
        project.group.append(new_group)
        user.projects.append(project)
        db.session.commit()

        return {"msg": "Created successfully"}, 200


@group_ns.route('join_group')
class JoinGroups(Resource):
    @jwt_required()
    @group_ns.doc(description='Join a group. Must provide group_id. Only student users can join groups.')
    @group_ns.expect(req_join_group_model)
    @group_ns.response(200, 'Joined successfully')
    @group_ns.response(404, 'User not found')
    @group_ns.response(403, 'No group id provided')
    @group_ns.response(406, 'The group is full')
    @group_ns.response(400, 'User is already a member of the group')
    def post(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        # Parse and get the payload
        data = request.get_json()
        group_id = data.get('group_id')
        if not group_id:
            return {"msg": "No group id provided"}, 403
        group = Group.query.filter_by(id=group_id).first()
        if not group:
            return {"msg": "Group not found"}, 404
        group_size = group.members.count()
        # Don't add it when you reach the upper limit
        if group_size >= group.size:
            return {"msg": "The group is full"}, 406
        # You can't join the same group more than once
        if user in group.members:
            return {"msg": "User is already a member of the group"}, 400
        user.groups.append(group)
        for project in group.projects:
            if project not in user.projects:
                user.projects.append(project)
            else:
                return {"msg": "User is already a member of the project"}, 406
        db.session.commit()

        return {"msg": "Joined successfully"}, 200


@group_ns.route('leave_group')
class LeaveGroups(Resource):
    @jwt_required()
    @group_ns.doc(description='Leave a group. Must provide group_id. Only student users can leave groups.')
    @group_ns.expect(req_join_group_model)
    @group_ns.response(200, 'Left successfully')
    @group_ns.response(404, 'User not found')
    @group_ns.response(403, 'No group id provided')
    @group_ns.response(400, 'User is not a member of the group')
    def post(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        # Parse and get the payload
        data = request.get_json()
        group_id = data.get('group_id')
        if not group_id:
            return {"msg": "No group id provided"}, 403
        group = Group.query.filter_by(id=group_id).first()
        if not group:
            return {"msg": "Group not found"}, 404
        # Check if the user is a member of the group
        if user not in group.members:
            return {"msg": "User is not a member of the group"}, 400
        # Remove a user from the group
        user.groups.remove(group)
        group.members.remove(user)
        for project in group.projects:
            if project in user.projects:
                user.projects.remove(project)
        db.session.commit()
        if group.members.count() == 0:
            db.session.delete(group)
        db.session.commit()

        return {"msg": "Left successfully"}, 200
