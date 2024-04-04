import { HttpException } from "../../domain/errors";
import { AccountRepository } from "../../infra/database/repositories";
import { GetAccountProfile } from "./contracts";

export class GetAccountProfileQuery implements GetAccountProfile {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(input: GetAccountProfile.Input): GetAccountProfile.Output {
    const account = await this.accountRepository.finOneBy({ id: input.id })
    if (!account) throw new HttpException('Account not found', 404)
    return {
      name: account.profile.name,
      aboutMe: account.profile.aboutMe,
      address: account.profile.address,
      birthdate: account.profile.birthdate,
      phone: account.profile.phone,
      badges: account.badges
    }
  }
}