from flask import request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, Namespace, fields

from app.extensions import db
from app.models import User, Course, Project, Group
from app.services.search_service import search_courses, search_projects, search_groups, search_skills

dashboardBp = Blueprint('dashboard', __name__)
dashboard_ns = Namespace('dashboard', description='DashBoard')

# Define response models
response_model_project = dashboard_ns.model('Project', {
    'id': fields.Integer,
    'name': fields.String,
    'project_clients': fields.String,
    'project_specializations': fields.String,
    'background': fields.String,
    'requirements_and_scop': fields.String,
    'expected_outcomes': fields.String,
    'description': fields.String,
    'due_date': fields.String,
    'size': fields.Integer,
    'relate_course': fields.String,
    'skills': fields.List(fields.String),
    'groups': fields.List(fields.Integer),
})

data_project_list = dashboard_ns.model('ResponseModelProjectList', {
    'data': fields.List(fields.Nested(response_model_project)),
})

tmp_skill_model = dashboard_ns.model('tmp_skill_model', {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
})

tmp_proj_model = dashboard_ns.model('tmp_proj_model', {
    'id': fields.Integer,
    'name': fields.String,
})

response_model_course = dashboard_ns.model('Course', {
    'code': fields.String,
    'name': fields.String,
    'course_description': fields.String,
    'academic_unit': fields.String,
    'url': fields.String,
    'course_aim': fields.String,
    'course_outcome': fields.String,
    'summary': fields.String,
    'skills': fields.List(fields.Nested(tmp_skill_model)),
    'projects': fields.List(fields.Nested(tmp_proj_model))
})

data_course_list = dashboard_ns.model('ResponseModelCourseList', {
    'data': fields.List(fields.Nested(response_model_course))
})

group_with_project_model = dashboard_ns.model('GroupWithProject', {
    'id': fields.Integer(description='The group ID'),
    'name': fields.String(description='The group name'),
    'create_by': fields.Integer(description='ID of the user who created the group'),
    'description': fields.String(description='Description of the group'),
    'size': fields.Integer(description='Size of the group'),
    'project_id': fields.Integer(description='The project ID'),
    'project_name': fields.String(description='The project name')
})

data_group_with_project_list = dashboard_ns.model('ResponseGroupWithProjectList', {
    'data': fields.List(fields.Nested(group_with_project_model))
})

group_id_user_model = dashboard_ns.model('group_id_user_model', {
    'id': fields.Integer(required=True, description='User ID'),
    'user_name': fields.String(description='User name'),
    'email': fields.String(required=True, description='User email'),
    'avatar': fields.String(description='User avatar'),
    'bio': fields.String(description='User bio'),
    'role': fields.String(required=True, description='User role', enum=['student'])
})

# Define the group model
group_id_group_model = dashboard_ns.model('group_id_group_model', {
    'id': fields.Integer(required=True, description='Group ID'),
    'name': fields.String(required=True, description='Group name'),
    'create_by': fields.Integer(required=True, description='Creator ID'),
    'description': fields.String(description='Group description'),
    'size': fields.Integer(description='Group size'),
    'project_id': fields.Integer(required=True, description='Project ID'),
    'project_name': fields.String(required=True, description='Project name'),
    'users': fields.List(fields.Nested(group_id_user_model), description='List of users in the group')
})

# Define response models
group_id_response_model = dashboard_ns.model('group_id_response_model', {
    'data': fields.Nested(group_id_group_model)
})

response_model_skill = dashboard_ns.model('Skill', {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
})

data_skill_list = dashboard_ns.model('ResponseModelSkillList', {
    'data': fields.List(fields.Nested(response_model_skill)),
})
parser_get_allskills = dashboard_ns.parser()
parser_get_allskills.add_argument('keyword', type=str, location='args', required=False,
                                  help='Enter a keyword, and the query acts on the skill name and description')

parser_get_allprojects = dashboard_ns.parser()
parser_get_allprojects.add_argument('keyword', type=str, location='args', required=False,
                                    help='Enter keyword for searching project names and descriptions.')

parser_get_allcourses = dashboard_ns.parser()
parser_get_allcourses.add_argument('keyword', type=str, location='args', required=False,
                                   help='Enter keyword for searching course names and course codes.')

parser_get_proj_id = dashboard_ns.parser()
parser_get_proj_id.add_argument('keyword', type=str, location='args', required=False,
                                help='Enter project id')

parser_get_group_id = dashboard_ns.parser()
parser_get_group_id.add_argument('keyword', type=str, location='args', required=False,
                                 help='Enter group id')

