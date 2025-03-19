import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (id: string, res: Response) => {
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
