import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AccountRole } from '../../../domain/constants';
import { environment } from '../../config/environment';

const verifyToken = (token: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, environment.jwt.secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as object);
      }
    });
  });
};

export const autenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token is missing.' });
  const [, token] = authHeader.split(' ');

  try {
    req.user = await verifyToken(token) as { id: string, roleId: AccountRole }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};


