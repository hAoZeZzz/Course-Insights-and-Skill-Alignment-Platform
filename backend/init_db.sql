-- auto-generated definition
-- Create a database named comp9900s and run the following SQL statement:
CREATE DATABASE IF NOT EXISTS comp9900s;
USE comp9900s;

# create table courses
# (
#     code               varchar(10)  not null
#         primary key,
#     name               varchar(255) null,
#     academic_unit      varchar(255) null,
#     url                text         null,
#     course_description text         null,
#     course_aim         text         null,
#     course_outcome     text         null,
#     skill              text         null
# );
#
# create table user
# (
#     id        int auto_increment
#         primary key,
#     email     varchar(255)                          not null,
#     user_name varchar(255)                          null,
#     password  varchar(255)                          not null,
#     avatar    text                                  null,
#     bio       text                                  null,
#     role      enum ('admin', 'academic', 'student') not null,
#     is_del    tinyint(1)                            null,
#     constraint email
#         unique (email)
# );
#
# create table messages
# (
#     id          int auto_increment
#         primary key,
#     sender_id   int        not null,
#     receiver_id int        not null,
#     content     text       null,
#     emoji       text       null,
#     timestamp   datetime   not null,
#     is_read     tinyint(1) not null,
#     constraint messages_ibfk_1
#         foreign key (sender_id) references user (id),
#     constraint messages_ibfk_2
#         foreign key (receiver_id) references user (id)
# );
#
# create index receiver_id
#     on messages (receiver_id);
#
# create index sender_id
#     on messages (sender_id);
#
# create table user_course
# (
#     user_id     int         not null,
#     course_code varchar(10) not null,
#     primary key (user_id, course_code),
#     constraint user_course_ibfk_1
#         foreign key (user_id) references user (id),
#     constraint user_course_ibfk_2
#         foreign key (course_code) references courses (code)
# );
#
# create index course_code
#     on user_course (course_code);


#
#
#
# insert into comp9900s.courses (code, name, content, skill) values ('comp9820', '9820', 'good', 'good');
# insert into comp9900s.courses (code, name, content, skill) values ('comp9900', '9900', 'good', 'gooooood');
#
# insert into comp9900s.user (id, email, password, avatar, bio, role, is_del, user_name) values (1, 'admin@ad.unsw.edu.au', 'pbkdf2:sha256:600000$nTC67Wt2IluhON5U$c00df50ed6468145ee18b64c926e50ff1040bfc30f7133f41bfcdaf71fe8896b', null, null, 'admin', 0, null);
# insert into comp9900s.user (id, email, password, avatar, bio, role, is_del, username) values (2, '234@234.com', 'pbkdf2:sha256:600000$lBYhDruWBE10gKMI$a36b90805f479282ceb3246ac67cc62c9a348e7063fc6a04063ac2fda2ba3713', '3', null, 'student', 0, '234');
# insert into comp9900s.user (id, email, password, avatar, bio, role, is_del, username) values (3, '123@123.com', 'pbkdf2:sha256:600000$VUS1AULjzvSOlpd7$c42195339c674ea1b9d11c1b15242f3b23ad2dcf1ea993ecb660c330f94f3dc9', '3', null, 'student', 0, '234');
# insert into comp9900s.user (id, email, password, avatar, bio, role, is_del, username) values (4, 'asukalei0@outlook.com', 'pbkdf2:sha256:600000$550OpjQzH9bBlHG0$ce32b45bf7afb7e7355c8c30a62ce1dfc4e9da0ab0ae48de6ba1dc36fc0ef742', '3', null, 'student', 0, 'asuka');


