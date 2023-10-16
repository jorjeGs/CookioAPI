import { Router } from "express";
import CheckAuth from "../middleware/auth.js";
import { getUsers, updateUser, deleteUser, getUser, getLikedRecipes } from "../controllers/users.controller.js";


const router = Router();

router.get('/users', CheckAuth ,getUsers);
router.get('/users/:id', getUser);
router.get('/users/:id/liked', getLikedRecipes);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;