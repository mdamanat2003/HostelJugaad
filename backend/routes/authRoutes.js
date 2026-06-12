import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Route: POST /api/auth/register (Sign up ke liye)
router.post('/register', register);

// Route: POST /api/auth/login (Login ke liye)
router.post('/login', login);

export default router;
