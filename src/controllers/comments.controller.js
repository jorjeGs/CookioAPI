import {pool} from '../db.js';

export const getCommentsByRecipeId = async (req, res) => {
    try{
        const [result] = await pool.query('SELECT * FROM comments WHERE recipe_id = ?', [req.params.recipe_id])
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const getComment = async (req, res) => {
    try{
        const [result] = await pool.query('SELECT * FROM comments WHERE id = ?', [req.params.id])
        res.json(result[0])    
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const createComment = async (req, res) => {
    try{
        const {comment, recipe_id, user_id} = req.body
        const [result] = await pool.query('INSERT INTO comments (comment, recipe_id, user_id) VALUES (?,?,?)', [comment, recipe_id, user_id])
        res.json({id: result.insertId, comment})
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const deleteComment = async (req, res) => {
    try{
        const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
    
}

export const likeComment = async (req, res) => {
    try{
        const [result] = await pool.query('UPDATE comments SET likes = likes + 1 WHERE id = ?', [req.params.id])
        const [updatedComment] = await pool.query('SELECT * FROM comments WHERE id = ?', [req.params.id])   
        res.json({likes: updatedComment[0].likes})
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}


