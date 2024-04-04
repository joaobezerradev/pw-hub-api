import jwt from 'jsonwebtoken';
import { object } from 'zod';
import { environment } from '../../config/environment';
import { JwtInterface } from '../contracts';

export class JwtAdapter implements JwtInterface {
  private readonly secretKey: string

  constructor() {
    this.secretKey = environment.jwt.secret
  }

  async isValidToken<T>(refreshToken: string): Promise<{ isValid: boolean, decoded: T }> {
    return new Promise((resolve) => {
      jwt.verify(refreshToken, environment.jwt.secret, (err, decoded) => {
        if (err) {
          resolve({ isValid: false, decoded: {} as T });
        } else {
          resolve({ isValid: true, decoded: decoded as T });
        }
      });
    });
  }

  async generateToken(payload: object, expiresIn: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretKey, { expiresIn }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token!);
        }
      });
    });
  }
}
