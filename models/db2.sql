

CREATE TABLE auth(
    auth_id VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(511) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    PRIMARY KEY(auth_id)
);

--TODO LOCATION DATA

CREATE TABLE IF NOT EXISTS _business_user(
    b_id VARCHAR (100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR (255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE,
    phone_ext VARCHAR(2) NOT NULL,
    profile_pic_url VARCHAR(255) NOT NULL,
    email_is_verified BOOLEAN NOT NULL DEFAULT false,
    phone_is_verified BOOLEAN NOT NULL DEFAULT false,
    signup_datetime TIMETZ NOT NULL,
    u_id VARCHAR (100) NOT NULL UNIQUE
    CONSTRAINT pk PRIMARY KEY(b_id),
    CONSTRAINT userfk FOREIGN KEY(u_id) REFERENCES _user(u_id)
);




CREATE TABLE IF NOT EXISTS _user(
    u_id VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR (255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE,
    phone_ext VARCHAR(2) NOT NULL,
    profile_pic_url VARCHAR(255) NOT NULL,
    email_is_verified BOOLEAN DEFAULT false,
    phone_is_verified BOOLEAN NOT NULL DEFAULT false,
    is_business BOOLEAN NOT NULL DEFAULT false,
    signup_datetime TIMETZ NOT NULL
);



