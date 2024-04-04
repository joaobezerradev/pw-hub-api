export interface AuthenticateAccount {
  execute(input: AuthenticateAccount.Input): AuthenticateAccount.Output
}

export namespace AuthenticateAccount {
  export type Input = { email: string, password: string }
  export type Output = Promise<{ accessToken: string, refreshToken: string }>
}