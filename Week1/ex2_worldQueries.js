import mysql from 'mysql2/promise';
import fs from 'fs/promises';

const serverConnection = await mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'new_world',
  multipleStatements: true,
});

serverConnection.connect();

const [results] = await serverConnection.query(`
  SELECT name FROM country 
  WHERE population > 8000000;
  
  SELECT name FROM country 
  WHERE name LIKE '%land%';
  
  SELECT name FROM city 
  WHERE population BETWEEN 500000 AND 1000000;
  
  SELECT name FROM country 
  WHERE continent = 'Europe';
  
  SELECT name FROM country
  ORDER BY surfaceArea DESC;
  
  SELECT name FROM city
  WHERE countryCode = 'NLD';
  
  SELECT population FROM city
  WHERE name = 'Rotterdam';
  
  SELECT name FROM country
  ORDER BY surfaceArea DESC
  LIMIT 10;
  
  SELECT name FROM city
  ORDER BY population DESC
  LIMIT 10;

  SELECT SUM(population) AS world_population
  FROM country;
`);

await fs.writeFile('ex2_results.json', JSON.stringify(results, null, 2));

serverConnection.end();
