\c party_room_project -- enter the database

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	phone_no VARCHAR(255),
    date_of_birth DATE,
    email VARCHAR(255),
    UNIQUE (phone_no, email)
);

-- Test your database:
-- insert into users (name, password, phone_no, date_of_birth, email) values ('nero', 'nero', '55832260', '1996-01-01', 'nero@xxx.com');
-- delete from users where id = 1;

DROP TABLE IF EXISTS partyrooms;
CREATE TABLE partyrooms (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
    price INT,
    venue VARCHAR(255),
    style VARCHAR(255),
    area INT,
    capacity INT,
    intro TEXT,
    imagefilename VARCHAR(255),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
	id SERIAL PRIMARY KEY,
    user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id),
    partyroom_id INT,
	FOREIGN KEY (partyroom_id) REFERENCES partyrooms(id),
    participants INT,
    special_req TEXT,
    payment_type VARCHAR(255),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
    start_at TIMESTAMP,
    finish_at TIMESTAMP
);

DROP TABLE IF EXISTS ratings;
CREATE TABLE ratings (
	id SERIAL PRIMARY KEY,
    user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(id),
    partyroom_id INT,
	FOREIGN KEY (partyroom_id) REFERENCES partyrooms(id),
    ratings INT,
    comments TEXT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS equipments;
CREATE TABLE equipments (
	id SERIAL PRIMARY KEY,
	equipment_in_service VARCHAR(255),
	switch_game VARCHAR(255),
    board_game VARCHAR(255)
);

DROP TABLE IF EXISTS eq_rm_relation;
CREATE TABLE eq_rm_relation (
	id SERIAL PRIMARY KEY,
    partyroom_id INT,
	FOREIGN KEY (partyroom_id) REFERENCES partyrooms(id),
    equipment_id INT,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
);
