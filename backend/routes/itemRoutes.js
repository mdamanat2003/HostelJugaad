import express from 'express';
import { addItem, getItems, getItemById, deleteItem, markAsSold } from '../controllers/itemController.js';
import upload from '../config/multer.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getItems);
router.get('/:id', getItemById);

// Protected routes — require authentication
router.post('/', authMiddleware, upload.single('image'), addItem);
router.put('/:id/sold', authMiddleware, markAsSold);
router.delete('/:id', authMiddleware, deleteItem);

export default router;
