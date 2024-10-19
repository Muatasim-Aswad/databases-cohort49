import mysql from 'mysql2/promise';
import recipes from './recipes.json' with { type: 'json' };

const recipeDB = await mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'recipe_db',
  multipleStatements: true,
});

await recipeDB.connect();

//populate with recipes using add recipe function
let recipeId;

for (const recipe of recipes) {
  await addRecipe(
    recipe.recipe_name,
    recipe.categories,
    recipe.ingredients,
    recipe.steps,
  );
}

await recipeDB.end();

//--------------------------------------------

async function addRecipe(title, categories, ingredients, steps) {
  try {
    recipeDB.beginTransaction();

    [recipeId] = await insertAndGetID('recipe', 'name', title);
    let ingredientsIDs = [];
    let categoriesIDs = [];
    let stepsIDs = [];

    ingredientsIDs = await insertAndGetID('ingredient', 'name', ingredients);
    categoriesIDs = await insertAndGetID('category', 'name', categories);
    stepsIDs = await insertAndGetID('step', 'description', steps);

    await linkRecipe('recipe_ingredient', 'ingredient_id', ingredientsIDs);
    await linkRecipe('recipe_category', 'category_id', categoriesIDs);
    await linkRecipe('recipe_step', 'step_id', stepsIDs);

    recipeDB.commit();
  } catch (error) {
    recipeDB.rollback();
    console.error(error);
  }
}

//helper functions

async function insertAndGetID(table, field, values) {
  const ids = [];

  if (!Array.isArray(values)) values = [values];

  for (const value of values) {
    const [record] = await recipeDB.execute(
      `
        INSERT INTO ${table} (${field})
        VALUES (?)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);
        `,
      [value],
    );

    ids.push(record.insertId);
  }
  
  return ids;
}

async function linkRecipe(bridgeTable, secondField, values) {
  for (const value of values) {
    console.log(secondField, ':', value , '  RecipeID:', recipeId);
    await recipeDB.execute(
      `
      INSERT INTO ${bridgeTable} (recipe_id, ${secondField})
      VALUES (?, ?);
      `,
      [recipeId, value],
    );
  }
}
