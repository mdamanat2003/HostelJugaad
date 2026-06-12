import express from 'express';
import { uploadPYQ, getPYQs } from '../controllers/pyqController.js';
import upload from '../config/multer.js'; // Humara banaya hua file receiver

const router = express.Router();

// Route: GET /api/pyqs (Saare question papers lane ke liye)
router.get('/', getPYQs);

router.post('/upload', upload.single('file'), uploadPYQ);

export default router;