
CREATE TABLE IF NOT EXISTS _user(
    d_id VARCHAR(100) NOT NULL UNIQUE,
    u_id VARCHAR(100) NOT NULL UNIQUE,
    age SMALLINT NOT NULL,
    gender SMALLINT NOT NULL,
    location_is_allowed BOOLEAN NOT NULL DEFAULT false,
    location jsonb,
    infection_probability NUMERIC(5, 2) NOT NULL DEFAULT 0,
    signup_datetime TIMETZ NOT NULL,
    CONSTRAINT pk PRIMARY KEY(d_id)
);


CREATE TABLE IF NOT EXISTS _record(
    record_datetime TIMETZ NOT NULL,
    d_id VARCHAR(100) NOT NULL UNIQUE,
    location jsonb,
    CONSTRAINT pk_record PRIMARY KEY(record_datetime, d_id),
    CONSTRAINT userfk FOREIGN KEY(d_id) REFERENCES _user(d_id)
);



