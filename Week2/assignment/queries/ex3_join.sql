-- 1- names of all authors and their mentors

SELECT authors.author_name AS author, 
       mentors.author_name AS mentor
FROM authors
  LEFT JOIN authors AS mentors 
  ON authors.mentor = mentors.author_id;

-- 2- all authors table and their published paper titles
-- 3- excluding non-published authors

SELECT a.* ,
       IF(p.paper_title IS NULL, '', p.paper_title) 
       AS paper_title
FROM authors AS a
  LEFT JOIN authors_papers AS a_p 
  ON a.author_id = a_p.author_id
  LEFT JOIN research_papers AS p 
  ON a_p.paper_id = p.paper_id
ORDER BY a.author_id;


SELECT a.*, 
       p.paper_title
FROM authors_papers AS a_p
  JOIN authors AS a
  ON a_p.author_id = a.author_id
  JOIN research_papers AS p
  ON a_p.paper_id = p.paper_id;
