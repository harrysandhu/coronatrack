
CREATE TABLE IF NOT EXISTS _user(
    d_id VARCHAR(100) NOT NULL UNIQUE,
    u_id VARCHAR(100) NOT NULL UNIQUE,
    age SMALLINT NOT NULL,
    gender SMALLINT NOT NULL,
    location_is_allowed BOOLEAN NOT NULL DEFAULT false,
    location jsonb,
    signup_datetime timestamp NOT NULL,
    CONSTRAINT pk PRIMARY KEY(d_id)
);


CREATE TABLE IF NOT EXISTS _record(
    record_datetime DATE NOT NULL,
    d_id VARCHAR(100) NOT NULL,
    location jsonb,
    symptoms jsonb,
    CONSTRAINT pk_record PRIMARY KEY(record_datetime, d_id),
    CONSTRAINT userfk FOREIGN KEY(d_id) REFERENCES _user(d_id) 
);



CREATE TABLE IF NOT EXISTS _infection_location(
    d_id VARCHAR(100) NOT NULL,
    location jsonb,
    infection_probability NUMERIC(5, 2) NOT NULL DEFAULT 0,
    atDatetime timestamp NOT NULL,
    CONSTRAINT pk_infection PRIMARY KEY(d_id, location, atDatetime),
    CONSTRAINT userfk FOREIGN KEY(d_id) REFERENCES _user(d_id)
);

