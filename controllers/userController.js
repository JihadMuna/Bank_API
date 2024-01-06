import STATUS_CODE from "../constants/statusCodes.js";
import User from "../models/usersModel.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
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

    const existingUser = await User.findOne({ firstName, lastName });

    if (existingUser) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("A user with the same name already exists");
    }

    const newUser = await User.create({ firstName, lastName, cash, credit });
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

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.cash = cash !== undefined ? cash : user.cash;
    user.credit = credit !== undefined ? credit : user.credit;

    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }

    res
      .status(STATUS_CODE.OK)
      .send(`User with the ID of ${req.params.id} was deleted successfully!`);
  } catch (error) {
    next(error);
  }
};

export const depositCash = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid deposit request");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { cash: amount } },
      { new: true }
    );

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateCredit = async (req, res, next) => {
  try {
    const { credit } = req.body;

    if (!credit || credit < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid credit update request");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { credit },
      { new: true }
    );

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const withdrawCash = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid withdrawal request");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { cash: -amount } },
      { new: true }
    );

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }

    res.json(user);
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

    const sender = await User.findByIdAndUpdate(
      senderId,
      { $inc: { cash: -amount } },
      { new: true }
    );

    const receiver = await User.findByIdAndUpdate(
      receiverId,
      { $inc: { cash: amount } },
      { new: true }
    );

    if (!sender || !receiver || sender.cash + sender.credit < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Insufficient funds for the transfer");
    }

    res.json({
      message: `Transfer of ${amount} from user ${senderId} to user ${receiverId} successful`,
      sender,
      receiver,
    });
  } catch (error) {
    next(error);
  }
};
