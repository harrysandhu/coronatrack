
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
    record_datetime timestamp with time zone NOT NULL,
    d_id VARCHAR(100) NOT NULL,
    location jsonb,
    symptoms jsonb,
    CONSTRAINT pk_record PRIMARY KEY(record_datetime, d_id),
    CONSTRAINT userfk FOREIGN KEY(d_id) REFERENCES _user(d_id) 
);




CREATE TABLE IF NOT EXISTS _infection(
    d_id VARCHAR(100) NOT NULL,
    location_geohash VARCHAR(12) NOT NULL,
    infection_probability NUMERIC(5, 2) NOT NULL DEFAULT 0,
    at_datetime timestamp NOT NULL,
    CONSTRAINT pk_inf PRIMARY KEY(d_id, location_geohash, at_datetime),
    CONSTRAINT userfk FOREIGN KEY(d_id) REFERENCES _user(d_id)
);





