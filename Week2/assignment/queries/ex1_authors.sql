CREATE TABLE authors (
  author_id INT AUTO_INCREMENT PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  university VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  h_index INT NOT NULL,
  gender ENUM('M', 'F') NOT NULL
);

ALTER TABLE authors
  ADD COLUMN mentor INT,
  ADD FOREIGN KEY (mentor) REFERENCES authors(author_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;