CREATE TABLE IF NOT EXISTS _auth(
    auth_id VARCHAR (100) NOT NULL UNIQUE,
    user_id VARCHAR (100) NOT NULL UNIQUE,
    password_hash VARCHAR (511) NOT NULL,
    salt VARCHAR (40) NOT NULL,
    PRIMARY KEY(auth_id),
    CONSTRAINT userfk FOREIGN KEY(user_id) REFERENCES _user(user_id)
);


CREATE TABLE IF NOT EXISTS _user(
    user_id VARCHAR (100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email_address VARCHAR (255) UNIQUE,
    username VARCHAR (255) UNIQUE,
    phone_number VARCHAR (12) UNIQUE,
    phone_number_ext VARCHAR (2),
    profile_picture_url VARCHAR(1024),
    signup_datetime timestamptz NOT NULL,
    is_business_user BOOLEAN NOT NULL DEFAULT FALSE,
    email_is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY(user_id)
);



CREATE TABLE IF NOT EXISTS _business_user(
    business_id VARCHAR (100) NOT NULL UNIQUE,
    user_id VARCHAR (100) NOT NULL UNIQUE,
    business_email_address VARCHAR (255) NOT NULL UNIQUE,
    business_phone VARCHAR (255) NOT NULL UNIQUE,
    business_name VARCHAR(100) NOT NULL,
    business_location VARCHAR(100) NOT NULL UNIQUE,
    business_picture_url VARCHAR(1024),
    PRIMARY KEY(business_id, user_id),
    CONSTRAINT userfk FOREIGN KEY(user_id) REFERENCES _user(user_id)
);



CREATE TABLE IF NOT EXISTS _business_user(
    b_id VARCHAR (100) NOT NULL UNIQUE,
    email VARCHAR (255) NOT NULL UNIQUE,
    business_phone VARCHAR (255) NOT NULL UNIQUE,
    business_name VARCHAR(100) NOT NULL,
    business_location VARCHAR(100) NOT NULL UNIQUE,
    business_picture_url VARCHAR(1024),
    PRIMARY KEY(business_id, user_id),
    CONSTRAINT userfk FOREIGN KEY(user_id) REFERENCES _user(user_id)
);





CREATE TABLE IF NOT EXISTS _user_signup_process(
    signup_id VARCHAR (100) NOT NULL UNIQUE,
    phone_number VARCHAR(11) UNIQUE,
    email_address VARCHAR (255) UNIQUE,
    username VARCHAR (255) UNIQUE,
    PRIMARY KEY(signup_id)
);




CREATE TABLE IF NOT EXISTS _phone_number(
    phone_number VARCHAR (11) NOT NULL UNIQUE,
    phone_number_ext VARCHAR (2) NOT NULL,
    pn_code VARCHAR (5),
    phone_is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(phone_number)
);  


CREATE TABLE IF NOT EXISTS _user_session(
    sess_id VARCHAR(100) NOT NULL UNIQUE,
    id VARCHAR(100) NOT NULL, 
    ip_address VARCHAR (255) NOT NULL,
    session_start timestamptz NOT NULL,
    session_end timestamptz,
    PRIMARY KEY(sess_id),
    CONSTRAINT userfk FOREIGN KEY(id) REFERENCES _user(id)
);





CREATE TABLE IF NOT EXISTS _phone_verify(
    p_id VARCHAR(100) NOT NULL 
)


ALTER TABLE _user_signup_process ADD COLUMN isComplete BOOLEAN DEFAULT FALSE;
ALTER TABLE _user_signup_process ADD COLUMN startDateTime timestamptz NOT NULL;
