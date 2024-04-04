export interface GetAccount {
  execute(input: GetAccount.Input): GetAccount.Output
}

export namespace GetAccount {
  export type Input = { id: string }
  export type Output = Promise<{ id: string; username: string }>
}