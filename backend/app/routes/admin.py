from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, Namespace, fields

from app.models import db, User, Course, Project, Group
from app.services.search_service import search_courses, search_projects, search_groups
from app.services.user_service import is_valid_datetime

# from app import api

adminBp = Blueprint('admin', __name__)
admin_ns = Namespace('admin', description='Admin operations')

# Define API models
user_model = admin_ns.model('UserReq', {
    'id': fields.Integer(required=True, description='User id'),
    'username': fields.String(required=False, description='User username'),
    'email': fields.String(required=False, description='User email'),
    'password': fields.String(required=False, description='User password'),
    'role': fields.String(required=False, description='User role'),
    'avatar': fields.String(required=False, description='User avatar'),
    'bio': fields.String(required=False, description='User bio'),
    # 'created_at': fields.String(required=False, description='User created at')
})

course_req_model = admin_ns.model('CourseReq', {
    'original_code': fields.String(required=True, description='The code of the course to be modified'),
    'name': fields.String(required=False, description='Course name'),
    'academic_unit': fields.String(required=False, description='academic_unit'),
    'url': fields.String(required=False, description='Course url'),
    'course_description': fields.String(required=False, description='Course description'),
    'course_aim': fields.String(required=False, description='Course aim'),
    'course_outcome': fields.String(required=False, description='Course outcome'),
})

project_req_model = admin_ns.model('ProjectPutReq', {
    'original_id': fields.Integer(required=True, description='The code of the project to be modified'),
    'name': fields.String(required=False, description='Project name'),
    'description': fields.String(required=False, description='Project description'),
    'due_date': fields.String(required=False, description='Due date'),
})

group_req_model = admin_ns.model('GroupPutReq', {
    'original_id': fields.Integer(required=True, description='The code of the project to be modified'),
    'name': fields.String(required=False, description='Project name'),
    'description': fields.String(required=False, description='Project description'),
})

user_model_return = admin_ns.model('UserResp', {
    'id': fields.Integer,
    'user_name': fields.String,
    'email': fields.String,
    'avatar': fields.String,
    'bio': fields.String,
    'role': fields.String,
})

response_model_userList = admin_ns.model('ResponseModel', {
    'data': fields.List(fields.Nested(user_model_return))
})

response_model_course = admin_ns.model('AdminCourse', {
    'code': fields.String,
    'name': fields.String,
    'course_description': fields.String,
    'academic_unit': fields.String,
    'url': fields.String,
})

data_course_list = admin_ns.model('AdminResponseModelCourseList', {
    'data': fields.List(fields.Nested(response_model_course))
})

response_model_project = admin_ns.model('AdminProject', {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'due_date': fields.String,
    'skills': fields.List(fields.String),
})

response_model_group = admin_ns.model('AdminGroup', {
    'id': fields.Integer,
    'name': fields.String,
    'create_by': fields.String,
    'description': fields.String,
    'size': fields.Integer
})

data_project_list = admin_ns.model('Admin ResponseModelProjectList', {
    'data': fields.List(fields.Nested(response_model_project))
})

data_group_list = admin_ns.model('Admin ResponseModelGroupList', {
    'data': fields.List(fields.Nested(response_model_group))
})


parser = admin_ns.parser()
parser.add_argument('role', type=str, location='args', required=False, help='role: academic, student')

parser_del_user = admin_ns.parser()
parser_del_user.add_argument('email', type=str, location='args', required=False,
                             help='The email of the user to be deleted')

parser_del_course = admin_ns.parser()
parser_del_course.add_argument('original_code', type=str, location='args', required=True,
                               help='The code of the course to be deleted')

parser_del_project = admin_ns.parser()
parser_del_project.add_argument('original_id', type=int, location='args', required=True,
                               help='The id of the project to be deleted')

parser_del_group = admin_ns.parser()
parser_del_group.add_argument('original_id', type=int, location='args', required=True,
                              help='The id of the group to be deleted')

parser_course = admin_ns.parser()
parser_course.add_argument('keyword', type=str, location='args', required=False, help='keyword of the query')

parser_project = admin_ns.parser()
parser_project.add_argument('keyword', type=str, location='args', required=False, help='keyword of the query')


