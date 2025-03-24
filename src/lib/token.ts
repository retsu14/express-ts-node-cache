import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (id: string, res: Response) => {
  if (!process.env.JWT) {
    res.status(400).json({
      message: "JWT is not defined",
    });
    return;
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
