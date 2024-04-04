import { HttpException } from "../../domain/errors";
import { AccountRepositoryInterface } from "../../domain/repositories";
import { UpdateAccountProfile } from "./contracts";

export class UpdateAccountProfileCommand implements UpdateAccountProfile {
  constructor(private readonly accountRepository: AccountRepositoryInterface) { }

  async execute(input: UpdateAccountProfile.Input): UpdateAccountProfile.Output {
    const account = await this.accountRepository.finOneBy({ id: input.id })

    if (!account) throw new HttpException('Account not found', 404)

    account.updateProfile(input)

    await this.accountRepository.save(account)
  }
}