export interface SendAccountVerification {
  execute: (input: SendAccountVerification.Input) => SendAccountVerification.Output
}

export namespace SendAccountVerification {
  export interface Input { email: string }
  export type Output = Promise<void>
}
