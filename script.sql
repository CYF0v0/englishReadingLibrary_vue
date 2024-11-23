create table course
(
    id      bigint auto_increment
        primary key,
    name    varchar(255)      null,
    teacher varchar(255)      null,
    charge  int default 10000 not null,
    status  varchar(255)      null,
    constraint course_pk
        unique (name)
);

create table enrollcourse
(
    id         int auto_increment
        primary key,
    coursename varchar(255)               not null,
    studentid  int                        null,
    date       date       default (now()) null,
    status     tinyint(1) default 0       not null,
    score      tinyint(1) default 60      not null,
    constraint unique_course_student
        unique (coursename, studentid)
);

create table parent_student
(
    id        int auto_increment
        primary key,
    parentid  int not null,
    studentid int not null
);

create table resource
(
    id        int auto_increment
        primary key,
    publisher varchar(255)         null,
    name      varchar(255)         null,
    time      date default (now()) null,
    url       varchar(255)         null
);

create table user
(
    id       bigint auto_increment
        primary key,
    username varchar(255) null,
    role     varchar(255) null,
    account  varchar(255) null,
    password varchar(255) null
);


