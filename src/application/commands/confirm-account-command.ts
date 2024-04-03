import { AccountTokenType } from "../../domain/constants/account-token-type";
import { HttpException } from "../../domain/errors";
import { AccountRepositoryInterface } from "../../domain/repositories";
import { ConfirmAccount } from "./contracts";

export class ConfirmAccountCommand implements ConfirmAccount {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
  ) { }

  async execute(input: ConfirmAccount.Input): ConfirmAccount.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email })

    if (!account) throw new HttpException('Account email not found', 404)

    const isValidToken = account.isValidToken(input.token, AccountTokenType.CONFIRMATION)

    if (!isValidToken) throw new HttpException('Account token was invalid', 422)

    account.confirm()

    account.removeToken(input.token, AccountTokenType.CONFIRMATION)

    await this.accountRepository.save(account)
  }
}