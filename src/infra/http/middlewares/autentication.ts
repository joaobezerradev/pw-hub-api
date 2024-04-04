import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../../config/environment';

export const autenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token is missing.' });
  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, environment.jwt.secret) as { id: string }
    req.user = { id: decoded.id }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
