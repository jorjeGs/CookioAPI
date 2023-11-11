import { pool } from '../db.js';
import { encrypt, compare } from '../helpers/handleBcrypt.js';
import { tokenSign } from '../helpers/handleToken.js';

export const register = async (req, res) => {
    const { username, name, email, password} = req.body
    //encriptando password con handleBcrypt
    const passwordHash = await encrypt(password) 

    //validaciones aqui
    try { 
        const [rows] = await pool.query('INSERT INTO users (username, name, password, email ) VALUES (?,?,?,?)',
        [username, name, passwordHash, email])
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

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const user = rows[0]
        const validPassword = await compare(password, user.password)

        
        //token generate
        const token = await tokenSign(user)
        
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        
        res.send({
            data: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                profile_pic: user.profile_pic,
                likes: user.likes,
                reposts: user.reposts,
            },
            token

        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong",  error: error.message })
    }
}


