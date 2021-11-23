/*
CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY,
  email varchar(200) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(128) NOT NULL,
  bio varchar(500) ,
  pic BYTEA ,
  PRIMARY KEY (id)

);


CREATE TABLE accept_lang (
  id INT GENERATED ALWAYS AS IDENTITY,
  lang_name varchar(250) NOT NULL,
  level INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  constraint fk_user_id
      foreign key (user_id) REFERENCES users(id)

);


CREATE TABLE offer_lang (
  id INT GENERATED ALWAYS AS IDENTITY,
  lang_name varchar(250) NOT NULL,
  level INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  constraint fk_user_id
      foreign key (user_id) REFERENCES users(id)

);

INSERT INTO users( email, username, password, bio)

VALUES( 'sean004@xxxxxxx.com', 'sean00000004', 'pwgrdrgre!!', 'grttjtjt' ),
    ( 'sean002@xxxxxxx.com', 'sean00000002', 'pwgrdrgre!!', 'grttjtjt' ),
('sean003@xxxxxxx.com', 'sean0000003', 'pwgrdrgre!!', 'grttjtjt' );


INSERT INTO accept_lang( user_id, lang_name, level)
VALUES( 1, 'Chinese', 1 ),( 1, 'English', 1 ),( 1, 'Japanese', 1 ),
( 2, 'German', 1 ),( 2, 'Japanese', 1 ),( 2, 'French', 1 ),
( 3, 'Arabic', 1 ),( 3, 'Chinese', 1 ),( 3, 'Japanese', 1 );

INSERT INTO offer_lang( user_id, lang_name, level)
VALUES( 1, 'German', 1 ),( 1, 'Arabic', 1 ),( 1, 'Japanese', 1 ),
( 2, 'Chinese', 6 ),( 2, 'English', 6 ),( 2, 'Spainish', 6 ),
( 3, 'English', 5 ),( 3, 'French', 4 ),( 3, 'German', 6 );


SELECT * FROM accept_lang


*/

