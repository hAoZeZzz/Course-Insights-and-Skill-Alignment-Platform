import csv

# from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.types import Text
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db

# The model class does not need to explicitly define an initialization function.
#####################################################################
########################################################################
########################################################################

# ************************** Usage ***********************************
# example：add user to group
# group.members.append(user) or user.groups.append(group)
# *******************************************************************
user_course = db.Table('user_course',
                       db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
                       db.Column('course_code', db.String(10), db.ForeignKey('courses.code', ondelete='CASCADE'),
                                 primary_key=True)
                       )
user_group = db.Table('user_group',
                      db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
                      db.Column('group_id', db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'),
                                primary_key=True)
                      )
user_project = db.Table('user_project',
                        db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'),
                                  primary_key=True),
                        db.Column('project_id', db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'),
                                  primary_key=True)
                        )
group_project = db.Table('group_project',
                         db.Column('group_id', db.Integer, db.ForeignKey('groups.id', ondelete='CASCADE'),
                                   primary_key=True),
                         db.Column('project_id', db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'),
                                   primary_key=True)
                         )
course_skill = db.Table('course_skill',
                        db.Column('course_code', db.String(10), db.ForeignKey('courses.code', ondelete='CASCADE'),
                                  primary_key=True),
                        db.Column('skill_id', db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'),
                                  primary_key=True)
                        )

user_skill = db.Table('user_skill',
                      db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
                      db.Column('skill_id', db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'),
                                primary_key=True)
                      )
project_skill = db.Table('project_skill',
                         db.Column('project_id', db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'),
                                   primary_key=True),
                         db.Column('skill_id', db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'),
                                   primary_key=True)
                         )
user_pin = db.Table('user_pin',
                    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
                    db.Column('pin_user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'),
                              primary_key=True),
                    db.Column('is_pin', db.Boolean, default=False)
                    )


