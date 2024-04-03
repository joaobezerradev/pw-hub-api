export interface JwtInterface {
  generateToken(payload: object, expiresIn: string | number): string;
}
