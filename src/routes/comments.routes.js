import { Router } from 'express';
import {createComment, deleteComment, getCommentsByRecipeId, likeComment} from '../controllers/comments.controller.js';

const router = Router();

router.get('/comments/:recipe_id', getCommentsByRecipeId);
router.patch('/comments/:id', likeComment);
router.post('/comments', createComment);
router.delete('/comments/:id', deleteComment);

export default router;


