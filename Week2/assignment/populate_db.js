import { pool } from './index.js';
import authors from './results_&_dummyData/authors.json' with { type: "json" };
import papers from './results_&_dummyData/research_papers.json' with { type: "json" };

export default async function main() {
  const authorsRecordsIds = [];
  const papersRecordsIds = [];

  for (const author of authors) authorsRecordsIds.push(await addAuthor(author));
  for (const paper of papers) papersRecordsIds.push(await addPaper(paper));

  return { authorsRecordsIds, papersRecordsIds };
}

async function addAuthor(author) {
  const query = `
    INSERT IGNORE INTO authors 
      (author_id, author_name, university, 
       date_of_birth, h_index, gender, mentor)
    VALUES (?, ?, ?, ?, ?, ?, ?);`;

  const params = [
    author.author_id,
    author.author_name,
    author.university,
    author.date_of_birth,
    author.h_index,
    author,
  ];

  const [result] = await pool.execute(query, params);
  return result.insertId;
}

async function addPaper(paper) {
  let connection;

  try {
    const { paper_id, paper_title, conference, publish_date, authors } = paper;

    //start a connection and transaction
    //transaction ensures that a paper will not be added without being connected to its authors
    connection = await pool.getConnection();
    await connection.beginTransaction();

    //1-insert the paper
    const paperQuery = `
      INSERT INTO research_papers
        (paper_id, paper_title, conference, publish_date)
      VALUES (?, ?, ?, ?);`;

    const paperParams = [paper_id, paper_title, conference, publish_date];

    const [result] = await connection.execute(paperQuery, paperParams);

    //2- connect the paper with its author(s)

    for (const author_id of authors) {
      const paperAuthorsQuery = `
      INSERT INTO authors_papers 
        (author_id, paper_id)
      VALUES (?, ?);`;

      const paperAuthorsParams = [author_id, paper_id];

      await connection.execute(paperAuthorsQuery, paperAuthorsParams);
    }

    await connection.commit();

    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection && connection.release();
  }
}
