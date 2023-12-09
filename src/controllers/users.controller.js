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

//this function has to be deleted on production
export const getUsers = async (req, res) => {
    //manejo de errores
    try {
        const [rows] = await pool.query('SELECT * FROM users')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { username } = req.body
        const { id } = req.params
        //check if image is uploaded
        if (!req.file) {
            //IFNULL, si el valor es nulo, se asigna el valor que se le pasa como segundo parametro
            const [rows] = await pool.query('UPDATE users SET username = IFNULL(?, username) WHERE id = ?',
                [username, id])
            if (rows.affectedRows <= 0) {
                return res.json({ message: 'User not found' })
            }
            return res.json({ message: 'User updated successfully' })
        }
        //saving data from image in variable 
        const imageFile = req.file
        //resize image with handleResize function
        handleResize(imageFile.path, `user-${imageFile.filename}`, 300)
        //saving image new file name in variable
        const profile_pic = `user-${imageFile.filename}`;
        //validaciones aqui
        //IFNULL, si el valor es nulo, se asigna el valor que se le pasa como segundo parametro
        const [rows] = await pool.query('UPDATE users SET username = IFNULL(?, username), profile_pic = IFNULL(?, profile_pic) WHERE id = ?',
            [username, profile_pic, id])

        if (rows.affectedRows <= 0) {
            return res.json({ message: 'User not found' })
        }
        res.json({ message: 'User updated successfully' })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}
//test rute to upload images to aws s3
export const updatingUserImage = async (req, res) => {
    //get image
    const imageFile = req.file
    //resize image with handleResize function and save return value in variable
    const newImage = await handleResize(imageFile.path, `user-${imageFile.filename}`, 300)
    //saving image new file name in variable
    const profile_pic = `user-${imageFile.filename}`;
    //console log readStream of image
    const pathImage = path.join(__dirname, '../../optimized' ,`${profile_pic}`)
    //upload image to aws s3
    const result = await uploadFile(pathImage, profile_pic + '.jpg')
    res.json({ result })
}
//test rute to get images from aws s3



export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id])
        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const [rows] = await pool.query('SELECT id, username, name, profile_pic, likes FROM users WHERE id = ?', [id])
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

//TODO:
//solve relationship between recipes and users tables to get liked recipes by user id 
// fiirst idea is to create a new table called likes with recipe_id and user_id
// then get recipes by user id where recipe_id = req.params.user_id
//DONE CREATED TABLE NAMED: tr_likes_recipes

export const getLikedRecipes = async (req, res) => {
    const { id } = req.params
    try {
        const [rows] = await pool.query(
            'SELECT recipes.* FROM recipes INNER JOIN tr_likes_recipes ON recipes.id = tr_likes_recipes.recipe_id WHERE tr_likes_recipes.user_id = ?'
            , [id])
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}
