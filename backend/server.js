import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import pyqRoutes from './routes/pyqRoutes.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();

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

// Global error-handling middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  }

  if (err.message === 'Unexpected field') {
    return res.status(400).json({ message: 'Unexpected file field in the request' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

// Process-level error handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
