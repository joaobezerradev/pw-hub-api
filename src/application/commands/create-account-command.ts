import { Account } from "../../domain/entities/account";
import { AccountRepositoryInterface } from "../../domain/repositories/account-repository";
import { HasherInterface } from "../../infra/adapters/contracts";
import { CreateAccount } from "./contracts";

export class CreateAccountCommand implements CreateAccount {
  private readonly accountRepository: AccountRepositoryInterface
  private readonly hasher: HasherInterface

  async execute(input: CreateAccount.Input): CreateAccount.Output {
    const accountExists = await this.accountRepository.finOneBy({ email: input.email.toLowerCase() })

    if (accountExists) throw new Error('Account email already exists')

    const account = Account.create({
      email: input.email,
      password: await this.hasher.hash(input.password),
    })

    await this.accountRepository.save(account)
  }
}
