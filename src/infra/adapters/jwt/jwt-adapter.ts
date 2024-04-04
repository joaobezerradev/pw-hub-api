import jwt from 'jsonwebtoken';
import { environment } from '../../config/environment';
import { JwtInterface } from '../contracts';

export class JwtAdapter implements JwtInterface {
  private readonly secretKey: string
  private readonly expiresIn: string

  constructor() {
    this.secretKey = environment.jwt.secret
    this.expiresIn = environment.jwt.expirationIn
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

}
