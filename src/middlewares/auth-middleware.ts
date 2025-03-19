import jwt from "jsonwebtoken";
import User from "../models/auth-model";
import { Request, Response, NextFunction } from "express";
import "../types/express";
import expressAsyncHandler from "express-async-handler";

const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
      }

      const decoded = jwt.verify(token as string, process.env.JWT as string);

      if (!decoded) {
        res.status(401).json({
          message: "Unauthorized: Invalid Token",
        });
      }
      req.user = await User.findById((decoded as jwt.JwtPayload).id).select(
        "-password"
      );
      next();
    } catch (error: any) {
      console.error(error);
      res.status(401).json({ error: "Internal Server Error" });
    }
  }
);

export default protect;
