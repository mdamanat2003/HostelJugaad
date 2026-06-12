import express from 'express';
import { addItem, getItems, getItemById, deleteItem, markAsSold } from '../controllers/itemController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Route: POST /api/items (Naya item add karne ke liye)
router.post('/', upload.single('image'), addItem);

// Route: GET /api/items (Saare items lane ke liye)
router.get('/', getItems);

// Route: GET /api/items/:id (Ek specific item lane ke liye)
router.get('/:id', getItemById);

// Route: PUT /api/items/:id/sold (Item ko sold mark karne ke liye)
router.put('/:id/sold', markAsSold);

// Route: DELETE /api/items/:id (Item delete karne ke liye)
router.delete('/:id', deleteItem);

export default router;
