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

//alter table users to eliminate salt column

    ALTER TABLE users DROP COLUMN salt;

CREATE TABLE IF NOT EXISTS recipes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    ingredients VARCHAR(255) NOT NULL,
    steps VARCHAR(255) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    likes INT(11) DEFAULT 0,
    edits INT(11) DEFAULT 0,
    created_by INT(11) NOT NULL,
    edited_by INT(11) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO recipes (title, description, ingredients, steps, image, created_by)
VALUES ('Test Recipe 2', 'This is a test recipe 2', '1 cup of water, 1 cup of flour', 'Mix the water and flour together', 'https://www.w3schools.com/howto/img_avatar.png', 1);

CREATE TABLE IF NOT EXISTS comments (
    id INT(11) NOT NULL AUTO_INCREMENT,
    comment VARCHAR(255) NOT NULL,
    recipe_id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    likes INT(11) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO comments (comment, recipe_id, user_id)
VALUES ('This is a test comment', 1, 1);



