import { Router } from "express";
import CheckAuth from "../middleware/auth.js";
import { getUsers, updateUser, deleteUser, getUser, getLikedRecipes, updatingUserImage } from "../controllers/users.controller.js";
//using multer to upload images
import multer from 'multer';
//importing path to serve static files
import path from 'path';
//importing fileUrlToPath to get the path of the image
import { fileURLToPath } from 'url';

const router = Router();

//multer config
const storage = multer.diskStorage({
    //destination: '../uploads',
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    //set filename
    filename: (req, file, cb) => {
        //get file extension
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}`)
    }
})
//value for config multer
const upload = multer({ storage })

router.get('/users', CheckAuth ,getUsers);
router.get('/users/:id', getUser);
router.get('/users/:id/liked', getLikedRecipes);
//upload.single('image') is the middleware to upload images
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

router.get('/users/images/:file', (req, res) => {
    const { file } = req.params
    console.log(import.meta.url)
    res.sendFile(path.join(__dirname, '../../optimized/' ,`${file}`))
})
router.patch('/users/:id', upload.single('profile_pic'), updatingUserImage);
router.delete('/users/:id', deleteUser);

export default router;