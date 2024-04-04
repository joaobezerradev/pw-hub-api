export interface JwtInterface {
  generateToken(payload: object, expiresIn: string): Promise<string>;
  isValidToken<T>(refreshToken: string): Promise<{ isValid: boolean; decoded: T }>
}
