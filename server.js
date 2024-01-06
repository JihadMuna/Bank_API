import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import usersRoutes from "./routes/usersRoutes.js";
import chalk from "chalk";
import connectDB from "./config/db.js";
dotenv.config();

// Create an Express server instance
const server = express();

// Enable CORS middleware
server.use(cors());

// Middleware for JSON parsing
server.use(express.json());

// User Routes
server.use("/users", usersRoutes);

// Error handling Middleware
server.use(errorHandler);

// Set up the server to listen on a port
const PORT = process.env.PORT || 4545;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(chalk.bgYellow.bold`Server is running on port ${PORT}`);
  });
});
