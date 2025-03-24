import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/auth-model";
import { generateToken } from "../lib/token";

export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword)
      res.status(400).json({ message: "Please fill in all fields" });

    if (password !== confirmPassword)
      res.status(400).json({ message: "Passwords do not match" });

    try {
      const existingUser = await User.find({ email });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const user = new User({
        username,
        email,
        password,
      });

      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    generateToken(user._id as string, res);

    res.status(200).json({
      message: "User logged in successfully",
    });
  }
);

export const logout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      res.cookie("jwt", { maxAge: 0 });
      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
