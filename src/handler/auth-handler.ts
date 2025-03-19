import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/auth-model";

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
    }

    generateToken(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
    });
  }
);

const generateToken = (id: string, res: Response) => {
  if (!process.env.JWT) {
    throw new Error("JWT secret is not defined");
  }
  const token = jwt.sign({ id }, process.env.JWT, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};
