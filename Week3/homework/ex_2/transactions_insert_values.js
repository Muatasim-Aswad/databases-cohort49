import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'account_db',
  multipleStatements: true,
});

async function main() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const sqlFilePath = `${currentDir}/transactions_insert_values.sql`;

  const populateQuery = await fs.readFile(sqlFilePath, 'utf-8');

  await pool.query(populateQuery);
}

main()
  .catch(console.error)
  .finally(() => pool.end());
