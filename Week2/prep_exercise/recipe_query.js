import mysql from 'mysql2/promise';

const recipeDB = await mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'recipe_db',
  multipleStatements: true,
});

await recipeDB.connect();

const [results] = await recipeDB.query(`
  -- All the recipes that contain Macaroni and are Vegetarian
  
  WITH vegetarian_recipes AS (
    SELECT r.id AS recipe_id, r.name AS recipe
    FROM recipe_category rc
      JOIN category c ON rc.category_id = c.id
      JOIN recipe r ON rc.recipe_id = r.id
      WHERE c.name = 'Vegetarian' )
  SELECT vr.*
  FROM vegetarian_recipes vr
    JOIN recipe_ingredient ri ON vr.recipe_id = ri.recipe_id
    JOIN ingredient i ON ri.ingredient_id = i.id
  WHERE i.name = 'Macaroni';


  -- All the recipes that are either Vegan or Japanese

  SELECT r.id AS recipe_id, r.name AS recipe
  FROM recipe_category rc
    JOIN category c ON rc.category_id = c.id
    JOIN recipe r ON rc.recipe_id = r.id
  WHERE c.name IN('Vegan', 'Japanese');
  

  -- All the recipes that are both Cake and No-Bake

  SELECT r.id AS recipe_id, r.name AS recipe
  FROM recipe_category rc
    JOIN category c ON rc.category_id = c.id
    JOIN recipe r ON rc.recipe_id = r.id
  WHERE c.name IN('Cake', 'No-Bake')
  GROUP BY r.id
    HAVING COUNT(DISTINCT c.name) = 2;
  
  `);

console.log(results);

await recipeDB.end();
