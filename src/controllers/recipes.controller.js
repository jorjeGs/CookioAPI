import e from "express"
import { pool } from "../db.js"

export const getRecipes = async (req, res) => {
    //manejo de errores
    try {
        const [rows] = await pool.query('SELECT * FROM recipes')
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

//solve relationship between recipes and users tables to get liked recipes by user id 
// fiirst idea is to create a new table called likes with recipe_id and user_id
// then get recipes by user id where recipe_id = req.params.user_id

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
        const { title, description, ingredients, steps, image, created_by } = req.body
        const [rows] = await pool.query('INSERT INTO recipes (title, description, ingredients, steps, image, created_by) VALUES (?,?,?,?,?,?)', 
        [title, description, ingredients, steps, image, created_by])
        res.json({ id: rows.insertId, title, created_by })
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
        const [result] = await pool.query('UPDATE recipes SET likes = likes + 1 WHERE id = ?', [req.params.id])
        const [updatedRecipe] = await pool.query('SELECT * FROM recipes WHERE id = ?', [req.params.id])
        res.json({ likes: updatedRecipe[0].likes })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}