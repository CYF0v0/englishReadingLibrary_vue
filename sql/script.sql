create table course
(
    id      int                      not null
        primary key,
    name    varchar(20)              null,
    teacher varchar(20)              null,
    charge  int        default 10000 not null,
    status  tinyint(1) default 0     not null
);

create table resource
(
    id        int         not null
        primary key,
    publisher varchar(20) null,
    name      varchar(20) not null,
    time      datetime    null,
    url       text        null
);

create table user
(
    id       int auto_increment
        primary key,
    username varchar(20) not null,
    role     varchar(20) not null
);

create table accountmsg
(
    id       int                          not null
        primary key,
    account  varchar(20)                  not null,
    password varchar(20) default '123456' not null,
    constraint accountmsg_pk
        unique (account),
    constraint accountmsg_user_id_fk
        foreign key (id) references user (id)
);

create table enrollcourse
(
    id        int                   not null
        primary key,
    courseid  int                   not null,
    studentid int                   null,
    date      datetime              null,
    status    tinyint(1) default 0  not null,
    score     tinyint(1) default 60 not null,
    constraint enrollcourse_course_id_fk
        foreign key (courseid) references course (id),
    constraint enrollcourse_user_id_fk
        foreign key (studentid) references user (id)
);

create table parent_student
(
    id        int auto_increment
        primary key,
    parentid  int not null,
    studentid int not null,
    constraint parent_student_user_id_fk
        foreign key (studentid) references user (id),
    constraint parent_student_user_id_fk_2
        foreign key (parentid) references user (id)
);