# ************************** Usage ***********************************
# user.[groups|projects|skills|courses]: return user's [Group|Project|Skill|Course]
# user.[sent|received]_messages: return user's [sent|received] messages
#
# user.created_groups: return user's created groups
# user.projects_managed: return user's created projects
# *******************************************************************
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    user_name = db.Column(db.String(255))
    password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(Text(length=4294967295))  # 类型长度不够 考虑改成mediumtext或者longtext
    bio = db.Column(db.Text)
    role = db.Column(db.Enum('admin', 'academic', 'student', name='user_role'), nullable=False)

    groups = db.relationship('Group', secondary=user_group,
                             backref=db.backref('members', lazy='dynamic'))
    projects = db.relationship('Project', secondary=user_project,
                               backref=db.backref('participants', lazy='dynamic'))
    skills = db.relationship('Skill', secondary=user_skill,
                             backref=db.backref('students', lazy='dynamic'))
    courses = db.relationship('Course', secondary=user_course,
                              backref=db.backref('students', lazy='dynamic'))

    pins_users = db.relationship('User', secondary=user_pin, primaryjoin='User.id==user_pin.c.user_id',
                                 secondaryjoin='User.id==user_pin.c.pin_user_id',
                                 backref=db.backref('pin_users', lazy='dynamic'))

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def pin_someone(self, user):
        if not self.is_pinned(user):
            association = user_pin.insert().values(user_id=self.id, pin_user_id=user.id, is_pin=True)
            db.session.execute(association)
            db.session.commit()

    def unpin_someone(self, user):
        if self.is_pinned(user):
            association = user_pin.delete().where(user_pin.c.user_id == self.id, user_pin.c.pin_user_id == user.id)
            db.session.execute(association)
            db.session.commit()

    def is_pinned(self, user):
        # user_pin.select().where(user_pin.c.user_id == self.id, user_pin.c.pin_user_id == user.id).first()
        return db.session.query(user_pin).filter_by(user_id=self.id, pin_user_id=user.id).first()

    def set_isread(self, other_user):
        received_messages = Message.query.filter_by(sender_id=other_user.id, receiver_id=self.id, receiver_deleted=False, is_read=False).all()

        for message in received_messages:
            message.is_read = True

        db.session.commit()


    def delete_user_message(self, other_user):
        sent_messages = Message.query.filter_by(sender_id=self.id, receiver_id=other_user.id).all()
        received_messages = Message.query.filter_by(sender_id=other_user.id, receiver_id=self.id).all()

        for message in sent_messages:
            message.sender_deleted = True

        for message in received_messages:
            message.receiver_deleted = True

        db.session.commit()
    # return all user contact with self
    def get_contact_user(self):
        sent_user_ids = db.session.query(Message.receiver_id).filter_by(sender_id=self.id, sender_deleted=False).distinct()
        received_user_ids = db.session.query(Message.sender_id).filter_by(receiver_id=self.id, receiver_deleted=False).distinct()
        contact_user_ids = sent_user_ids.union(received_user_ids)
        return User.query.filter(User.id.in_(contact_user_ids)).all()

    # return all user contact with self and there last message
    def get_contact_user_with_message(self):
        contact_user = self.get_contact_user()
        contact_last_message = []

        for user in contact_user:
            last_sent_message = Message.query.filter_by(sender_id=self.id, receiver_id=user.id, sender_deleted=False).order_by(
                Message.timestamp.desc()).first()
            last_received_message = Message.query.filter_by(sender_id=user.id, receiver_id=self.id, receiver_deleted=False).order_by(
                Message.timestamp.desc()).first()
            if last_sent_message and last_received_message:
                if last_sent_message.timestamp > last_received_message.timestamp:
                    last_message = last_sent_message
                else:
                    last_message = last_received_message
            elif last_sent_message:
                last_message = last_sent_message
            else:
                last_message = last_received_message

            unread_count = Message.query.filter_by(sender_id=user.id, receiver_id=self.id, is_read=False, receiver_deleted=False).count()
            #     # Mark  made some changes to solve the serialization issue.
            #     contact_last_message.append((user.to_dict(), last_message.to_dict(), unread_count, user.is_pin))
            #
            # contact_last_message.sort(key=lambda x: (not x[3], x[2] == 0, x[1].get("timestamp")), reverse=True)
            # Mark   modified the return format.
            contact_last_message.append({
                'user': user.to_dict(),
                'last_message': last_message.to_dict() if last_message else None,
                'unread_count': unread_count,
                'is_pin': self.is_pinned(user).is_pin if self.is_pinned(user) else False
            })

        contact_last_message.sort(key=lambda x: (not x['is_pin'], x['unread_count'] == 0,
                                                 x['last_message'].get("timestamp")), reverse=True)
        return contact_last_message

    # return all messages between self and user
    def chat_with_other_user(self, user):
        message_sent = Message.query.filter_by(sender_id=self.id, receiver_id=user.id, sender_deleted=False)
        message_received = Message.query.filter_by(sender_id=user.id, receiver_id=self.id, receiver_deleted=False)
        all_messages = message_sent.union(message_received).order_by(Message.timestamp)
        return all_messages

    def delete(self):
        Message.query.filter((Message.sender_id == self.id) | (Message.receiver_id == self.id)).delete()
        for group in self.created_groups:
            db.session.delete(group)
        for project in self.projects_managed:
            db.session.delete(project)

        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user_name,
            'email': self.email,
            'avatar': self.avatar,
            'bio': self.bio,
            'role': self.role
        }

    def __repr__(self):
        return f'<User {self.email}>'


# ************************** Usage ***********************************
# message.[sender_id|receiver_id]: return message's [sender|receiver]'s id
# message.[sender|receiver]: return message's [sender|receiver]
# *******************************************************************
class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    content = db.Column(db.Text)
    pic = db.Column(Text(length=4294967295))
    emoji = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    sender_deleted = db.Column(db.Boolean, default=False)
    receiver_deleted = db.Column(db.Boolean, default=False)



    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'pic': self.pic,
            'emoji': self.emoji,
            'timestamp': self.timestamp.isoformat(),
            'is_read': self.is_read
        }


# ************************** Usage ***********************************
# course.skill: return course's skills
# course.students: return course's students
# *******************************************************************
class Course(db.Model):
    __tablename__ = 'courses'
    code = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(255))
    academic_unit = db.Column(db.String(255))
    url = db.Column(db.Text)
    course_description = db.Column(db.Text)
    course_aim = db.Column(db.Text)
    course_outcome = db.Column(db.Text)
    summary = db.Column(db.Text)
    academic_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

    skill = db.relationship('Skill', secondary=course_skill,
                            backref=db.backref('courses', lazy='dynamic'))

    def to_dict(self):
        return {
            'code': self.code,
            'name': self.name,
            'academic_unit': self.academic_unit,
            'url': self.url,
            'course_description': self.course_description,
            'course_aim': self.course_aim,
            'course_outcome': self.course_outcome,
            'summary': self.summary,
            'academic_id': self.academic_id
        }

    def __repr__(self):
        return f'<Course {self.code}>'


