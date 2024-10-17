import mysql from 'mysql2/promise';

const serverConnection = await mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  multipleStatements: true,
});

serverConnection.connect();

//---create database and tables
await serverConnection.query(`
  DROP DATABASE IF EXISTS meetup;
  CREATE DATABASE meetup;
  USE meetup;
`);

await serverConnection.query(`
  CREATE TABLE meetup (
    invitee_no INTEGER AUTO_INCREMENT PRIMARY KEY,
    invitee_name VARCHAR(50) NOT NULL,
    invited_by VARCHAR(50) NOT NULL
  );
  
  CREATE TABLE room (
    room_no INTEGER AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(50) NOT NULL,
    floor_number INTEGER NOT NULL
  );

  CREATE TABLE meeting (
    meeting_no INTEGER AUTO_INCREMENT PRIMARY KEY,
    meeting_title VARCHAR(50) NOT NULL,
    starting_time DATETIME NOT NULL,
    ending_time DATETIME NOT NULL,
    room_no INTEGER NOT NULL,
    FOREIGN KEY (room_no) REFERENCES room(room_no)
  );
`);

//---populate tables
await serverConnection.query(`
  INSERT INTO meetup (invitee_name, invited_by) VALUES
    ('John Doe', 'Jane Doe'),
    ('Jane Doe', 'John Doe'),
    ('Alice', 'Bob'),
    ('Bob', 'Alice'),
    ('Charlie', 'David');
  
  INSERT INTO room (room_name, floor_number) VALUES
    ('Room 1', 1),
    ('Room 2', 2),
    ('Room 3', 3),
    ('Room 4', 4),
    ('Room 5', 5);
  
  INSERT INTO meeting (meeting_title, starting_time, ending_time, room_no) VALUES
    ('Meeting 1', '2021-01-01 10:00:00', '2021-01-01 11:00:00', 1),
    ('Meeting 2', '2021-01-01 11:00:00', '2021-01-01 12:00:00', 2),
    ('Meeting 3', '2021-01-01 12:00:00', '2021-01-01 13:00:00', 3),
    ('Meeting 4', '2021-01-01 13:00:00', '2021-01-01 14:00:00', 4),
    ('Meeting 5', '2021-01-01 14:00:00', '2021-01-01 15:00:00', 5);
`);

serverConnection.end();
