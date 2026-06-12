import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import pyqRoutes from './routes/pyqRoutes.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();
connectDB();    
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pyqs', pyqRoutes);
app.use('/api/items', itemRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('HostelJugaad Backend API is Running perfectly! 🚀');
});

// Server Start Karna
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});