# ************************** Usage ***********************************
# skill.students: return skill's students
# skill.courses: return skill's courses
# skill.projects: return skill's projects
# *******************************************************************
class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True)
    description = db.Column(db.Text)
    category = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description
        }

    def __repr__(self):
        return f'<Skill {self.name}>'


# ************************** Usage ***********************************
# group.create_by: return group's creator id
# group.creator: return group's creator
# group.members: return group's members
# group.projects: return group's projects
# *******************************************************************
class Group(db.Model):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    create_by = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    description = db.Column(db.Text)
    size = db.Column(db.Integer)

    creator = db.relationship('User', foreign_keys=[create_by], backref='created_groups')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'create_by': self.create_by,
            'description': self.description,
            'size': self.size
        }

    def __repr__(self):
        return f'<Group {self.name}>'


# ************************** Usage ***********************************
# project.academic_id: return project's academic id
# project.academic: return project's academic
# project.group: return project's group
# project.skill: return project's skills
# *******************************************************************
class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    project_clients = db.Column(db.Text)
    project_specializations = db.Column(db.Text)
    background = db.Column(db.Text)
    expected_outcomes = db.Column(db.Text)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    size = db.Column(db.Integer)
    relate_course = db.Column(db.String(10))
    academic_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

    academic = db.relationship('User', foreign_keys=[academic_id], backref='projects_managed')
    group = db.relationship('Group', secondary=group_project,
                            backref=db.backref('projects', lazy='dynamic'))
    skill = db.relationship('Skill', secondary=project_skill,
                            backref=db.backref('projects', lazy='dynamic'))

    def delete(self):
        for group in self.group:
            db.session.delete(group)
        db.session.delete(self)
        db.session.commit()
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'project_clients': self.project_clients,
            'project_specializations': self.project_specializations,
            'background': self.background,
            'expected_outcomes': self.expected_outcomes,
            'description': self.description,
            'due_date': self.due_date.strftime("%Y-%m-%d") if self.due_date else None,
            'size': self.size,
            'relate_course': self.relate_course,
            'academic_id': self.academic_id
        }

    def __repr__(self):
        return f'<Project {self.name}>'


def init_db():
    from app import create_app
    app = create_app()
    with app.app_context():
        db.create_all()
        admin_exists = User.query.filter_by(email='admin@ad.unsw.edu.au').first()
        if not admin_exists:
            admin = User(email='admin@ad.unsw.edu.au', password=generate_password_hash('pineapple2024'), role='admin')
            db.session.add(admin)
            db.session.commit()

            import_courses(admin.id)



def import_courses(admin_id):
    csv_path = 'CSE_skill.csv'
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                print(f"Importing course: {row}")  # Debugging information.
                course = Course(
                    code=row[0],
                    name=row[1],
                    academic_unit=row[2],
                    url=row[3],
                    course_description=row[4],
                    course_aim=row[5],
                    course_outcome=row[6],
                    summary=row[12],
                    academic_id=admin_id
                )
                db.session.add(course)
                skills = row[9].split(';')
                for skill_name in skills:
                    skill_name = skill_name.strip()
                    skill_name = skill_name[0].upper() + skill_name[1:] if skill_name else skill_name
                    if skill_name:
                        skill=Skill.query.filter_by(name=skill_name).first()
                        if not skill:
                            skill = Skill(name=skill_name, description=skill_name)
                            db.session.add(skill)
            db.session.commit()

        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                course = Course.query.filter_by(code=row[0]).first()
                if course:
                    skills = row[9].split(';')
                    sorted_skills = sorted([skill_name.strip()[0].upper() + skill_name.strip()[1:] for skill_name in skills if skill_name.strip()], key=str.lower)
                    for skill_name in sorted_skills:
                        if skill_name:
                            skill = Skill.query.filter_by(name=skill_name).first()
                            if skill and skill not in course.skill:
                                course.skill.append(skill)
            db.session.commit()

    except Exception as e:
        print(f"Error importing courses: {e}")



