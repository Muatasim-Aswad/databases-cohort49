

/*
For more details on this database schema, 
see the ERD in the same folder.

recipe - category : many-to-many relationship
recipe - ingredient : many-to-many relationship
recipe - step : many-to-many relationship

- to use this script
  From the terminal, run the following command:
  mysql -u root -p < create_recipe_db.sql

  From mysql cli, run the following command:
  source /path/to/create_recipe_db.sql

-if the database exists, make a dump before dropping it
mysqldump -u root -p recipe_db > recipe_db.sql
*/


DROP DATABASE IF EXISTS recipe_db;
CREATE DATABASE recipe_db;
USE recipe_db;

CREATE TABLE recipe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(200)
);

CREATE TABLE ingredient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE step (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(500) UNIQUE NOT NULL
);

-- bridge tables

CREATE TABLE recipe_category (
    recipe_id INT,
    category_id INT,

    PRIMARY KEY (recipe_id, category_id),

    FOREIGN KEY (recipe_id) 
      REFERENCES recipe(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    
    FOREIGN KEY (category_id)
      REFERENCES category(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    );

CREATE TABLE recipe_ingredient (
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(5, 2),
    unit VARCHAR(50),

    PRIMARY KEY (recipe_id, ingredient_id),

    FOREIGN KEY (recipe_id) 
      REFERENCES recipe(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    
    FOREIGN KEY (ingredient_id)
      REFERENCES ingredient(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE TABLE recipe_step (
    recipe_id INT,
    step_id INT,
    step_order INT,

    PRIMARY KEY (recipe_id, step_id, step_order),

    FOREIGN KEY (recipe_id) 
      REFERENCES recipe(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    
    FOREIGN KEY (step_id)
      REFERENCES step(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);


DELIMITER $$

CREATE TRIGGER before_insert_recipe_step
BEFORE INSERT ON recipe_step
FOR EACH ROW
BEGIN
    DECLARE max_order INT;

    -- Find the maximum step_order for the given recipe
    SELECT IFNULL(MAX(step_order), 0) INTO max_order
    FROM recipe_step
    WHERE recipe_id = NEW.recipe_id;

    -- Set the step_order for the new step
    SET NEW.step_order = max_order + 1;
END$$

DELIMITER ;