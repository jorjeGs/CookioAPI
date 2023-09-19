import { pool } from "../db.js"

export const getUsers = async (req, res) => {
    //manejo de errores
    try {
        const [rows] = await pool.query('SELECT * FROM users')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const createUser = async (req, res) => {
    const { username, name, password, email, salt } = req.body
    //validaciones aqui
    try {
        const [rows] = await pool.query('INSERT INTO users (username, name, password, email, salt) VALUES (?,?,?,?,?)',
        [username, name, password, email, salt])
        res.send({
            id: rows.insertId,
            username,
            name,
            email,
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const updateUser = async (req, res) => {
    const { username, name, email, profile_pic} = req.body
    const { id } = req.params
    //validaciones aqui
    //IFNULL, si el valor es nulo, se asigna el valor que se le pasa como segundo parametro
    try{
    const [rows] = await pool.query('UPDATE users SET username = IFNULL(?, username), name = IFNULL(?, name), email = IFNULL(?, email), profile_pic = IFNULL(?, profile_pic) WHERE id = ?',
     [username, name, email, profile_pic, id])
    
    if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: 'User not found' })
    }

    res.sendStatus(204)
    } catch (error) {
    res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try{
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id])
    if (result.affectedRows <= 0) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.sendStatus(204)
    } catch (error) {
    res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params
    try{
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.json(rows[0])
    } catch (error) {    
    res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}

