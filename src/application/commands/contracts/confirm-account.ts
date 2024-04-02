export interface ConfirmAccount {
  execute: (input: ConfirmAccount.Input) => ConfirmAccount.Output
}

export namespace ConfirmAccount {
  export interface Input { email: string; token: string }
  export type Output = Promise<void>
}