parser_learnt = dashboard_ns.parser()
parser_learnt.add_argument('code', type=str, location='args', required=False, help='CourseCode')

parser_get_allgroups = dashboard_ns.parser()
parser_get_allgroups.add_argument('keyword', type=str, location='args', required=False,
                                  help='Enter keyword. Query group names and descriptions.')

upload_model = dashboard_ns.model('Upload', {
    'file': fields.String(required=True, description='PDF file')
})


@dashboard_ns.route('/allprojects')
class AllProjects(Resource):
    @jwt_required()
    @dashboard_ns.doc(
        description='Query all projects.\nIf no parameter provided, this will query all projects. If the keyword provided, this will query all projects with the keyword.')
    @dashboard_ns.doc(parser=parser_get_allprojects)
    @dashboard_ns.response(200, 'Successful query', data_project_list)
    @dashboard_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404

        keyword = request.args.get("keyword", "")
        projects = search_projects(keyword)
        if not projects:
            return {"data": []}, 200
        project_list = []
        for project in projects:
            project_data = {
                'id': project.id,
                'name': project.name,
                'project_clients': project.project_clients,
                'project_specializations': project.project_specializations,
                'background': project.background,
                'expected_outcomes': project.expected_outcomes,
                'description': project.description,
                'due_date': project.due_date.strftime("%Y-%m-%d") if project.due_date else None,
                'size': project.size,
                'relate_course': project.relate_course,
                'skills': [skill.name for skill in project.skill],
                'groups': [group.id for group in project.group]
            }
            project_list.append(project_data)

        return {"data": project_list}, 200


@dashboard_ns.route('/allcourses')
class AllCourses(Resource):
    @jwt_required()
    @dashboard_ns.doc(
        description='Query all courses\nIf no parameter provided, it will return all courses. If the keyword provided, it will return all courses containing the keyword.')
    @dashboard_ns.doc(parser=parser_get_allcourses)
    @dashboard_ns.response(200, 'Successful query', data_course_list)
    @dashboard_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404

        keyword = request.args.get("keyword", "")
        courses = search_courses(keyword)
        # For 'course', it should return 'name', 'detail', 'academic_unit', 'Term?', 'url', 'keywords?', and 'ID?'
        if not courses:
            return {"data": []}, 200
        course_list = []
        for course in courses:
            course_data = {
                # no id
                'code': course.code,
                'name': course.name,
                'course_description': course.course_description,
                'academic_unit': course.academic_unit,
                'url': course.url,
                # 'course_description': course.course_description,
                'course_aim': course.course_aim,
                'course_outcome': course.course_outcome,
                'summary': course.summary,
                'skills': [skill.to_dict() for skill in course.skill],
                'projects': [{'id': proj.id, 'name': proj.name} for proj in
                             Project.query.filter_by(relate_course=course.code).all() if proj],
                # 'keywords': course.keywords, 暂时没有
                # 'academic_id': course.academic_id
            }
            course_list.append(course_data)

        return {"data": course_list}, 200


@dashboard_ns.route('/allskills')
class AllSkills(Resource):
    @jwt_required()
    @dashboard_ns.doc(
        description='If you want to query all skills\nwithout parameters, you can filter skills based on the parameter keyword')
    @dashboard_ns.doc(parser=parser_get_allskills)
    @dashboard_ns.response(200, 'Successful query', data_skill_list)
    @dashboard_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        keyword = request.args.get("keyword", "")
        skills = search_skills(keyword)
        if not skills:
            return {"data": []}, 200
        skill_list = []
        # Generate the returned JSON object
        for skill in skills:
            skill_data = {
                'id': skill.id,
                'name': skill.name,
                'description': skill.description,
            }
            skill_list.append(skill_data)

        return {"data": skill_list}, 200


@dashboard_ns.route('/project_detail')
class ProjectDetail(Resource):
    @jwt_required()
    @dashboard_ns.doc(description='Query information of projects with id.')
    @dashboard_ns.doc(parser=parser_get_proj_id)
    @dashboard_ns.response(200, 'Successful query', data_project_list)
    @dashboard_ns.response(404, 'User not found')
    @dashboard_ns.response(403, 'No project id provided')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        keyword = request.args.get("keyword", "")
        if not keyword:
            return {"msg": "No project id provided"}, 403
        project = Project.query.filter_by(id=keyword).first()
        if not project:
            return {"msg": "No project found"}, 404
        project_data = {
            'id': project.id,
            'name': project.name,
            'project_clients': project.project_clients,
            'project_specializations': project.project_specializations,
            'background': project.background,
            'expected_outcomes': project.expected_outcomes,
            'description': project.description,
            'due_date': project.due_date.strftime("%Y-%m-%d") if project.due_date else None,
            'size': project.size,
            'relate_course': project.relate_course,
            'skills': [skill.name for skill in project.skill],
            'groups': [group.id for group in project.group]
        }
        return {"data": project_data}, 200


