CREATE TABLE research_papers (
  paper_id INT AUTO_INCREMENT PRIMARY KEY,
  paper_title VARCHAR(100) NOT NULL,
  conference VARCHAR(100) NOT NULL,
  publish_date DATE NOT NULL
);

CREATE TABLE authors_papers (
  author_id INT,
  paper_id INT,
  PRIMARY KEY (author_id, paper_id),
  FOREIGN KEY (author_id) REFERENCES authors(author_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);