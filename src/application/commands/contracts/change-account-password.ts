export interface ChangeAccountPassword {
  execute: (input: ChangeAccountPassword.Input) => ChangeAccountPassword.Output
}

export namespace ChangeAccountPassword {
  export interface Input {
    email: string
    token: string
    password: string
  }
  export type Output = Promise<void>
}
