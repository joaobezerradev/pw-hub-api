export interface ChangeAccountPassword {
  execute: (input: ChangeAccountPassword.Input) => ChangeAccountPassword.Output
}

export namespace ChangeAccountPassword {
  export interface Input {
    email: string
    oldPassword: string
    password: string
    passwordConfirmation: string
  }
  export type Output = Promise<void>
}
