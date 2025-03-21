import { IUser } from "../models/auth-model";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
