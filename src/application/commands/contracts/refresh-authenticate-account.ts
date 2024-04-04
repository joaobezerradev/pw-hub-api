export interface RefreshAuthenticateAccount {
  execute(input: RefreshAuthenticateAccount.Input): RefreshAuthenticateAccount.Output
}

export namespace RefreshAuthenticateAccount {
  export type Input = { refreshToken: string }
  export type Output = Promise<{ accessToken: string }>
}