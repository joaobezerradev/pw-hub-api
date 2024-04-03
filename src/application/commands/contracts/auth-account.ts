export interface AuthAccount {
  execute(input: AuthAccount.Input): AuthAccount.Output
}

export namespace AuthAccount {
  export type Input = { email: string, password: string }
  export type Output = Promise<{ token: string }>
}