import e from "express"
import { pool } from "../db.js"
//importing handler for resize images
import { handleResize } from "../helpers/handleResize.js"
//importing s3.js to upload images to aws s3
import { uploadFile } from "../s3.js"
//importing path to serve static files
import path from 'path';
//importing fileUrlToPath to get the path of the image
import { fileURLToPath } from 'url';
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

export const getRecipes = async (req, res) => {
    //manejo de errores
    try {
        const [rows] = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const getRecipesByUserId = async (req, res) => {
    try {
        //get recipes by user id where created_by = req.params.user_id and edit_by = req.params.user_id
        const [rows] = await pool.query('SELECT * FROM recipes WHERE created_by = ? OR edited_by = ?', [req.params.user_id, req.params.user_id])
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const getRecipe = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [req.params.id])
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const createRecipe = async (req, res) => {
    try {
        const { title, description, created_by, created_by_id } = req.body
        //saving data from image in variable 
        const imageFile = req.file
        //saving image new file name in variable
        const image = `image-${imageFile.filename}.jpeg`;
        //resize image with handleResize function
        await handleResize(imageFile.path, image, 600)
        const [rows] = await pool.query('INSERT INTO recipes (title, description, image, created_by, created_by_id) VALUES (?,?,?,?,?)', 
        [title, description, image, created_by, created_by_id])
        //console log readStream of image
        const pathImage = path.join(__dirname, '../../optimized' ,`${image}`)
        //upload image to aws s3
        const result = await uploadFile(pathImage, image)
        res.json({ id: rows.insertId, title, created_by, result: result })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const updateRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps, image } = req.body
        const [rows] = await pool.query('UPDATE recipes SET title = IFNULL(?, title), description = IFNULL(?, description), ingredients = IFNULL(?, ingredients), steps = IFNULL(?, steps), image = IFNULL(?, image) WHERE id = ?',
        [title, description, ingredients, steps, image, req.params.id])
        if (rows.affectedRows <= 0) {
            return res.status(404).json({ message: 'Recipe not found' })
        }
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

//TODO:
//create functio to create new recipe from another recipe
//first get recipe by id, then create new recipe with the same data but with new id
//that means that in frontend, we show the form recipe with the data of the recipe to copy
//then we can edit the data and create a new recipe with the edited data by the user
//setting the created_by to the old user id and the edited_by to the new user id
//saving it in the database and returning the new recipe id

export const editRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps, image, created_by, edited_by } = req.body
        const [rows] = await pool.query('INSERT INTO recipes (title, description, ingredients, steps, image, created_by, edited_by) VALUES (?,?,?,?,?,?,?)', 
        [title, description, ingredients, steps, image, created_by, edited_by])
        res.json({ id: rows.insertId, title, created_by, edited_by })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}
//TODO: add instruction to delete image from uploads folder
export const deleteRecipe = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM recipes WHERE id = ?', [req.params.id])
        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Recipe not found' })
        }
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const likeRecipe = async (req, res) => {
    try {
        //updateing likes in recipes table
        const [result] = await pool.query('UPDATE recipes SET likes = likes + 1 WHERE id = ?', [req.params.id])
        //updating likes in tr_likes_recipes table
        const [rows] = await pool.query('INSERT INTO tr_likes_recipes (recipe_id, user_id) VALUES (?,?)', [req.params.id, req.params.user_id])
        //also, we want to update the number of likes for the user, so
        await pool.query('UPDATE users SET likes = likes + 1 WHERE id = (SELECT created_by_id FROM recipes WHERE id = ?)', [req.params.id])
        //gettin id's of liked recipes by user id from tr_likes_recipes table
        const [likedRecipes] = await pool.query('SELECT recipe_id FROM tr_likes_recipes WHERE user_id = ?', [req.params.user_id])
        const valuesOnly = likedRecipes.map(likedRecipes => likedRecipes.recipe_id);
        res.json(valuesOnly)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const unlikeRecipe = async (req, res) => {
    try {
        //updateing likes in recipes table
        const [result] = await pool.query('UPDATE recipes SET likes = likes - 1 WHERE id = ?', [req.params.id])
        //updating likes in tr_likes_recipes table
        const [rows] = await pool.query('DELETE FROM tr_likes_recipes WHERE recipe_id = ? AND user_id = ?', [req.params.id, req.params.user_id])
        //also, we want to update the number of likes for the user, so
        await pool.query('UPDATE users SET likes = likes - 1 WHERE id = (SELECT created_by_id FROM recipes WHERE id = ?)', [req.params.id])
        //gettin id's of liked recipes by user id from tr_likes_recipes table
        const [likedRecipes] = await pool.query('SELECT recipe_id FROM tr_likes_recipes WHERE user_id = ?', [req.params.user_id])
        const valuesOnly = likedRecipes.map(likedRecipes => likedRecipes.recipe_id);
        res.json(valuesOnly)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const getLikedRecipes = async (req, res) => {
    try {
        //gettin id's of liked recipes by user id from tr_likes_recipes table
        const [likedRecipes] = await pool.query('SELECT recipe_id FROM tr_likes_recipes WHERE user_id = ?', [req.params.user_id])
        const valuesOnly = likedRecipes.map(likedRecipes => likedRecipes.recipe_id);
        res.json(valuesOnly)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}