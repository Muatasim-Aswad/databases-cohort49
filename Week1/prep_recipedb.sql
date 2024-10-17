/*
ENTITIES: Recipe, Ingredient, Category, Step.

  Recipe(recipe_id PK, name) //can have multiple categories, ingredients, and steps
  Ingredient(ingredient_id PK, name) //can be in multiple recipes
  Category(category_id PK, name) //can have multiple recipes
  Step(step_id PK, description) //can be in multiple recipes

JUNCTION ENTITIES: RecipeIngredient, RecipeCategory, RecipeStep.

  RecipeCategory(recipe_id FK, category_id FK)
  RecipeIngredient(recipe_id FK, ingredient_id FK, quantity)  
  RecipeStep(recipe_id FK, step_id FK, order)
*/

CREATE TABLE recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL
);

CREATE TABLE ingredient (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL
);

CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE step (
    step_id INT AUTO_INCREMENT PRIMARY KEY,
    step_description TEXT NOT NULL
);

-- Junction tables

CREATE TABLE recipe_category (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient (
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(50),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE recipe_step (
    recipe_id INT,
    step_id INT,
    step_order INT,
    PRIMARY KEY (recipe_id, step_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (step_id) REFERENCES step(step_id) ON DELETE CASCADE
);

