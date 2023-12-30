import STATUS_CODE from "../constants/statusCodes.js";
import { readUsersFromFile, writeUsersToFile } from "../models/usersModel.js";
import { v4 as uuidv4 } from "uuid";


export const getAllUsers = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    const user = users.find((u) => u.ID.toString() === req.params.id);
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, cash = 0, credit = 0 } = req.body;

    if (!firstName || !lastName) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("All fields (firstName, lastName) are required");
    }

    const users = readUsersFromFile();

    if (users.some((u) => u.firstName === firstName && u.lastName === lastName)) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("A user with the same name already exists");
    }

    const newUser = { ID: uuidv4(), firstName, lastName, cash, credit };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(STATUS_CODE.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
};


export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, cash, credit } = req.body;

    if (!firstName || !lastName) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("All fields (firstName, lastName) are required");
    }

    const users = readUsersFromFile();
    const index = users.findIndex((u) => u.ID.toString() === req.params.id);

    if (index === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found!");
    }

    const existingUser = users[index];
    const updatedUser = {
      ...existingUser,
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      cash: cash !== undefined ? cash : existingUser.cash,
      credit: credit !== undefined ? credit : existingUser.credit,
    };

    users[index] = updatedUser;
    writeUsersToFile(users);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    const newUserList = users.filter((user) => user.ID.toString() !== req.params.id);

    if (newUserList.length === users.length) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }

    writeUsersToFile(newUserList);
    res.status(STATUS_CODE.OK).send(`User with the ID of ${req.params.id} was deleted!`);
  } catch (error) {
    next(error);
  }
};

export const transferMoney = async (req, res, next) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("All fields (senderId, receiverId, amount) are required");
    }

    const users = readUsersFromFile();
    const senderIndex = users.findIndex((u) => u.ID.toString() === senderId);
    const receiverIndex = users.findIndex((u) => u.ID.toString() === receiverId);

    if (senderIndex === -1 || receiverIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("Sender or receiver not found!");
    }

    const sender = users[senderIndex];
    const receiver = users[receiverIndex];

    if (sender.cash + sender.credit < amount) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Insufficient funds for the transfer");
    }

    // Deduct the amount from the sender
    const updatedSender = { ...sender, cash: sender.cash - amount };

    // Add the amount to the receiver
    const updatedReceiver = { ...receiver, cash: receiver.cash + amount };

    // Update the users array
    users[senderIndex] = updatedSender;
    users[receiverIndex] = updatedReceiver;

    // Save the updated users array to the file
    writeUsersToFile(users);

    res.json({
      message: `Transfer of ${amount} from user ${senderId} to user ${receiverId} successful`,
      sender: updatedSender,
      receiver: updatedReceiver,
    });
  } catch (error) {
    next(error);
  }
};
