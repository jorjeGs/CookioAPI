import { Router } from "express";
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, likeRecipe, unlikeRecipe, getRecipesByUserId, getLikedRecipes } from "../controllers/recipes.controller.js";

const router = Router();

router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipe);
router.get('/recipes/user/:user_id', getRecipesByUserId);
router.post('/recipes', createRecipe);
router.patch('/recipes/update/:id', updateRecipe);
router.patch('/recipes/unlike/:id/:user_id', unlikeRecipe);
router.patch('/recipes/like/:id/:user_id', likeRecipe);
router.get('/recipes/liked/:user_id', getLikedRecipes);

router.delete('/recipes/:id', deleteRecipe);

export default router;