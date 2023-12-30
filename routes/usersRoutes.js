import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  transferMoney,
  depositCash,
  updateCredit,
  withdrawCash,
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

// Route for deposite money
router.post("/users/deposit", depositCash);

// Route for update credit
router.put("/users/update-credit/:id", updateCredit);

// Route for withdraw money
router.post("/users/withdraw", withdrawCash);



export default router