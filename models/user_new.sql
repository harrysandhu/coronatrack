
DROP TABLE Auth;
DROP TABLE Session;
DROP TABLE User;


CREATE TABLE _user(
    userId				VARCHAR (50) NOT NULL,
    name 				VARCHAR (100) NOT NULL,
    username			VARCHAR (50) NOT NULL,
    phoneNumber			CHAR(10),
    phoneExtension		CHAR(2),	
    emailAddress		VARCHAR (255) NOT NULL,
    location 			VARCHAR(255),
    currentLocation 	VARCHAR(255),
    isBusinessUser 		BOOLEAN DEFAULT false NOT NULL,
    profilePictureURL 	TEXT,
    emailIsVerified	 	BOOLEAN DEFAULT false,
    phoneIsVerified		BOOLEAN DEFAULT false,

    CONSTRAINT userPK PRIMARY KEY (userId),
    CONSTRAINT userId_unique UNIQUE (userId),
    CONSTRAINT emailAddress_unique UNIQUE (emailAddress),
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT emailAddress_length CHECK (emailAddress),	
    CONSTRAINT name_length CHECK (char_length(name) > 0)

);

CREATE TABLE _auth(
    authId 				VARCHAR (50) NOT NULL,
    userId 				VARCHAR (50) NOT NULL,
    password_hash 		VARCHAR (511) NOT NULL,
    salt 				VARCHAR (40) NOT NULL,
    PRIMARY KEY(authId),
    CONSTRAINT userIdFK FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE _session(
    sessionId 			VARCHAR(50) NOT NULL,
    userId 				VARCHAR (50) NOT NULL,
    session_start 		TIMETZ NOT NULL,
    device_info 		TEXT,
    session_end			TIMETZ DEFAULT NULL,
    session_active 		BOOLEAN DEFAULT true,

    PRIMARY KEY(sessionId),
    CONSTRAINT userIdFK1 FOREIGN KEY (userId) REFERENCES User(userId)
    
);


CREATE TABLE Category(
    categoryId INTEGER NOT NULL,
    categoryName VARCHAR (100) NOT NULL,
    categoryWeight INTEGER DEFAULT -1 NOT NULL,

    PRIMARY KEY(categoryId)
);





INSERT INTO _user VALUES ('fewsa', 'fewsa', 'fewsa', '9914091032', '1', 'fewsa', 'fewsa', 'fewsa', true,'fsacaas' )
