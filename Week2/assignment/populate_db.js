import { pool } from './index.js';
import authors from './results_&_dummyData/authors.json' with { type: "json" };
import papers from './results_&_dummyData/research_papers.json' with { type: "json" };

export default async function main() {
  for (const author of authors) {
    await addAuthor(author);
  }

  for (const paper of papers) {
    await addPaper(paper);
  }
}

async function addAuthor(author) {
  const [result] = await pool.execute(
    `
    INSERT IGNORE INTO authors 
      (author_id, author_name, university, 
      date_of_birth, h_index, gender, mentor)
    VALUES
      (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      author.author_id,
      author.author_name,
      author.university,
      author.date_of_birth,
      author.h_index,
      author.gender,
      author.mentor,
    ],
  );

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
    const [result] = await connection.execute(
      `
      INSERT INTO research_papers 
        (paper_id, paper_title, conference, publish_date)
      VALUES
        (?, ?, ?, ?);
      `,
      [paper_id, paper_title, conference, publish_date],
    );

    //2- connect the paper with its author(s)
    for (const author_id of authors) {
      await connection.execute(
        `
        INSERT INTO authors_papers 
          (author_id, paper_id)
        VALUES
          (?, ?);
        `,
        [author_id, paper_id],
      );
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
