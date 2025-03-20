import { Request } from "express";
import User from "../models/auth-model";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
