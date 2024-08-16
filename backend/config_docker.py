
import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_very_secret_key'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://myuser:mypassword@db/comp9900s'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another_secret_key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=72)

    # email config
    MAIL_SERVER = 'smtp.office365.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'pineapple618888@outlook.com'
    MAIL_PASSWORD = 'pineapple2024'
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_DEFAULT_SENDER = 'pineapple618888@outlook.com'

    # save pdf
    UPLOAD_FOLDER = os.path.join(basedir, 'savePDF')

