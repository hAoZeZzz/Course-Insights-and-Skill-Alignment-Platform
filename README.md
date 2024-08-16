# Course Insights and Skill Alignment Platform:
## Aim & Scope:
The project aims to develop a web application platform that collect and aggregate course  
information (course outlines) from different data sources (e.g., web pages, other systems) and  
implement an LLM-supported module to summarize the topics, knowledge, and skills covered  
in each course. Additionally, the application allows users to input their completed courses, and  
work experience, and use AI based decision making system to assess how well their knowledge  
and skills align with project requirements.  
### Pineapple team   
    
    z5347737@ad.unsw.edu.au Zhaoye Zhang  
    z5364634@ad.unsw.edu.au Haoze Zhang  
    z5379532@ad.unsw.edu.au Kenan Xie 
    z5443505@ad.unsw.edu.au Tingyu Shi 
    z5496029@ad.unsw.edu.au Yinru Sun 
    z5414420@ad.unsw.edu.au Zhongtian Wang

## Running on docker:
Make sure you have installed and running Docker:

### Git configuration    

Ensure that the global Git configuration does not automatically convert line terminators

    git config --global core.autocrlf false
### Clone the repository    
    
    git clone https://github.com/unsw-cse-comp99-3900-24t1/capstone-project-9900w16apineapple.git
    cd capstone-project-9900w16apineapple
### Running the docker containers

In the __docker-compose.yml__ file, relevant parameters can be set, such as database user and password, port number.

**Important：**
Please ensure that the following ports are available and not occupied by other services:

- **Port 3000**: This port is used for the frontend server.
- **Port 5000**: This port is used for the backend server.
- **Port 3306**: This port is used for the database.



Run the following command in the root directory of the project to start the Docker container.

    docker-compose up
    
### Waiting for completion

Then you can access the page through the following URL  


    localhost:3000
    
### Data Path

The **course data** path

    backend/CSE_Skill.csv

The **project data** path

    backend/sudo_projects.csv

Other **test data** path

    backend/app/test_data.py

