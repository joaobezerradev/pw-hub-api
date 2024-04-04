export interface UpdateAccountProfile {
  execute: (input: UpdateAccountProfile.Input) => UpdateAccountProfile.Output
}

export namespace UpdateAccountProfile {
  export type Input = { id: string, name: string; aboutMe: string, address: string, birthdate: string, phone: string }
  export type Output = Promise<void>
}
