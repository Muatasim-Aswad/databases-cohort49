-- 1- research_papers and the number of authors for each paper

SELECT p.paper_id, 
       p.paper_title,
       COUNT(a_p.author_id) AS num_authors
FROM research_papers AS p
  JOIN authors_papers AS a_p
  ON p.paper_id = a_p.paper_id
GROUP BY 1;

-- 2- number of research_papers published by females

SELECT COUNT(DISTINCT a_p.paper_id) AS num_papers_females
FROM authors_papers AS a_p
  JOIN authors AS a
  ON a_p.author_id = a.author_id
WHERE a.gender = 'F';

-- 3- average h-index for each university

SELECT university, 
       AVG(h_index) AS avg_h_index
FROM authors
GROUP BY university;

-- 4- number of papers for each university

SELECT university,
       COUNT(DISTINCT a_p.paper_id) AS number_of_papers
FROM authors_papers AS a_p
  JOIN authors AS a
  ON a_p.author_id = a.author_id
GROUP BY 1
ORDER BY 1, 2 DESC;

-- 5- universities' authors max and min h_index

SELECT university,
       MAX(h_index) AS max_h_index,
       MIN(h_index) AS min_h_index
FROM authors
GROUP BY 1
ORDER BY 1, 2 DESC;