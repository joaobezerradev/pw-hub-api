export interface AccountRequestResetPasswordToken {
  execute: (input: AccountRequestResetPasswordToken.Input) => AccountRequestResetPasswordToken.Output
}

export namespace AccountRequestResetPasswordToken {
  export type Input = { email: string }
  export type Output = Promise<void>
}
