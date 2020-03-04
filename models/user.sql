USE DATABASE hasettDev;


CREATE TABLE IF NOT EXISTS users(
    u_id VARCHAR (100) NOT NULL,
    first_name VARCHAR (100),
    last_name VARCHAR (100),
    email_address VARCHAR (255) NOT NULL UNIQUE,
    username VARCHAR (255) NOT NULL UNIQUE,
    profile_picture VARCHAR (255),
    header_picture VARCHAR (255),
    signup_datetime DATETIME (255),
    connections INT (11) DEFAULT 0,
    active_connections INT (11) DEFAULT 0,
    business_account INT (2) DEFAULT 1,
    account_verified INT (2) DEFAULT 1,
    PRIMARY KEY (u_id)
); 


-- notifications are basically a result of 
-- a set of user_activities, 
-- on "value" change in notifications where u_id is current_user, 
-- generate notification



CREATE TABLE IF NOT EXISTS user_activities(
    user_activity_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,    
    activity_type_id INT (11) NOT NULL,
    PRIMARY KEY (user_activity_id)
);

-- CREATE TABLE IF NOT EXISTS notifications(
    
-- );



CREATE TABLE IF NOT EXISTS connections(
    connection_count_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,
    connection_id VARCHAR (100) NOT NULL,
    PRIMARY KEY(connection_count_id)
);


CREATE TABLE IF NOT EXISTS business_users(
    business_id VARCHAR (100) NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,
    business_type_id INT (11) NOT NULL,
    business_name VARCHAR (100) NOT NULL,
    business_email VARCHAR (255) NOT NULL,
    business_phone VARCHAR (20) NOT NULL,
    PRIMARY KEY(business_id)
);

CREATE TABLE IF NOT EXISTS business_keywords(
    keyword_id INT (11) AUTO INCREMENT
    business_id VARCHAR (100) NOT NULL,
    keyword VARCHAR (100) NOT NULL,
    PRIMARY KEY(business_id)
);


CREATE TABLE IF NOT EXISTS business_user(
    b_id VARCHAR (100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR (255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    phone_ext VARCHAR(2) NOT NULL,
    profile_pic_url VARCHAR(255) NOT NULL,
    email_is_verified BOOLEAN 
    phone_is_verified

);