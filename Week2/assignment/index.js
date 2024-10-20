import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import populateDB from './populate_db.js';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  multipleStatements: true,
});

async function main() {
  //extract sql queries
  const createDB = await fs.readFile('./queries/ex0_create_db.sql', 'utf-8');
  const createAuthors = await fs.readFile('./queries/ex1_authors.sql', 'utf-8');
  const createPapers = await fs.readFile('./queries/ex2_papers.sql', 'utf-8');
  const queryJoins = await fs.readFile('./queries/ex3_join.sql', 'utf-8');
  const queryAggregates = await fs.readFile('./queries/ex4_funcs.sql', 'utf-8');

  //create the database and use it in subsequent pool connections
  await pool.query(createDB);
  pool.on('connection', (connection) => connection.query('USE academic_db'));

  //create the tables and populate them
  await pool.query(createAuthors + createPapers);
  await populateDB();

  //run the queries concurrently
  let results = await Promise.all([
    pool.query(queryJoins),
    pool.query(queryAggregates),
  ]);

  results = [results[0][0], results[1][0]];
  //results = results.flat(1);

  await fs.writeFile(
    './results_&_dummyData/results.json',
    JSON.stringify(results, null, 2),
  );
}

main()
  .catch(console.error)
  .finally(() => pool.end());
