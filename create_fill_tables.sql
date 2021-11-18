CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY,
  email varchar(200) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(128) NOT NULL,
  bio varchar(500) ,
  pic BYTEA ,
  user_acpt_lang json NOT NULL,
  user_offer_lang json NOT NULL,
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

INSERT INTO users( email, username, password, user_offer_lang, user_acpt_lang, bio)

VALUES( 'sean004@xxxxxxx.com', 'sean004', 'pw', '[
        {
            "lang_name": "Chinese",
            "level": "3"
        },
        {
            "lang_name": "Spanish",
            "level": "6"
        },
       {
            "lang_name": "Icelandic",
            "level": "6"
        }
    ]', '[
        {
            "lang_name": "English",
            "level": "6"
        },
        {
            "lang_name": "German",
            "level": "6"
        },
        {
            "lang_name": "Latin",
            "level": "1"
        }
    ]', 'grttjtjt' ),
	
    ( 'sean002@xxxxxxx.com', 'sean002', 'pw', '[
        {
            "lang_name": "English",
            "level": "3"
        },
        {
            "lang_name": "Japanese",
            "level": "6"
        }
    ]', '[
        {
            "lang_name": "Icelandic",
            "level": "6"
        }
    ]', 'grttjtjt' ),


( 'sean003@xxxxxxx.com', 'sean003', 'pw', '[
        {
            "lang_name": "Icelandic",
            "level": "3"
        },
        {
            "lang_name": "Spanish",
            "level": "6"
        }
    ]', '[
        {
            "lang_name": "English",
            "level": "6"
        },
       {
            "lang_name": "Chinese",
            "level": "6"
        },
       {
            "lang_name": "German",
            "level": "6"
        }
    ]', 'grttjtjt' );

