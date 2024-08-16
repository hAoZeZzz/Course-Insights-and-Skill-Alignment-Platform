from app.models import Course, Project, User, Group, Skill


def search_courses(keyword):
    search_pattern = f"%{keyword}%"
    courses = Course.query.filter(
        (Course.code.ilike(search_pattern)) |
        (Course.name.ilike(search_pattern))
    ).all()
    return courses

def search_skills(keyword):
    search_pattern = f"%{keyword}%"
    skills = Skill.query.filter(
        (Skill.code.ilike(search_pattern)) |
        (Skill.name.ilike(search_pattern))
    ).all()
    return skills


def search_projects(keyword):
    search_pattern = f"%{keyword}%"
    projects = Project.query.filter(
        (Project.name.ilike(search_pattern)) |
        (Project.description.ilike(search_pattern))
    ).all()
    return projects


def search_users(keyword):
    search_pattern = f"%{keyword}%"
    users = User.query.filter(
        (User.user_name.ilike(search_pattern)) |
        (User.email.ilike(search_pattern))
    ).all()
    return users


def search_groups(keyword):
    search_pattern = f"%{keyword}%"
    groups = Group.query.filter(
        (Group.name.ilike(search_pattern)) |
        (Group.description.ilike(search_pattern))
    ).all()
    return groups

def search_skills(keyword):
    search_pattern = f"%{keyword}%"
    skills = Skill.query.filter(
        (Skill.name.ilike(search_pattern)) |
        (Skill.description.ilike(search_pattern))
    ).all()
    return skills
