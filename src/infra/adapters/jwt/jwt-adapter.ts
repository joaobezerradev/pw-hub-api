import jwt from 'jsonwebtoken';
import { JwtInterface } from '../contracts';

export class JwtAdapter implements JwtInterface {
  constructor(private readonly secretKey: string) { }

  generateToken(payload: object, expiresIn: string | number): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

}
