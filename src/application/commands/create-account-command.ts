import { Account } from '../../domain/entities/account'
import { type AccountRepositoryInterface } from '../../domain/repositories/account-repository'
import { type HasherInterface } from '../../infra/adapters/contracts'
import { type CreateAccount } from './contracts'

export class CreateAccountCommand implements CreateAccount {
  constructor (
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly hasher: HasherInterface
  ) { }

  async execute (input: CreateAccount.Input): CreateAccount.Output {
    const accountEmailExists = await this.accountRepository.finOneBy({ email: input.email.toLowerCase() })
    const accountUsernameExists = await this.accountRepository.finOneBy({ username: input.username.toLowerCase() })

    if (accountEmailExists) throw new Error('Account email already exists')

    if (accountUsernameExists) throw new Error('Account username already exists')

    const account = Account.create({
      email: input.email,
      username: input.username,
      password: await this.hasher.hash(input.password)
    })

    await this.accountRepository.save(account)
  }
}
