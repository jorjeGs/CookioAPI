import { Router } from "express";
import CheckAuth from "../middleware/auth.js";
import { getUsers, createUser, updateUser, deleteUser, getUser } from "../controllers/users.controller.js";


const router = Router();

router.get('/users', CheckAuth ,getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;