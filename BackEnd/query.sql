create table t_login(
f_sno int auto_increment primary Key,
f_userName varchar(500) unique,
f_Pwd varchar(5000)
);

CREATE TABLE t_Employee (
    f_id INT AUTO_INCREMENT PRIMARY KEY,
    f_image BLOB,  
    f_Name VARCHAR(500),
    f_Email VARCHAR(1000),
    f_Mobile BIGINT,  
    f_Designation VARCHAR(50),
    f_gender VARCHAR(50),
    f_Course VARCHAR(50),
    f_CreateDate DATE
);

CREATE TABLE session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL,
    access_token TEXT NOT NULL,
    access_token_expiration DATETIME NOT NULL,
    refresh_token TEXT NOT NULL,
    refresh_token_expiration DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES t_login(f_sno)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);