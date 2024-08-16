import os
import random
import re
import string
import time
from datetime import datetime

import fitz
from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from flask_restx import Resource, Namespace, fields
from werkzeug.utils import secure_filename

from app.extensions import db, mail
from app.models import User, Course, Project, Skill
from app.services.search_service import search_projects
from app.services.user_service import is_valid_datetime
from config import Config

userBp = Blueprint('user', __name__)
user_ns = Namespace('user', description='User operations')

verification_codes = {}

# Define API models
profile_model = user_ns.model('Profile', {
    'id': fields.Integer(required=False, description='User id'),
    'user_name': fields.String(required=False, description='User username'),
    'email': fields.String(required=False, description='User email'),
    'password': fields.String(required=False, description='User password'),
    'avatar': fields.String(required=False, description='User avatar'),
    'bio': fields.String(required=False, description='User bio'),
    'role': fields.String(required=False, description='User role')
})

profile_model_return = user_ns.model('User', {
    'id': fields.Integer,
    'user_name': fields.String,
    'email': fields.String,
    'avatar': fields.String,
    'bio': fields.String,
    'role': fields.String,
})

verification_model = user_ns.model('VerificationCode', {
    'password': fields.String(required=True, description='New password'),
    'verification_code': fields.String(required=True, description='Verification code')
})

upload_model = user_ns.model('Upload', {
    'file': fields.String(required=True, description='PDF file')
})

user_course_model = user_ns.model('UserCourse', {
    # 'user_id': fields.Integer(required=True, description='The user identifier'),
    'course_code': fields.String(required=True, description='The course code', max_length=10)
})

user_join_model = user_ns.model('UserJoin', {
    'project_id': fields.String(required=True, description='The project id', max_length=10)
})

response_model_profile = user_ns.model('ResponseModelProfile', {
    'data': fields.Nested(profile_model_return)
})

response_model_upload = user_ns.model('ResponseModelContentList', {
    'content': fields.List(fields.String, description='List of course codes')
})

course_data_model = user_ns.model('CourseList', {
    'code': fields.String,
    'name': fields.String,
    'detail': fields.String,
    'academic_unit': fields.String,
    # 'term': course.term
    'url': fields.String
    # 'keywords': course.keywords
    # 'academic_id': course.academic_id
})

project_data_model = user_ns.model('ProjectList1', {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'due_date': fields.String,
    'size': fields.Integer,
    'skills': fields.List(fields.String),
})

project_add_model = user_ns.model('ProjectList', {
    'name': fields.String,
    'description': fields.String,
    'due_date': fields.String,
    'course': fields.String,
    'size': fields.Integer,
    'skills': fields.List(fields.String),
})

project_modify_model = user_ns.model('ProjectModify', {
    'project_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'due_date': fields.String,
})

response_model_course = user_ns.model('ResponseModelCourseData', {
    'data': fields.List(fields.Nested(course_data_model))
})

response_model_project = user_ns.model('ResponseModelProjectData', {
    'data': fields.List(fields.Nested(project_data_model))
})

group_with_project_model = user_ns.model('GroupWithProject1', {
    'id': fields.Integer(description='The group ID'),
    'name': fields.String(description='The group name'),
    'create_by': fields.Integer(description='ID of the user who created the group'),
    'description': fields.String(description='Description of the group'),
    'size': fields.Integer(description='Size of the group'),
    'project_id': fields.Integer(description='The project ID'),
    'project_name': fields.String(description='The project name')
})

data_group_with_project_list = user_ns.model('ResponseGroupWithProjectList1', {
    'data': fields.List(fields.Nested(group_with_project_model))
})

skill_model = user_ns.model('SkillModel', {
    'id': fields.Integer(description='skill id'),
    'name': fields.String(description='skill name'),
    'description': fields.String(description='description of the skill')
})

skill_model_list = user_ns.model('SkillModelList', {
    'data': fields.List(fields.Nested(skill_model))
})

member_model_list = user_ns.model('MemberModelList', {
    'data': fields.List(fields.Nested(profile_model_return))
})

project_resp_list = user_ns.model('ProjRespModelList', {
    'data': fields.List(fields.Nested(project_data_model))
})

parser = user_ns.parser()
parser.add_argument('email', type=str, location='args', required=False,
                    help='send verification code, get request, email parameters to user\'s email address')

