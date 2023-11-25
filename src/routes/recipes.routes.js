import { Router } from "express";
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, likeRecipe, unlikeRecipe, getRecipesByUserId, getLikedRecipes, uploadImage } from "../controllers/recipes.controller.js";
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
        cb(null, `${Date.now()}.${ext}`)
    }
})
//value for config multer
const upload = multer({ storage })

router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipe);
router.get('/recipes/user/:user_id', getRecipesByUserId);
//upload.single('image') is the middleware to upload images
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

router.get('/recipes/images/:file', (req, res) => {
    const { file } = req.params
    console.log(import.meta.url)
    res.sendFile(path.join(__dirname, '../../optimized/' ,`${file}`))
})

router.post('/recipes', upload.single('image'), createRecipe);
router.patch('/recipes/update/:id', updateRecipe);
router.patch('/recipes/unlike/:id/:user_id', unlikeRecipe);
router.patch('/recipes/like/:id/:user_id', likeRecipe);
router.get('/recipes/liked/:user_id', getLikedRecipes);

router.delete('/recipes/:id', deleteRecipe);

export default router;