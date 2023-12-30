// Import necessary modules
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorMiddleware.js';
import usersRoutes from './routes/usersRoutes.js';

// Create an Express server instance
const server = express();

// Enable CORS middleware
server.use(cors());

// Middleware for JSON parsing
server.use(express.json()); // Add this line to handle JSON requests

// User Routes
server.use('/users', usersRoutes);

// Error handling Middleware
server.use(errorHandler);

// Set up the server to listen on a port
const PORT = process.env.PORT || 4545;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
