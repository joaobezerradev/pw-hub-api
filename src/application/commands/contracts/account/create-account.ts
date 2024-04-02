export interface CreateAccount {
  execute: (input: CreateAccount.Input) => CreateAccount.Output
}

export namespace CreateAccount {
  export interface Input {
    email: string
    password: string
    passwordConfirmation: string
  }
  export type Output = Promise<void>
}