member_parser = user_ns.parser()
member_parser.add_argument('project_id', type=str, location='args', required=False, help='project id')

search_projects_parser = user_ns.parser()
search_projects_parser.add_argument('keyword', type=str, location='args', required=False, help='keyword')


@user_ns.route('profile')
class OwnProfile(Resource):
    @jwt_required()
    @user_ns.doc(
        description='This API can only edit user\'s own profile. Including: email, username, password, avatar, bio.\n'
                    'The frontend only sends edited attributes or sends all 5 information of attributes.'
                    'For instance, uploading avatars as long as sending over the avatar information.')
    @user_ns.expect(profile_model)
    @user_ns.response(201, 'Successful Modification')
    @user_ns.response(404, 'User not found')
    def put(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404

        data = request.json

        new_email = data.get('email')
        if new_email and new_email != user.email:
            if User.query.filter_by(email=new_email).first():
                return {"msg": "Email already exists"}, 400

        # The user can not modify role
        if data.get('role') and data.get('role') != user.role:
            return {"msg": "No access rights"}, 403
        # Only the attributes that exist in the database are modified
        for key, value in data.items():
            if hasattr(user, key):
                if key == 'password':
                    user.set_password(value)
                else:
                    if value:
                        setattr(user, key, value)

        db.session.commit()
        return {"msg": "Successful Modification"}, 201

    @jwt_required()
    @user_ns.doc(description='This API can only query the user\'s profile\nthe return value has user\'s role')
    @user_ns.response(201, 'Successful query', response_model_profile)
    @user_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404

        return {"data": user.to_dict()}, 200


@user_ns.route('reset')
class ResetPasswordRequest(Resource):
    # @jwt_required()
    @user_ns.doc(
        description='Provide the function of sending verification codes. The codes will expire in ten minutes. The '
                    'get request requires email.')
    @user_ns.doc(parser=parser)
    @user_ns.response(201, 'Successful Mail')
    @user_ns.response(404, 'User not found')
    @user_ns.response(400, 'Email sending failed')
    def get(self):
        user_email = request.args.get('email')
        if not user_email:
            return {"msg": "Email not found"}, 404
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404

        # Generate verification codes
        code = ''.join(random.choices(string.digits, k=6))
        verification_codes[user_email] = {'code': code, 'time': time.time()}
        # try to send verification codes
        try:
            msg = Message('Password Reset Verification Code', recipients=[user_email])
            msg.body = f'Your verification code is {code}'
            mail.send(msg)
            verification_codes[user_email] = {'code': code, 'time': time.time()}
        except Exception as e:
            return {"msg": "Email sending failed"}, 400
        return {"msg": "Successful Mail"}, 201

    # @jwt_required()
    @user_ns.doc(description='Verify the validity of the verification code, and set a new password if it is valid. '
                             'Provide an email address, a new password, and a verification code in the request body')
    @user_ns.expect(verification_model)
    @user_ns.response(200, 'Password reset succeeded')
    @user_ns.response(400, 'Expired verification code')
    @user_ns.response(400, 'Invalid verification code')
    @user_ns.response(404, 'User not found')
    def post(self):
        data = request.get_json()
        user_email = data.get('email')
        verCode = data.get('verification_code')
        if not verCode:
            return {"msg": "Verification code not found"}, 404
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404

        timeNow = time.time()
        timeVer = verification_codes[user_email]['time']
        stored_code = verification_codes[user_email]['code']
        # Check if the verification code has expired
        if (timeNow - timeVer) > 600:
            del verification_codes[user_email]
            return {"msg": "Expired verification code"}, 400

        # Check if the verification code is valid
        if stored_code != verCode:
            return {"msg": "Invalid verification code"}, 400

        user.set_password(data.get('password'))
        db.session.commit()
        return {"msg": "Password reset succeeded"}, 200


@user_ns.route('upload')
class UploadFile(Resource):
    @jwt_required()
    @user_ns.doc(
        description='This API can upload pdf files, extracting all course codes(excluding fails and absences), '
                    'and return the lists of all course codes.')
    @user_ns.expect(upload_model)
    @user_ns.response(200, 'File uploaded successfully', response_model_upload)
    @user_ns.response(400, 'No pdf file uploaded')
    @user_ns.response(400, 'No selected file')
    @user_ns.response(400, 'File type not allowed')
    def post(self):
        if 'file' not in request.files:
            return {"msg": "No pdf file uploaded"}, 400

        file = request.files['file']
        fname = file.filename
        if fname == '':
            return {"msg": "No selected file"}, 400

        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        recognize_course = []
        # Using regular regex, extract the course in the PDF
        # and store it in the database while updating the skills
        if file and fname.endswith('.pdf'):
            filename = secure_filename(file.filename)
            filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
            file.save(filepath)
            text = extract_text_from_pdf(filepath)
            for course_code in text:
                exist, course = is_course_in_db(course_code)
                recognize_course.append(course_code)
                if exist:
                    if course not in user.courses:
                        user.courses.append(course)
            db.session.commit()
            if recognize_course:
                for course_name in recognize_course:
                    course = Course.query.filter_by(code=course_name).first()
                    if not course:
                        continue
                    for sk in course.skill:
                        if sk and (sk not in user.skills):
                            user.skills.append(sk)
            db.session.commit()
            return {"content": recognize_course}, 200

        return {"msg": "File type not allowed"}, 400


def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        text += page.get_text()
    course_pattern = re.compile(r"([A-Z]{4}\s*\d{4})\s+(.*?)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+)\s+([A-Z]{2,3})")
    course_list = course_pattern.findall(text)

    passed_courses = []
    for course in course_list:
        code, name, attempted, passed, mark, grade = course
        code = re.sub(r'\s+', '', code)
        # ignore courses with no grades or failures
        if passed != "0.00" and grade != "FL":
            passed_courses.append(code)

    return passed_courses


def is_course_in_db(c_code):
    course = Course.query.filter_by(code=c_code).first()
    return course is not None, course


@user_ns.route('mycourses')
class AllMyCourses(Resource):
    @jwt_required()
    @user_ns.doc(description='Query the current user\'s all courses.')
    @user_ns.response(200, 'Query successfully', response_model_course)
    @user_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # get all courses from the current user
        courses = user.courses
        if not courses:
            return {"data": []}, 200
        course_list = []
        for course in courses:
            course_data = {
                'code': course.code,
                'name': course.name,
                'detail': course.course_description,
                'academic_unit': course.academic_unit,
                # 'term': course.term
                'url': course.url,
                # 'keywords': course.keywords
                # 'academic_id': course.academic_id
            }
            course_list.append(course_data)
        # course_name_list = [{'code': course.code, 'name': course.name} for course in user.courses]
        return {"data": course_list}, 200


@user_ns.route('myprojects')
class AllMyProjects(Resource):
    @jwt_required()
    @user_ns.doc(description='Query the current user\'s all projects.')
    @user_ns.response(200, 'Query successfully', response_model_project)
    @user_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Query projects based on the different identities of users
        projects = ''
        if user.role == "academic":
            projects = Project.query.filter_by(academic_id=user.id).all()
        elif user.role == "student":
            projects = user.projects

        if not projects:
            return {"data": []}, 200
        project_list = []
        for project in projects:
            project_data = {
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'due_date': project.due_date.strftime("%Y-%m-%d") if project.due_date else None,
                'size': project.size,
                'skills': [skill.name for skill in project.skill]
            }
            project_list.append(project_data)

        return {"data": project_list}, 200

    @jwt_required()
    @user_ns.doc(description='The academic user can add projects via this API')
    @user_ns.expect(project_add_model)
    @user_ns.response(200, 'Added successfully')
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    @user_ns.response(400, 'Project name already exists')
    def post(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'academic':
            return {"msg": "No access rights"}, 403
        user_id = user.id
        data = request.get_json()
        pname = data.get('name')
        if not pname:
            return {"msg": "No name provided"}, 400
        # The project name must be unique
        if Project.query.filter_by(name=pname).first():
            return {"msg": "Project name already exists"}, 400
        due_date = data.get('due_date', '')
        if not due_date:
            return {"msg": "No due date provided"}, 400
        if not is_valid_datetime(due_date):
            return {"msg": "Due date is invalid, valid due date is like ‘2024-07-25’"}, 400
        course_name = data.get('course', '')
        if not course_name:
            return {"msg": "No course provided"}, 403
        due_date = datetime.strptime(due_date, '%Y-%m-%d')
        size = data.get('size', '')
        if (not size) or (size < 1):
            return {"msg": "Invalid size provided"}, 400
        # construct a new project
        new_project = Project(
            name=pname,
            description=data.get('description', ''),
            due_date=due_date,
            academic_id=user_id,
            size=size,
            relate_course=course_name
        )
        db.session.add(new_project)
        db.session.commit()

        user.projects.append(new_project)
        data_skills = data.get('skills')

        # update courses and skills
        courses_skills = []
        course = Course.query.filter_by(code=course_name).first()
        if not course:
            return {"msg": "No course provided"}, 404
        for sk in course.skill:
            new_project.skill.append(sk)
        if data_skills:
            for skill_name in data_skills:
                skill = Skill.query.filter_by(name=skill_name).first()
                if skill:
                    if skill not in new_project.skill:
                        new_project.skill.append(skill)
            db.session.commit()
        return {"msg": "Added successfully"}, 200

    @jwt_required()
    @user_ns.doc(
        description='The academic user can edit projects via this API.\nMust have the project_id of this project.')
    @user_ns.expect(project_modify_model)
    @user_ns.response(200, 'Modified successfully')
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    @user_ns.response(400, 'No project id provided')
    def put(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return {"msg": "User not found"}, 404
        if user.role != 'academic':
            return {"msg": "No access rights"}, 403
        data = request.get_json()
        # get the project_id and check if it exists
        project_id = data.get('project_id')
        if not project_id:
            return {"msg": "No project id provided"}, 400
        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {"msg": "Project not found"}, 404
        if project.academic_id != user.id:
            return {"msg": "No access rights"}, 403
        # The project name must be unique
        if pname := data.get('name', ''):
            if Project.query.filter_by(name=pname).first():
                return {"msg": "Project name already exists"}, 400

        for key, value in data.items():
            if hasattr(project, key):
                if value:
                    if key == "due_date":
                        if not is_valid_datetime(value):
                            return {"msg": "Due date is invalid, valid due date is like ‘2024-07-25’"}, 400
                        setattr(project, key, value)
                        continue
                    setattr(project, key, value)
        db.session.commit()
        return {"msg": "Modified successfully"}, 200


@user_ns.route('search_projects')
class AllMyProjects(Resource):
    @user_ns.doc(
        description='Search projects.\nIf no parameter provided, this will query all projects. If the keyword provided, this will query all projects with the keyword.')
    @user_ns.doc(parser=search_projects_parser)
    @user_ns.response(200, 'Query successfully', response_model_project)
    def get(self):
        keyword = request.args.get("keyword", '')
        project_list = search_projects(keyword)
        res = []
        if not project_list:
            return {"data": []}, 200
        for project in project_list:
            project_data = {
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'due_date': project.due_date.strftime("%Y-%m-%d") if project.due_date else None,
                'size': project.size,
                'skills': [skill.name for skill in project.skill]
            }
            res.append(project_data)

        return {"data": res}, 200


@user_ns.route('mygroups')
class AllMyGroups(Resource):
    @jwt_required()
    @user_ns.doc(
        description='Query the current user\'s groups (including created by user him/herself and joined afterwards.))')
    @user_ns.response(200, 'Query successfully', data_group_with_project_list)
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        groups = user.groups
        if not groups:
            return {"data": []}, 200
        group_list = []
        for group in groups:
            projects = group.projects
            for project in projects:
                group_info = group.to_dict()
                group_info['project_id'] = project.id
                group_info['project_name'] = project.name
                group_list.append(group_info)
        return {"data": group_list}, 200


@user_ns.route('myskills')
class AllMySkills(Resource):
    @jwt_required()
    @user_ns.doc(description='Query the current user\'s all skills.')
    @user_ns.response(200, 'Query successfully', skill_model_list)
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        skills = user.skills
        if not skills:
            return {"data": []}, 200
        skill_list = []
        for skill in skills:
            skill_list.append(skill.to_dict())
        return {"data": skill_list}, 200


@user_ns.route('recom_projects')
class RecomProjects(Resource):
    @jwt_required()
    @user_ns.doc(description='Return top 5 recommended projects.')
    @user_ns.response(200, 'Query successfully', project_resp_list)
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        user_skills = set(skill.id for skill in user.skills)
        project_scores = []
        projects = Project.query.all()
        for project in projects:
            project_skills = set(skill.id for skill in project.skill)
            overlap = len(user_skills & project_skills)
            if project in user.projects:
                continue
            project_scores.append((project, overlap))

        top_projects = sorted(project_scores, key=lambda x: x[1], reverse=True)[:6]
        top_projects = [project.to_dict() for project, _ in top_projects]

        return {"data": top_projects}, 200


@user_ns.route('recom_members')
class RecomMembers(Resource):
    @jwt_required()
    @user_ns.doc(description='Return top 5 recommended teammates. project_id needed.')
    @user_ns.doc(parser=member_parser)
    @user_ns.response(200, 'Query successfully', member_model_list)
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    def get(self):
        user_email = get_jwt_identity()
        cur_user = User.query.filter_by(email=user_email).first()
        if not cur_user:
            return {"msg": "User not found"}, 404
        if cur_user.role != "student":
            return {"msg": "No access rights"}, 403
        project_id = request.args.get('project_id', '')
        if not project_id:
            return {"msg": "No project_id provides"}, 404
        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {"msg": "Project not found"}, 404

        # Get the set of skills needed for the project and the skills of the current user
        project_skills = set(skill.id for skill in project.skill)
        cur_user_skills = set(skill.id for skill in cur_user.skills)

        # Calculate missing skills
        missing_skills = project_skills - cur_user_skills

        overlap_scores = []
        complementary_scores = []

        users = User.query.filter(User.id != cur_user.id, User.role == 'student').all()
        for user in users:
            user_skills = set(skill.id for skill in user.skills)
            overlap = len(user_skills & project_skills)
            complementary = len(user_skills & missing_skills)

            if user in project.participants:
                continue

            overlap_scores.append((user, overlap))
            complementary_scores.append((user, complementary))

        # Sort and select top 5 for each category
        top_overlap_users = sorted(overlap_scores, key=lambda x: x[1], reverse=True)[:5]
        top_complementary_users = sorted(complementary_scores, key=lambda x: x[1], reverse=True)[:5]

        # Convert users to dictionaries and ensure unique users
        user_set = set()  # To hold unique users
        for user, _ in top_overlap_users + top_complementary_users:
            user_set.add(user)

        # Convert the unique set of users to a list of dictionaries
        top_users = [user.to_dict() for user in user_set]

        return {"data": top_users}, 200


@user_ns.route('join_project')
class JoinProject(Resource):
    @jwt_required()
    @user_ns.doc(description='Users can join the project. project_id needed.')
    @user_ns.expect(user_join_model)
    @user_ns.response(200, 'Join successfully')
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    def post(self):
        user_email = get_jwt_identity()
        cur_user = User.query.filter_by(email=user_email).first()
        if not cur_user:
            return {"msg": "User not found"}, 404
        if cur_user.role != "student":
            return {"msg": "No access rights"}, 403
        data = request.get_json()
        project_id = data.get('project_id', '')
        if not project_id:
            return {"msg": "No project_id provides"}, 404
        project = Project.query.filter_by(id=project_id).first()
        if not project:
            return {"msg": "Project not found"}, 404
        if project in cur_user.projects:
            return {"msg": "Already joined this project"}, 403
        cur_user.projects.append(project)
        db.session.commit()
        return {"msg": "Join successfully"}, 200


@user_ns.route('info_skills')
class InfoSkillsProject(Resource):
    # @jwt_required()
    @user_ns.doc(description='get info about user')
    @user_ns.expect(user_join_model)
    @user_ns.response(200, 'query successfully')
    @user_ns.response(404, 'User not found')
    @user_ns.response(403, 'No access rights')
    def get(self):
        # user_email = get_jwt_identity()
        # cur_user = User.query.filter_by(email=user_email).first()
        # if not cur_user:
        #     return {"msg": "User not found"}, 404
        # if cur_user.role != "student":
        #     return {"msg": "No access rights"}, 403
        user_id = request.args.get("user_id", '')
        if not user_id:
            return {"msg": "No user_id provides"}, 404
        user = User.query.filter_by(id=user_id).first()
        if user.role != "student":
            return {"msg": "No access rights"}, 403
        if not user:
            return {"msg": "User not found"}, 404
        user_data = {
            'name': user.user_name,
            'email': user.email,
            'avatar': user.avatar,
            'bio': user.bio,
            'skills': [skill.name for skill in user.skills],
            'courses': [course.code for course in user.courses]
        }
        return {"msg": user_data}, 200