# Query all users (should this include the admin themselves?)
# Query all academic users
# Query all student users
@admin_ns.route('/users')
# Pay attention to path parameters and query parameters.
# @admin_ns.route('/courses/<string:role>')
class AdminUsers(Resource):
    @jwt_required()
    @admin_ns.doc(parser=parser)
    @admin_ns.doc(description='If there is no parameter, all users will be queried, and if there is a parameter role, '
                              'users will be filtered according to the value of role: academic, student')
    @admin_ns.response(200, 'Successful query', response_model_userList)
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        role = request.args.get('role')
        # try except
        if role:
            users = User.query.filter_by(role=role).all()
        else:
            users = User.query.all()

        allUsers_list = []
        for u in users:
            if u.role != 'admin':
                allUsers_list.append(u.to_dict())
        return {"data": allUsers_list}, 200

    @jwt_required()
    @admin_ns.doc(
        description='admin modifies user information\nThe request body must contain the ID of the user to be '
                    'modified\nOther fields are optional, if they are modified, they can be transmitted, and if they '
                    'are not changed, they can not be transmitted')
    @admin_ns.expect(user_model)
    @admin_ns.response(201, 'Successful Modification')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    def put(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        data = request.get_json()
        user_to_change_id = data.get("id")
        if not user_to_change_id:
            return {"msg": "User not found"}, 404
        user_to_change = User.query.filter_by(id=user_to_change_id).first()
        for key, value in data.items():
            if hasattr(user_to_change, key):
                if key == 'password':
                    user_to_change.set_password(value)
                else:
                    if value:
                        setattr(user_to_change, key, value)
        db.session.commit()
        return {"msg": "Successful Modification"}, 201

    @jwt_required()
    @admin_ns.doc(parser=parser_del_user)
    @admin_ns.doc(description='To delete a user, please provide the email address of the user you want to delete')
    @admin_ns.response(200, 'Successfully deleted')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    def delete(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        user_to_del_email = request.args.get("email")
        if not user_to_del_email:
            return {"msg": "User not found"}, 404
        user_to_del = User.query.filter_by(email=user_to_del_email).first()
        if not user_to_del:
            return {"msg": "User to be deleted not found"}, 404
        user_to_del.delete()
        # 被删除的用户如何退出登录状态？
        return {"msg": "User deleted successfully"}, 200


@admin_ns.route('/courses')
# Pay attention to path parameters and query parameters.
# @admin_ns.route('/courses/<string:role>')
class AdminCourses(Resource):
    @jwt_required()
    @admin_ns.doc(parser=parser_course)
    @admin_ns.doc(
        description='If there are no parameters, all courses will be queried, and if there is a parameter keyword, '
                    'the courses will be fuzzily queried based on the keyword, and the code and name of the courses '
                    'will be queried')
    @admin_ns.response(200, 'Successful query', data_course_list)
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        keyword = request.args.get('keyword', '')
        courses = search_courses(keyword)

        course_list = []
        for course in courses:
            course_list.append(course.to_dict())
        return {"data": course_list}, 200

    @jwt_required()
    @admin_ns.doc(
        description="To modify the course information\n'original_code' (the code of the course to be modified)\nOther "
                    "fields are not required, and a field is added to the request body if it is modified")
    @admin_ns.expect(course_req_model, validate=True)
    @admin_ns.response(200, 'Successful Modification')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    @admin_ns.response(400, 'Code already exists')
    def put(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        data = request.json
        original_code = data.get('original_code')
        if not original_code:
            return {"msg": "No original course code provided"}, 400
        course = Course.query.filter_by(code=original_code).first()
        if not course:
            return {"msg": "No such course code"}, 404
        new_code = data.get('code')
        if new_code:
            if Course.query.filter_by(code=new_code).first():
                return {"msg": "Code already exists"}, 400

        for key, value in data.items():
            if hasattr(course, key):
                if value:
                    setattr(course, key, value)
        db.session.commit()
        return {"msg": "Successful Modification"}, 201

    @jwt_required()
    @admin_ns.doc(parser=parser_del_course)
    @admin_ns.doc(description='To delete a course, you must provide the code of the deleted course')
    @admin_ns.response(200, 'successfully deleted')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    @admin_ns.response(400, 'Code already exists')
    def delete(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        course_to_del_code = request.args.get("original_code", "")
        if not course_to_del_code:
            return {"msg": "Course code not provided"}, 404
        course_to_del = Course.query.filter_by(code=course_to_del_code).first()
        if not course_to_del:
            return {"msg": "Course not found"}, 404
        db.session.delete(course_to_del)
        db.session.commit()
        return {"msg": "Course deleted successfully"}, 200


@admin_ns.route('/projects')
# Pay attention to path parameters and query parameters.
# @admin_ns.route('/projects/<string:role>')
class AdminProjects(Resource):
    @jwt_required()
    @admin_ns.doc(parser=parser_project)
    @admin_ns.doc(
        description='If there is no parameter, all items are queried, and if the parameter keyword is used, '
                    'the project is queried based on the keyword, and the name and description of the item are queried')
    @admin_ns.response(200, 'Successful query', data_project_list)
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        keyword = request.args.get('keyword', '')
        projects = search_projects(keyword)

        project_list = []
        for project in projects:
            project_list.append(project.to_dict())
        return {"data": project_list}, 200

    @jwt_required()
    @admin_ns.doc(
        description="Modify project information\n'original_id (ID of the project to be modified)\nOther fields are not required, a field is added to the request body")
    @admin_ns.expect(project_req_model, validate=True)
    @admin_ns.response(200, 'Successful Modification')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    # @admin_ns.response(400, 'id already exists')
    def put(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        data = request.json
        original_id = data.get('original_id')
        if not original_id:
            return {"msg": "No original project id provided"}, 400
        project = Project.query.filter_by(id=original_id).first()
        if not project:
            return {"msg": "No such project id"}, 404
        due_date = data.get('due_date', '')
        if not due_date:
            return {"msg": "No due date provided"}, 400
        if not is_valid_datetime(due_date):
            return {"msg": "Due date is invalid, valid due date is like ‘2024-07-25’"}, 400
        due_date = datetime.strptime(due_date, '%Y-%m-%d')

        for key, value in data.items():
            if hasattr(project, key):
                if value:
                    if key == 'due_date':
                        project.due_date = due_date
                        continue
                    setattr(project, key, value)
        db.session.commit()
        return {"msg": "Successful Modification"}, 201

    @jwt_required()
    @admin_ns.doc(parser=parser_del_project)
    @admin_ns.doc(description='To delete a project, you must provide the ID of the deleted project')
    @admin_ns.response(200, 'successfully deleted')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    @admin_ns.response(400, 'id already exists')
    def delete(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        project_to_del_id = request.args.get("original_id", "")
        if not project_to_del_id:
            return {"msg": "Project id not provided"}, 404
        project_to_del = Project.query.filter_by(id=project_to_del_id).first()
        if not project_to_del:
            return {"msg": "Project not found"}, 404
        project_to_del.delete()
        db.session.commit()
        return {"msg": "Project deleted successfully"}, 200

@admin_ns.route('/groups')
class AdminGroups(Resource):
    @jwt_required()
    @admin_ns.doc(parser=parser_project)
    @admin_ns.doc(
        description='Without parameters, all groups are queried. With the keyword parameter, groups are fuzzy '
                    'searched based on the keyword, and the query affects the name and description of the group.')
    @admin_ns.response(200, 'Successful query', data_group_list)
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        keyword = request.args.get('keyword', '')
        groups = search_groups(keyword)

        group_list = []
        for group in groups:
            group_list.append(group.to_dict())
        return {"data": group_list}, 200

    @jwt_required()
    @admin_ns.doc(
        description="To modify the group information\n'original_id' (the ID of the group to be modified)\nOther "
                    "fields are not required, and a field is added to the request body if it is modified")
    @admin_ns.expect(group_req_model, validate=True)
    @admin_ns.response(200, 'Successful Modification')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    # @admin_ns.response(400, 'id already exists')
    def put(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        data = request.json
        original_id = data.get('original_id')
        if not original_id:
            return {"msg": "No original group id provided"}, 400
        group = Group.query.filter_by(id=original_id).first()
        if not group:
            return {"msg": "No such group id"}, 404

        for key, value in data.items():
            if hasattr(group, key):
                if value:
                    setattr(group, key, value)
        db.session.commit()
        return {"msg": "Successful Modification"}, 201


    @jwt_required()
    @admin_ns.doc(parser=parser_del_group)
    @admin_ns.doc(description='To delete a group, you must provide the ID of the deleted group')
    @admin_ns.response(200, 'successfully deleted')
    @admin_ns.response(403, 'No access rights')
    @admin_ns.response(404, 'User not found')
    @admin_ns.response(400, 'id already exists')
    def delete(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'admin':
            return {"msg": "No access rights"}, 403
        group_to_del_id = request.args.get("original_id", "")
        if not group_to_del_id:
            return {"msg": "Group id not provided"}, 404
        group_to_del = Group.query.filter_by(id=group_to_del_id).first()
        if not group_to_del:
            return {"msg": "Group not found"}, 404
        db.session.delete(group_to_del)
        db.session.commit()
        return {"msg": "Group deleted successfully"}, 200

