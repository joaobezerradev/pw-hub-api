export interface GetAccountProfile {
  execute(input: GetAccountProfile.Input): GetAccountProfile.Output
}

export namespace GetAccountProfile {
  export type Input = { id: string }
  export type Output = Promise<{
    name: string,
    aboutMe: string,
    address: string,
    birthdate: string,
    phone: string,
    badges: { id: string }[]
  }>
}