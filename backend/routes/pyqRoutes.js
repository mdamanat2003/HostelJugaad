import express from 'express';
import { uploadPYQ, getPYQs, incrementViews } from '../controllers/pyqController.js';
import upload from '../config/multer.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPYQs);
router.patch('/:id/view', incrementViews);

// Protected route — require authentication
router.post('/upload', authMiddleware, upload.single('file'), uploadPYQ);

export default router;
