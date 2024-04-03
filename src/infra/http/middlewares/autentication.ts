import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../../config/environment';


const autenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token is missing.' });
  const [, token] = authHeader.split(' ');
  try {
    const decoded = jwt.verify(token, environment.jwt.secret);
    req.user = { id: decoded as string } 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

export default autenticationMiddleware;