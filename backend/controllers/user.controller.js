import { UserSchema } from "../models/user.model.js";

export const createUser = async (req, res) => {
  const email = req.body.email;
  try {
    const findUser = await UserSchema.findOne({ email: email });
    if (!findUser) {
      // Create a new user
      const newUser = await UserSchema.create(req.body);
      res.status(201).json(newUser);
    } else {
      // User already exists
      res.status(400).json({
        msg: "User already exists",
        sucess: false,
      });
    }
  } catch (err) {
    console.log("Error while creating user");
    res.status(500).json({
      msg: "Server error",
      success: false,
    });
  }
};
