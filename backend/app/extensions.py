from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_restx import Api

api = Api(
    title='Api sprint 1',
    version='1.0',
    description='COMP9900 project api'
)
db = SQLAlchemy()
jwt = JWTManager()

mail = Mail()
