import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  transferMoney,
} from "../controllers/userController.js";

const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

// Route to get a single movie by ID
router.get("/:id", getUserById);

// Route to create a new movie
router.post("/", createUser);

// Route to update an existing movie
router.put("/:id", updateUser);

// Rout to delete a movie
router.delete("/:id", deleteUser);

// Route for money transfer
router.post("/transfer", transferMoney);

export default router