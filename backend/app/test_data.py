from app.extensions import db
from app.models import User, Course, Project, Group, Message, Skill
from werkzeug.security import generate_password_hash
import random
from datetime import datetime
import csv
def insert_test_data():
    from app import create_app
    app = create_app()
    with app.app_context():
        users_data = [
            {'email': 'academic1@ad.unsw.edu.au', 'password': 'academic1', 'role': 'academic', 'user_name': 'Maxwell Adminson', 'bio': 'Coding is fun!'},
            {'email': 'academic2@ad.unsw.edu.au', 'password': 'academic2', 'role': 'academic', 'user_name': 'Sara Rootfield', 'bio': 'Coding is fun!'},
            {'email': 'academic3@ad.unsw.edu.au', 'password': 'academic3', 'role': 'academic', 'user_name': 'Elena Sudoval', 'bio': 'Coding is fun!'},
            {'email': 'student1@ad.unsw.edu.au', 'password': 'student1', 'role': 'student', 'user_name': 'Arthur Privilegio', 'bio': 'Coding is fun!'},
            {'email': 'student2@ad.unsw.edu.au', 'password': 'student2', 'role': 'student', 'user_name': 'Isabella Master', 'bio': 'Coding is fun!'},
            {'email': 'student3@ad.unsw.edu.au', 'password': 'student3', 'role': 'student', 'user_name': 'Hanbin Yang', 'bio': 'Coding is fun!'},
            {'email': 'student4@ad.unsw.edu.au', 'password': 'student4', 'role': 'student', 'user_name': 'Charles Superuser', 'bio': 'Coding is fun!'},
            {'email': 'student5@ad.unsw.edu.au', 'password': 'student5', 'role': 'student', 'user_name': 'Natalie Control', 'bio': 'Coding is fun!'},
            {'email': 'student6@ad.unsw.edu.au', 'password': 'student6', 'role': 'student', 'user_name': 'Lucas Gatekeeper', 'bio': 'Coding is fun!'},
            {'email': 'student7@ad.unsw.edu.au', 'password': 'student7', 'role': 'student', 'user_name': 'Amanda Keymaster', 'bio': 'Coding is fun!'},
            {'email': 'student8@ad.unsw.edu.au', 'password': 'student8', 'role': 'student', 'user_name': 'Oliver Hackman', 'bio': 'Coding is fun!'},
            {'email': 'student9@ad.unsw.edu.au', 'password': 'student9', 'role': 'student', 'user_name': 'Jinping Xi', 'bio': 'Coding is fun!'},
            {'email': 'student10@ad.unsw.edu.au', 'password': 'student10', 'role': 'student', 'user_name': 'Yuki', 'bio': 'Coding is fun!'},
            {'email': 'student11@ad.unsw.edu.au', 'password': 'student11', 'role': 'student', 'user_name': 'Aiko Hashimoto', 'bio': 'Coding is fun!'},
            {'email': 'student12@ad.unsw.edu.au', 'password': 'student12', 'role': 'student', 'user_name': 'Min-Jun Park', 'bio': 'Coding is fun!'},
            {'email': 'student13@ad.unsw.edu.au', 'password': 'student13', 'role': 'student', 'user_name': 'Li Wei Zhang', 'bio': 'Coding is fun!'},
            {'email': 'student14@ad.unsw.edu.au', 'password': 'student14', 'role': 'student', 'user_name': 'Chuqin Wang', 'bio': 'Coding is fun!'},
            {'email': 'student15@ad.unsw.edu.au', 'password': 'student15', 'role': 'student', 'user_name': 'Ananya Krishnan', 'bio': 'Coding is fun!'},
            {'email': 'student16@ad.unsw.edu.au', 'password': 'student16', 'role': 'student', 'user_name': 'Haruto Watanabe', 'bio': 'Coding is fun!'},
            {'email': 'student19@ad.unsw.edu.au', 'password': 'student19', 'role': 'student', 'user_name': 'Tran Bao Huynh', 'bio': 'Coding is fun!'},
            {'email': 'student20@ad.unsw.edu.au', 'password': 'student20', 'role': 'student', 'user_name': 'Siti Aminah Bakar', 'bio': 'Coding is fun!'},
            {'email': 'student21@ad.unsw.edu.au', 'password': 'student21', 'role': 'student', 'user_name': 'Arjun Singh', 'bio': 'Coding is fun!'},
            {'email': 'student22@ad.unsw.edu.au', 'password': 'student22', 'role': 'student', 'user_name': 'Narong Srisai', 'bio': 'Coding is fun!'},
            {'email': 'student23@ad.unsw.edu.au', 'password': 'student23', 'role': 'student', 'user_name': 'Hello Kitty', 'bio': 'Coding is fun!'},
            {'email': 'student24@ad.unsw.edu.au', 'password': 'student24', 'role': 'student', 'user_name': 'Sponge Bob', 'bio': 'Coding is fun!'},
            {'email': 'student25@ad.unsw.edu.au', 'password': 'student25', 'role': 'student', 'user_name': 'Donald Trump', 'bio': 'Coding is fun!'},
            {'email': 'student26@ad.unsw.edu.au', 'password': 'student26', 'role': 'student', 'user_name': 'Yamaguchi Momoe', 'bio': 'Coding is fun!'},
            {'email': 'student27@ad.unsw.edu.au', 'password': 'student27', 'role': 'student', 'user_name': 'Itoen', 'bio': 'Coding is fun!'},
            {'email': 'student28@ad.unsw.edu.au', 'password': 'student28', 'role': 'student', 'user_name': 'Lu Xun', 'bio': 'Coding is fun!'},
            {'email': 'student29@ad.unsw.edu.au', 'password': 'student29', 'role': 'student', 'user_name': 'Can Xue', 'bio': 'Coding is fun!'},
            {'email': 'student30@ad.unsw.edu.au', 'password': 'student30', 'role': 'student', 'user_name': 'Eileen Chang', 'bio': 'Coding is fun!'}
        ]

        for user_data in users_data:
            user = User.query.filter_by(email=user_data['email']).first()
            if not user:
                user = User(email=user_data['email'], password=generate_password_hash(user_data['password']),
                            role=user_data['role'], user_name=user_data['user_name'], bio=user_data['bio'])
                db.session.add(user)
        db.session.commit()
        avatars = []
        with open('ava.txt', 'r', encoding='utf-8') as f:
            for line in f:
                avatars.append(line.strip())
        students = User.query.filter(User.email.like('student%@ad.unsw.edu.au')).all()
        for student in students:
            student.avatar = random.choice(avatars)
        db.session.commit()

        # skills_data = [
        #     {'name': 'Principles of Computer Science',
        #      'description': 'Knowledge of fundamental principles of computer science.'},
        #     {'name': 'Database Management', 'description': 'Ability to manage databases.'},
        #     {'name': 'Foundational Programming Languages',
        #      'description': 'Knowledge of fundamental programming languages.'},
        #     {'name': 'Data Structures', 'description': 'Knowledge of fundamental data structures.'},
        #     {'name': 'Network Security', 'description': 'Ability to secure and manage networks.'},
        #     {'name': 'Algorithms', 'description': 'Knowledge of fundamental algorithms.'},
        #     {'name': 'Machine Learning', 'description': 'Knowledge of fundamental machine learning algorithms.'},
        #     {'name': 'Artificial Intelligence',
        #      'description': 'Knowledge of fundamental artificial intelligence algorithms.'},
        #     {'name': 'Project Management', 'description': 'Ability to manage projects.'}
        # ]
        # for skill_data in skills_data:
        #     skill = Skill.query.filter_by(name=skill_data['name']).first()
        #     if not skill:
        #         skill = Skill(name=skill_data['name'], description=skill_data['description'])
        #         db.session.add(skill)
        # db.session.commit()


        # course_skill_map = {
        #     'COMP9021': ['Principles of Computer Science'],
        #     'COMP9311': ['Database Management'],
        #     'COMP9020': ['Foundational Programming Languages'],
        #     'COMP9024': ['Data Structures'],
        #     'COMP9331': ['Network Security', 'Algorithms'],
        #     'COMP9417': ['Algorithms', 'Machine Learning'],
        #     'COMP9444': ['Algorithms', 'Artificial Intelligence'],
        #     'COMP9820': ['Project Management']
        # }
        #
        # for course_code, skill_names in course_skill_map.items():
        #     course = Course.query.filter_by(code=course_code).first()
        #     if course:
        #         for skill_name in skill_names:
        #             skill = Skill.query.filter_by(name=skill_name).first()
        #             if skill:
        #                 if skill not in course.skill:
        #                     course.skill.append(skill)
        # db.session.commit()
        aca1 = User.query.filter_by(email='academic1@ad.unsw.edu.au').first()
        aca2 = User.query.filter_by(email='academic2@ad.unsw.edu.au').first()
        aca3 = User.query.filter_by(email='academic3@ad.unsw.edu.au').first()


        csv_file_path = 'sudo_projects.csv'  # Path to your CSV file with project data
        def load_projects_from_csv(file_path, default_due_date, academic_id):
            projects_data = []
            with open(file_path, mode='r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    project_dict = {
                        'name': row['Project Title'],
                        'project_clients': row['Project Clients'],
                        'project_specializations': row['Project Specializations'],
                        'background': row['Background'],
                        
                        'expected_outcomes': row['Expected outcomes/deliverables'],
                        'description': row['Background'],  # Description is mapped to background
                        'due_date': default_due_date,
                        'size': int(row['Number of groups']),  # Assuming 'size' needs to be set elsewhere or not used
                        'academic_id': academic_id
                    }
                    projects_data.append(project_dict)
            return projects_data

        default_due_date = datetime(2024, 9, 10).strftime("%Y-%m-%d")  # Set all due dates to September 10, 2024
        academic_id = aca1.id  # Use the static identifier for academic_id

        projects_data = load_projects_from_csv(csv_file_path, default_due_date, academic_id)

        # projects_data = [
        #     {'name': 'AI Research', 'description': 'Research on AI technologies', 'due_date': datetime(2024, 12, 31),
        #      'academic_id': aca1.id},
        #     {'name': 'Web Development', 'description': 'Develop a web application', 'due_date': datetime(2024, 11, 30),
        #      'academic_id': aca1.id},
        #     {'name': 'Mobile Development', 'description': 'Develop a mobile application',
        #      'due_date': datetime(2024, 10, 31), 'academic_id': aca2.id},
        #     {'name': 'AI Research2', 'description': 'Research on AI technologies', 'due_date': datetime(2024, 12, 31),
        #      'academic_id': aca3.id}
        # ]

        for project_data in projects_data:
            project = Project.query.filter_by(name=project_data['name']).first()
            if not project:
                project = Project(name=project_data['name'], project_clients=project_data['project_clients'], 
                                  project_specializations=project_data['project_specializations'], 
                                  background=project_data['background'], expected_outcomes=project_data['expected_outcomes'],
                                  description=project_data['description'], size=project_data['size'],
                                  due_date=project_data['due_date'], academic_id=project_data['academic_id'])
                db.session.add(project)
        db.session.commit()

        project2 = Project.query.filter_by(name='Developing a bioinformatics pipeline for immunome analysis').first()
        project1 = Project.query.filter_by(name='Course Insight and Skills Alignment Platform').first()
        project3 = Project.query.filter_by(name='Workload Allocation Software for all Engineering Schools').first()
        project4 = Project.query.filter_by(name='A web based digital twin platform for sustainability analysis').first()
        project5 = Project.query.filter_by(name='CSE HDR student travel tracking system').first()
        project6 = Project.query.filter_by(name='Emotion Recognition Software').first()
        project7 = Project.query.filter_by(name='APRA regulatory reporting automation').first()
        project8 = Project.query.filter_by(name='Predicting contaminant degradation in groundwater using machine learning').first()
        project9 = Project.query.filter_by(name='Electronic consent form').first()
        project10 = Project.query.filter_by(name='Verifiable Credentials: The Future of Digital Identity in Action').first()
        project11 = Project.query.filter_by(name='Enhancing Code Security with AI-Driven Vulnerability Detection and Explanation').first()
        project12 = Project.query.filter_by(name='Successful Outcomes').first()
        project13 = Project.query.filter_by(name='Career path analysis and lifelong learning').first()
        project14 = Project.query.filter_by(name='University progression pathways visualisation and analysis').first()
        project15 = Project.query.filter_by(name='AI-Driven Shoreline Mapping for Coastal Monitoring').first()
        project16 = Project.query.filter_by(name='Modelling the interplay of COVID-19 variants in Australia').first()
        project17 = Project.query.filter_by(name='3D motion capture from RGB images').first()
        project18 = Project.query.filter_by(name='Developing a bioinformatics pipeline for immunome analysis').first()
        project19 = Project.query.filter_by(name='Event Aggregation and Management Platform').first()
        project20 = Project.query.filter_by(name='Comparative Analysis of Fine-Tuning Techniques for Large Language Models on Domain-Specific Tasks').first()
        project21 = Project.query.filter_by(name='Gamification for rehabilitation using HMD VR').first()
        project22 = Project.query.filter_by(name='Business Process for SMEs Utilizing E-invoicing APIs').first()



        stu1 = User.query.filter_by(email='student1@ad.unsw.edu.au').first()
        stu2 = User.query.filter_by(email='student2@ad.unsw.edu.au').first()
        stu3 = User.query.filter_by(email='student3@ad.unsw.edu.au').first()
        stu4 = User.query.filter_by(email='student4@ad.unsw.edu.au').first()
        stu5 = User.query.filter_by(email='student5@ad.unsw.edu.au').first()
        stu6 = User.query.filter_by(email='student6@ad.unsw.edu.au').first()
        stu7 = User.query.filter_by(email='student7@ad.unsw.edu.au').first()
        stu8 = User.query.filter_by(email='student8@ad.unsw.edu.au').first()
        stu9 = User.query.filter_by(email='student9@ad.unsw.edu.au').first()
        stu10 = User.query.filter_by(email='student10@ad.unsw.edu.au').first()
        stu11 = User.query.filter_by(email='student11@ad.unsw.edu.au').first()
        stu12 = User.query.filter_by(email='student12@ad.unsw.edu.au').first()
        stu13 = User.query.filter_by(email='student13@ad.unsw.edu.au').first()
        stu14 = User.query.filter_by(email='student14@ad.unsw.edu.au').first()
        stu15 = User.query.filter_by(email='student15@ad.unsw.edu.au').first()
        stu16 = User.query.filter_by(email='student16@ad.unsw.edu.au').first()
        stu17 = User.query.filter_by(email='student17@ad.unsw.edu.au').first()
        stu18 = User.query.filter_by(email='student18@ad.unsw.edu.au').first()
        stu19 = User.query.filter_by(email='student19@ad.unsw.edu.au').first()
        stu20 = User.query.filter_by(email='student20@ad.unsw.edu.au').first()
        stu21 = User.query.filter_by(email='student21@ad.unsw.edu.au').first()
        stu22 = User.query.filter_by(email='student22@ad.unsw.edu.au').first()
        stu23 = User.query.filter_by(email='student23@ad.unsw.edu.au').first()
        stu24 = User.query.filter_by(email='student24@ad.unsw.edu.au').first()
        stu25 = User.query.filter_by(email='student25@ad.unsw.edu.au').first()
        stu26 = User.query.filter_by(email='student26@ad.unsw.edu.au').first()
        stu27 = User.query.filter_by(email='student27@ad.unsw.edu.au').first()
        stu28 = User.query.filter_by(email='student28@ad.unsw.edu.au').first()
        stu29 = User.query.filter_by(email='student29@ad.unsw.edu.au').first()
        stu30 = User.query.filter_by(email='student30@ad.unsw.edu.au').first()


        groups_data = [
            {'name': 'Group 1', 'description': 'Group 1 description', 'create_by': stu23.id, 'size': 4},
            {'name': 'Group 2', 'description': 'Group 2 description', 'create_by': stu27.id, 'size': 4}
        ]

        for group_data in groups_data:
            group = Group.query.filter_by(name=group_data['name']).first()
            if not group:
                group = Group(name=group_data['name'], description=group_data['description'],
                              create_by=group_data['create_by'], size=group_data['size'])
                db.session.add(group)
        db.session.commit()

        group1 = Group.query.filter_by(name='Group 1').first()
        group2 = Group.query.filter_by(name='Group 2').first()

        
        if stu23 not in group1.members:
            group1.members.append(stu23)       
        if stu24 not in group1.members:
            group1.members.append(stu24)
        if stu25 not in group1.members:
            group1.members.append(stu25)
        if stu26 not in group1.members:
            group1.members.append(stu26)
        # if stu27 not in group2.members:
        #     group2.members.append(stu27)
        if stu28 not in group2.members:
            group2.members.append(stu28)
        if stu29 not in group2.members:
            group2.members.append(stu29)


        if group1 not in project1.group:
            project1.group.append(group1)
        if group2 not in project1.group:
            project1.group.append(group2)

        
        if group1 not in stu23.groups:
            stu23.groups.append(group1)
        if group1 not in stu24.groups:
            stu24.groups.append(group1)
        if group1 not in stu25.groups:
            stu25.groups.append(group1)
        if group1 not in stu26.groups:
            stu26.groups.append(group1)
        # if group2 not in stu27.groups:
        #     stu27.groups.append(group2)            
        if group2 not in stu28.groups:
            stu28.groups.append(group2)
        if group2 not in stu29.groups:
            stu29.groups.append(group2)


        if project1 not in stu23.projects:
            stu23.projects.append(project1)
        if project1 not in stu24.projects:
            stu24.projects.append(project1)
        if project1 not in stu25.projects:
            stu25.projects.append(project1)
        if project1 not in stu26.projects:
            stu26.projects.append(project1)
        # if project1 not in stu27.projects:
        #     stu27.projects.append(project1)
        if project1 not in stu28.projects:
            stu28.projects.append(project1)
        if project1 not in stu29.projects:
            stu29.projects.append(project1)


        db.session.commit()

        comp9021 = Course.query.filter_by(code='COMP9021').first()
        comp9311 = Course.query.filter_by(code='COMP9311').first()
        comp9020 = Course.query.filter_by(code='COMP9020').first()
        comp9024 = Course.query.filter_by(code='COMP9024').first()
        comp9331 = Course.query.filter_by(code='COMP9331').first()
        comp9417 = Course.query.filter_by(code='COMP9417').first()
        comp9444 = Course.query.filter_by(code='COMP9444').first()
        comp6080 = Course.query.filter_by(code='COMP6080').first()
        comp1531 = Course.query.filter_by(code='COMP1531').first()
        comp6713 = Course.query.filter_by(code='COMP6713').first()
        comp1521 = Course.query.filter_by(code='COMP1521').first()
        comp3900 = Course.query.filter_by(code='COMP3900').first()
        data9001 = Course.query.filter_by(code='DATA9001').first()
        binf3010 = Course.query.filter_by(code='BINF3010').first()
        binf9010 = Course.query.filter_by(code='BINF9010').first()
        zeit4161 = Course.query.filter_by(code='ZEIT4161').first()
        comp6771 = Course.query.filter_by(code='COMP6771').first()
        comp9418 = Course.query.filter_by(code='COMP9418').first()
        math3101 = Course.query.filter_by(code='MATH3101').first()
        comp3511 = Course.query.filter_by(code='COMP3511').first()
        courses = [comp9021, comp9311, comp9020, comp9024, comp9331, comp9417, comp9444, 
                   comp6080, comp1531, comp6713, comp1521, comp3900, data9001, binf3010,
                   binf9010, zeit4161, comp6771, comp9418, math3101, comp3511]
        students = [stu1, stu2, stu3, stu4, stu5, stu6, stu7, stu8, stu9, stu10, 
                    stu11, stu12, stu13, stu14, stu15, stu16, stu17, stu18, stu19, stu20, 
                    stu21, stu22, stu23, stu24, stu25, stu26, stu27, stu28, stu29]
        
        courses_for_stu = [binf3010, zeit4161, data9001]
        for course in courses_for_stu:
            if course not in stu30.courses and course is not None:
                    stu30.courses.append(course)
                    for skill in course.skill:
                        if skill not in student.skills:
                            stu30.skills.append(skill)

        # for course in courses:
        #     if course not in stu1.courses:
        #         stu1.courses.append(course)
        #         for skill in course.skill:
        #             if skill not in stu1.skills:
        #                 stu1.skills.append(skill)

        for student in students:
            if student is not None:
                assigned_courses = random.sample(courses, k=3)
                for course in assigned_courses:
                    if course not in student.courses and course is not None:
                            student.courses.append(course)
                            for skill in course.skill:
                                if skill not in student.skills:
                                    student.skills.append(skill)

        db.session.commit()

        # Retrieve existing skills or create new ones
        skill1 = Skill.query.filter_by(name='Basic biology').first()
        skill2 = Skill.query.filter_by(name='bioinformatics tool usage').first()
        skill3 = Skill.query.filter_by(name='biological data analysis').first()
        skill4 = Skill.query.filter_by(name='protein structure prediction').first()
        skill5 = Skill.query.filter_by(name='R programming for bioinformatics').first()
        skill6 = Skill.query.filter_by(name='data interpretation in proteomics').first()
        skill7 = Skill.query.filter_by(name='proteomic analysis').first()
        skill8 = Skill.query.filter_by(name='systems biology').first()
        skill9 = Skill.query.filter_by(name='DNA analysis').first()
        skill10 = Skill.query.filter_by(name='RNA analysis').first()
        skill11 = Skill.query.filter_by(name='protein analysis').first()
        skill12 = Skill.query.filter_by(name='Data Analysis').first()
        skill13 = Skill.query.filter_by(name='Python').first()
        skill14 = Skill.query.filter_by(name='C').first()
        skill15 = Skill.query.filter_by(name='C++').first()
        skill16 = Skill.query.filter_by(name='PyTorch').first()
        skill17 = Skill.query.filter_by(name='TensorFlow').first()
        skill18 = Skill.query.filter_by(name='scikit-learn').first()
        skill19 = Skill.query.filter_by(name='SQL').first()
        skill20 = Skill.query.filter_by(name='HTML').first()
        skill21 = Skill.query.filter_by(name='CSS').first()
        skill22 = Skill.query.filter_by(name='JavaScript (React/ React Native, Angular, Vue.js)').first()
        skill23 = Skill.query.filter_by(name='Shell Scripting languages').first()
        skill24 = Skill.query.filter_by(name='R').first()
        skill25 = Skill.query.filter_by(name='Node.js').first()
        skill26 = Skill.query.filter_by(name='Java').first()
        skill27 = Skill.query.filter_by(name='MATLAB').first()
        skill28 = Skill.query.filter_by(name='web application development').first()
        skill29 = Skill.query.filter_by(name='Version control systems: Git, GitHub, GitLab').first()
        skill30 = Skill.query.filter_by(name='front-end').first()
        skill31 = Skill.query.filter_by(name='back-end').first()
        skill32 = Skill.query.filter_by(name='continuous integration and deployment').first()
        skill33 = Skill.query.filter_by(name='API Development: RESTful, GraphQL APIs').first()
        skill34 = Skill.query.filter_by(name='code debugging and testing').first()
        skill35 = Skill.query.filter_by(name='UI design').first()
        skill36 = Skill.query.filter_by(name='database design and management: NoSQL, MySQL, PostgreSQL, MongoDB').first()
        skill37 = Skill.query.filter_by(name='Docker').first()
        skill38 = Skill.query.filter_by(name='Web data search and retrieval').first()
        skill39 = Skill.query.filter_by(name='NLP').first()
        skill40 = Skill.query.filter_by(name='LLM').first()
        skill41 = Skill.query.filter_by(name='Transformers').first()
        skill42 = Skill.query.filter_by(name='language models and fine-tuning techniques').first()
        skill43 = Skill.query.filter_by(name='HuggingFace').first()
        skill44 = Skill.query.filter_by(name='Optimization').first()
        skill45 = Skill.query.filter_by(name='summarization').first()
        skill46 = Skill.query.filter_by(name='computer vision').first()
        skill47 = Skill.query.filter_by(name='AI programming').first()
        skill48 = Skill.query.filter_by(name='AI integration').first()
        skill49 = Skill.query.filter_by(name='Project management').first()
        skill50 = Skill.query.filter_by(name='Machine learning').first()
        skill51 = Skill.query.filter_by(name='Bayesian statistics').first()
        skill52 = Skill.query.filter_by(name='data management and interpretation').first()
        skill53 = Skill.query.filter_by(name='Team Collaboration').first()
        skill54 = Skill.query.filter_by(name='neural networks').first()
        skill55 = Skill.query.filter_by(name='Bayesian statistics').first()
        skill56 = Skill.query.filter_by(name='Agile software development methods, practices and tools').first()
        skill57 = Skill.query.filter_by(name='web scrapping').first()
        skill58 = Skill.query.filter_by(name='agile software development').first()
        skill59 = Skill.query.filter_by(name='testing frameworks and practices').first()
        skill60 = Skill.query.filter_by(name='Gamification knowledge').first()
        skill61 = Skill.query.filter_by(name='hardware APIs and SDKs').first()
        skill62 = Skill.query.filter_by(name='cross-platform compatibility').first()
        skill63 = Skill.query.filter_by(name='event data processing').first()
        skill64 = Skill.query.filter_by(name='Data visualization').first()
        skill65 = Skill.query.filter_by(name='statistical principles in bioinformatics').first()
        skill66 = Skill.query.filter_by(name='statistical analysis').first()


        projects = [project3, project4, project5, project6, project7, project8, project9, project10,
                    project11, project12, project13, project14, project15, project16, project17, project18,
                    project19, project20, project21, project22]
        skills = [skill1, skill2, skill3, skill4, skill5, skill6, skill7, skill8, skill9, skill10,
                  skill11, skill12, skill13, skill14, skill15, skill16, skill17, skill18, skill19, skill20,
                  skill21, skill22, skill23, skill24, skill25, skill26, skill27, skill28, skill29, skill30,
                  skill31, skill32, skill33, skill34, skill35, skill36, skill37, skill38, skill39, skill40,
                  skill41, skill42, skill43, skill44, skill45, skill46, skill47, skill48, skill49, skill50,
                  skill51, skill52, skill53, skill54, skill55, skill56, skill57, skill58, skill59, skill60,
                  skill61, skill62, skill63, skill64, skill65, skill66]
        

        for project in projects:
            if project is not None:
                assigned_skills = random.sample(skills, k=10)
                for skill in assigned_skills:
                    if skill not in project.skill and skill is not None:
                            project.skill.append(skill)

        db.session.commit()

        if project1 is not None:
            if skill19 is not None and skill19 not in project1.skill:
                project1.skill.append(skill19)
            if skill20 is not None and skill20 not in project1.skill:
                project1.skill.append(skill20)
            if skill21 is not None and skill21 not in project1.skill:
                project1.skill.append(skill21)
            if skill22 is not None and skill22 not in project1.skill:
                project1.skill.append(skill22)
            if skill23 is not None and skill23 not in project1.skill:
                project1.skill.append(skill23)
            if skill25 is not None and skill25 not in project1.skill:
                project1.skill.append(skill25)
            if skill28 is not None and skill28 not in project1.skill:
                project1.skill.append(skill28)
            if skill29 is not None and skill29 not in project1.skill:
                project1.skill.append(skill29)
            if skill30 is not None and skill30 not in project1.skill:
                project1.skill.append(skill30)
            if skill31 is not None and skill31 not in project1.skill:
                project1.skill.append(skill31)
            if skill32 is not None and skill32 not in project1.skill:
                project1.skill.append(skill32)
            if skill33 is not None and skill33 not in project1.skill:
                project1.skill.append(skill33)
            if skill34 is not None and skill34 not in project1.skill:
                project1.skill.append(skill34)
            if skill35 is not None and skill35 not in project1.skill:
                project1.skill.append(skill35)
            if skill36 is not None and skill36 not in project1.skill:
                project1.skill.append(skill36)
            if skill37 is not None and skill37 not in project1.skill:
                project1.skill.append(skill37)
            if skill38 is not None and skill38 not in project1.skill:
                project1.skill.append(skill38)
            if skill39 is not None and skill39 not in project1.skill:
                project1.skill.append(skill39)
            if skill42 is not None and skill42 not in project1.skill:
                project1.skill.append(skill42)
            if skill49 is not None and skill49 not in project1.skill:
                project1.skill.append(skill49)
            if skill58 is not None and skill58 not in project1.skill:
                project1.skill.append(skill58)
            if skill56 is not None and skill56 not in project1.skill:
                project1.skill.append(skill56)
            if skill59 is not None and skill59 not in project1.skill:
                project1.skill.append(skill59)
            if skill57 is not None and skill57 not in project1.skill:
                project1.skill.append(skill57)

            db.session.commit()


        if project2 is not None:
            if skill1 is not None and skill1 not in project2.skill:
                project2.skill.append(skill1)
            if skill2 is not None and skill2 not in project2.skill:
                project2.skill.append(skill2)
            if skill3 is not None and skill3 not in project2.skill:
                project2.skill.append(skill3)
            if skill4 is not None and skill4 not in project2.skill:
                project2.skill.append(skill4)
            if skill5 is not None and skill5 not in project2.skill:
                project2.skill.append(skill5)
            if skill6 is not None and skill6 not in project2.skill:
                project2.skill.append(skill6)
            if skill7 is not None and skill7 not in project2.skill:
                project2.skill.append(skill7)
            if skill8 is not None and skill8 not in project2.skill:
                project2.skill.append(skill8)
            if skill23 is not None and skill23 not in project2.skill:
                project2.skill.append(skill23)
            if skill24 is not None and skill24 not in project2.skill:
                project2.skill.append(skill24)
            if skill12 is not None and skill12 not in project2.skill:
                project2.skill.append(skill12)
            if skill9 is not None and skill9 not in project2.skill:
                project2.skill.append(skill9)
            if skill10 is not None and skill10 not in project2.skill:
                project2.skill.append(skill10)
            if skill11 is not None and skill11 not in project2.skill:
                project2.skill.append(skill11)
            if skill64 is not None and skill64 not in project2.skill:
                project2.skill.append(skill64)
            if skill65 is not None and skill65 not in project2.skill:
                project2.skill.append(skill65)
            if skill66 is not None and skill66 not in project2.skill:
                project2.skill.append(skill66)

            db.session.commit()


            message1 = Message(sender_id=stu30.id, receiver_id=stu1.id, content = 'Hi! How are you:)')
            message2 = Message(sender_id=stu1.id, receiver_id=stu30.id, content = 'I\'m fine. Thank you~')
            message3 = Message(sender_id=stu29.id, receiver_id=stu30.id, content = 'Can you share your profile with me?')

            db.session.add(message1)
            db.session.add(message2)
            db.session.add(message3)
            db.session.commit()



