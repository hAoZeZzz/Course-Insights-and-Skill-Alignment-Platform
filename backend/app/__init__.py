from flask import Flask
from flask_cors import CORS

from app.extensions import db, jwt, mail, api
from config_docker import Config
from config import TestingConfig


def create_app(config_name='default'):
    app = Flask(__name__)

    if config_name == 'testing':
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    from app.routes.auth import auth_ns
    from app.routes.user import user_ns
    from app.routes.admin import admin_ns
    from app.routes.dashboard import dashboard_ns
    from app.routes.message import message_ns
    from app.routes.group import group_ns
    api.add_namespace(auth_ns, path='/')
    api.add_namespace(user_ns, path='/')
    api.add_namespace(admin_ns, path='/admin')
    api.add_namespace(dashboard_ns, path='/dashboard')
    api.add_namespace(message_ns, path='/')
    api.add_namespace(group_ns, path='/')
    api.init_app(app)

    from app.routes import auth, user, admin, dashboard, message, group
    app.register_blueprint(auth.authBp)
    app.register_blueprint(user.userBp)
    app.register_blueprint(admin.adminBp)
    app.register_blueprint(dashboard.dashboardBp)
    app.register_blueprint(message.messageBp)
    app.register_blueprint(group.groupBp)

    return app
