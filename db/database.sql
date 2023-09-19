CREATE DATABASE IF NOT EXISTS cookiodb;
USE cookiodb;

CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(45) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT NULL,
    likes INT(11) DEFAULT 0,
    reposts INT(11) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO users (username, name, password, email, salt, profile_pic) 
VALUES ('Admin', 'Jorge Garcia', 'password', 'test@gmail.com', 'salt', 'https://www.w3schools.com/howto/img_avatar.png');


