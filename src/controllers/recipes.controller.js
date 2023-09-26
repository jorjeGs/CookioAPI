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