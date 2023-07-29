import { User } from '../models/user'; // Replace with your user model file

declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace with your user model type
    }
  }
}