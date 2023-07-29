import express, { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { User } from '../models/user';
export const secretKey = 'billing-app-secret-key';


const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // const options: VerifyOptions = { secret: secretKey };
  // Verify token logic here
  jwt.verify(token, secretKey, (err: any , decoded: User | any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Store the decoded user information in the request object
    req.user = decoded ;
    console.log("req",req)

    next();
  });

  next();
}

export default AuthMiddleware;