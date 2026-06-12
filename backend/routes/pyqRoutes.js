import express from 'express';
import { uploadPYQ, getPYQs } from '../controllers/pyqController.js';
import upload from '../config/multer.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getPYQs);

// Protected route — require authentication
router.post('/upload', authMiddleware, upload.single('file'), uploadPYQ);

export default router;