@dashboard_ns.route('/group_detail')
class GroupDetail(Resource):
    @jwt_required()
    @dashboard_ns.doc(description='Query the information of groups with id.')
    @dashboard_ns.doc(parser=parser_get_group_id)
    @dashboard_ns.response(200, 'Successful query', group_id_response_model)
    @dashboard_ns.response(404, 'User not found')
    @dashboard_ns.response(403, 'No project id provided')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        keyword = request.args.get("keyword", "")
        if not keyword:
            return {"msg": "No group id provided"}, 403
        group = Group.query.filter_by(id=keyword).first()
        if not group:
            return {"msg": "No project found"}, 404
        projects = group.projects
        group_info = group.to_dict()
        for project in projects:
            group_info['project_id'] = project.id
            group_info['project_name'] = project.name
        user_list = [user.to_dict() for user in group.members]
        group_info['users'] = user_list
        return {"data": group_info}, 200


@dashboard_ns.route('/learnt')
class LearntCourses(Resource):
    @jwt_required()
    @dashboard_ns.doc(description='Add a course to have learnt. The parameter is the course code.')
    @dashboard_ns.doc(parser=parser_learnt)
    @dashboard_ns.response(200, 'Successful modification')
    @dashboard_ns.response(404, 'User not found')
    @dashboard_ns.response(404, 'Course not found')
    @dashboard_ns.response(403, 'Course code not provided')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        code = request.args.get("code", "")
        if not code:
            return {"msg": "Course code not provided"}, 403
        course = Course.query.filter_by(code=code).first()
        if not course:
            return {"msg": "Course not found"}, 404
        if course in user.courses:
            return {"msg": "Already learnt this course"}, 200
        # Update user courses
        user.courses.append(course)
        db.session.commit()
        for sk in course.skill:
            if sk and (sk not in user.skills):
                user.skills.append(sk)
        db.session.commit()
        return {"msg": "Successful modification"}, 200


@dashboard_ns.route('/unlearnt')
class UnlearntCourses(Resource):
    @jwt_required()
    @dashboard_ns.doc(description='Delete a course from have learnt. The parameter is course code.')
    @dashboard_ns.doc(parser=parser_learnt)
    @dashboard_ns.response(200, 'Successful modification')
    @dashboard_ns.response(404, 'User not found')
    @dashboard_ns.response(404, 'Course not found')
    @dashboard_ns.response(403, 'Course code not provided')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        code = request.args.get("code", "")
        if not code:
            return {"msg": "Course code not provided"}, 403
        # Query the course according to the code and determine if it exists
        course = Course.query.filter_by(code=code).first()
        if not course:
            return {"msg": "Course not found"}, 404
        if course not in user.courses:
            return {"msg": "Course not in user's learnt courses"}, 200
        # Delete the course, reset the skills
        user.courses.remove(course)
        db.session.commit()
        sk_list = []
        for cs in user.courses:
            for tmp_sk in cs.skill:
                sk_list.append(tmp_sk.id)
        sk_set = set(sk_list)
        for sk in course.skill:
            if sk in user.skills:
                if sk.id not in sk_set:
                    user.skills.remove(sk)
        db.session.commit()
        return {"msg": "Successful modification"}, 200


@dashboard_ns.route('/allgroups')
class AllGroups(Resource):
    @jwt_required()
    @dashboard_ns.doc(
        description='Query all groups. If the keyword is provided, it will return all groups. If no keyword is provided, it will return all groups containing keyword.')
    @dashboard_ns.doc(parser=parser_get_allgroups)
    @dashboard_ns.response(200, 'Successful query', group_id_response_model)
    @dashboard_ns.response(404, 'User not found')
    def get(self):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return {"msg": "User not found"}, 404
        # Obtain the parameters carried in the get request
        keyword = request.args.get("keyword", "")
        groups = search_groups(keyword)
        if not groups:
            return {"data": []}, 200
        group_list = []
        # Collects all eligible groups and returns a list of their JSON objects
        for group in groups:
            projects = group.projects
            for project in projects:
                group_info = group.to_dict()
                group_info['project_id'] = project.id
                group_info['project_name'] = project.name
                user_list = [user.to_dict() for user in group.members]
                group_info['users'] = user_list
                group_list.append(group_info)
        return {"data": group_list}, 200
