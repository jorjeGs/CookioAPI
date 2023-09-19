import {Router} from 'express';
import {testConnection} from '../controllers/index.controller.js';

const router = Router();

router.get('/', (req, res) => res.send('Hello World!'));

router.get('/ping', testConnection);

export default router;