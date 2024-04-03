export interface CreateAccount {
  execute: (input: CreateAccount.Input) => CreateAccount.Output
}

export namespace CreateAccount {
  export interface Input { username: string, email: string, password: string }
  export type Output = Promise<void>
}
