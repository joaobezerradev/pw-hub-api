import { HttpException } from "../../domain/errors";
import { AccountRepository } from "../../infra/database/repositories";
import { GetAccount } from "./contracts";

export class GetAccountQuery implements GetAccount {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(input: GetAccount.Input): GetAccount.Output {
    const account = await this.accountRepository.finOneBy({ id: input.id })
    if (!account) throw new HttpException('Account not found', 404)
    return { id: account.id, username: account.username }
  }
}