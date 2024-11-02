import { MongoClient } from 'mongodb';
import recipes from './recipes.json' with { type: 'json' };
import {
  categorySchema,
  ingredientSchema,
  recipeSchema,
} from "./schema.js";



if (process.env.MONGODB_URI == null) throw Error(`no uri in .env`);

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();

  //create
  await client.db('recipe_db').dropDatabase();
  const database = client.db('recipe_db');

  const collections = [
    database.collection('recipe'),
    database.collection('ingredient'),
    database.collection('category'),
  ];

  for (const collection of collections) {
    collection.createIndex({ name: 1 }, { unique: true });
  }

  //populate
  const insertedIds = await Promise.all(recipes.map((recipe) => addRecipe(recipe, collections)));
  console.log(insertedIds);
}

main()
  .catch(console.error)
  .finally(() => client.close());

async function insert(collection, document, schema) {
  try {
    await schema.validateAsync(document);

    const result = await collection.insertOne(document);

    return result.insertedId;
  } catch (e) {
    if (e.code !== 11000) throw e;

    const existing = await collection.findOne({ name: document.name });
    return existing._id;
  }
}

async function insertMany(collection, array, schema) {
  const insertIds = await Promise.all(
    array.map((value) => insert(collection, {name: value}, schema)),
  );

  return insertIds.map((id, index) => ({ id, name: array[index] }));
}

async function addRecipe(recipe, collections) {
  const [recipeCollection, ingredientCollection, categoryCollection] =
    collections;

  let { ingredients, categories } = recipe;

  //insert ingredients and categories to their respective collections
  ingredients = await insertMany(ingredientCollection, ingredients, ingredientSchema);
  categories = await insertMany(categoryCollection, categories, categorySchema);

  //prepare recipe object
  const prefixIdKey = (array, prefix = '') =>
    array.map(({ id, name }) => ({ [`${prefix}_id`]: id, name }));

  ingredients = prefixIdKey(ingredients, 'ingredient');
  categories = prefixIdKey(categories, 'category');

  recipe = {
    name: recipe.recipe_name,
    categories,
    ingredients,
    steps: recipe.steps,
  };

  //insert recipe
  const insertedId = await insert(recipeCollection, recipe, recipeSchema);

  return insertedId;
}
