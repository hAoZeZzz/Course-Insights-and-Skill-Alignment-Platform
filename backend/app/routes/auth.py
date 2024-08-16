from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from flask_restx import Resource, Namespace, fields
from werkzeug.security import generate_password_hash, check_password_hash

from app.models import db, User
from app.services.search_service import search_courses

authBp = Blueprint('auth', __name__)
auth_ns = Namespace('auth', description='Login and register operations')

# Define API models
register_model = auth_ns.model('Register', {
    'email': fields.String(required=True, description='User email'),
    'user_name': fields.String(required=True, description='User username'),
    'password': fields.String(required=True, description='User password'),
    'role': fields.String(required=True, description='User type'),
    'invitation_code': fields.String(required=False, description='Invitation Code for academic users')
})

login_model = auth_ns.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

token_model = auth_ns.model('Token', {
    'access_token': fields.String(description='JWT access token'),
    'id': fields.Integer(description='User id')
})

course_model = auth_ns.model('Course', {
    'code': fields.String(required=True, description='Course code'),
    'name': fields.String(required=True, description='Course name'),
    'academic_unit': fields.String(description='Academic unit'),
    'url': fields.String(description='Course URL'),
    'course_description': fields.String(description='Course description'),
    'course_aim': fields.String(description='Course aim'),
    'course_outcome': fields.String(description='Course outcome'),
    'skill': fields.String(description='Course skills')
})

response_model_courseList = auth_ns.model('ResponseModelCourseList', {
    'data': fields.List(fields.Nested(course_model))
})


search_parser = auth_ns.parser()
search_parser.add_argument('keyword', type=str, location='args', required=False, help='keyword of courses or projects')


@auth_ns.route('register')
class Register(Resource):
    @auth_ns.doc(description='Register new users. Need to provide: email, password, role. The academic user also '
                             'needs the invitation code.\nThe input for academic users is academic, and for student '
                             'users is student.')
    @auth_ns.expect(register_model)
    @auth_ns.response(201, 'Successful registration')
    @auth_ns.response(400, 'Invalid registration information')
    def post(self):
        form = request.json
        email = form.get('email')
        user_name = form.get('user_name')
        password = form.get('password')
        role = form.get('role')
        avatar = form.get('avatar')
        bio = form.get('bio')
        # Should we check if the data passed in is valid, such as whether email, password, role are not empty,
        # whether the two passwords are equal, and whether the email is in a valid format? Or is it assumed that the
        # data passed from the front end is already valid? Can the username include special characters? Should there
        # be a length restriction on the password?
        if not all([email, password]):
            # Email, password, and user type are definitely required.
            return {"msg": "Invalid registration information"}, 400

        # Email must not be duplicated, but can usernames be duplicated?
        if User.query.filter_by(email=email).first():
            return {"msg": "Email already exists"}, 400
        
        if not role:
            role = 'student'

        # Determine the type of registration; if it is for an academic user, an invitation code needs to be verified.
        if role == 'academic':
            invitationCode = form.get('invitation_code')
            if not invitationCode:
                return {"msg": "No Invitation Code provided"}, 400
            if invitationCode != "12345":
                # Verification code is 12345
                return {"msg": "Invalid Invitation Code"}, 400

        password = generate_password_hash(password)
        new_user = User(email=email, password=password, avatar=avatar, bio=bio, role=role, user_name=user_name)
        # It's best to use try-catch when submitting; this can be added later.
        db.session.add(new_user)
        db.session.commit()
        return {"msg": "Successful registration"}, 201

@auth_ns.route('login')
class Login(Resource):
    @auth_ns.doc(description="Login, if successful, return token (expires in 3 days). To keep the logged in state, "
                             "add the token when sending requests."
                             "'Authorization': `Bearer ${token}`in the header")
    @auth_ns.expect(login_model)
    @auth_ns.response(200, 'Successful login', token_model)
    @auth_ns.response(401, 'Invalid credentials')
    def post(self):
        data = request.json
        user = User.query.filter_by(email=data.get('email')).first()
        if not user or not check_password_hash(user.password, data['password']):
            return {'msg': 'Invalid credentials'}, 401
        access_token = create_access_token(identity=user.email)
        return {'access_token': access_token, 'id': user.id}, 200

@auth_ns.route('search')
class Search(Resource):
    @auth_ns.doc(description="Search, enter keyword. Perform a fuzzy search related to all courses and projects with keywords. The search only applies to the names or codes of the courses and projects.\n"
                             "Anyone can use this feature; if there is no keyword or the keyword is empty, it will retrieve all courses and projects.")
    @auth_ns.doc(parser=search_parser)
    @auth_ns.response(200, 'Successful login', model=response_model_courseList)
    @auth_ns.response(401, 'Invalid credentials')
    def get(self):
        # Regardless of whether logged in or not, it can be used by anyone.
        keyword = request.args.get('keyword')
        if not keyword:
            keyword = ''
        result = search_courses(keyword)
        if result:
            return {"data": [course.to_dict() for course in result]}, 200
        else:
            return {"msg": "No results found"}, 404




