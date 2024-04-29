// taskRouter.ts

import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import formidable from 'express-formidable';

const router = express.Router();
router.use(authenticate);
router.use(formidable());

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
