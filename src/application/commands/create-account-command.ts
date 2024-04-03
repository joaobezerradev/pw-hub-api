import { Account } from '../../domain/entities/account'
import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories'
import { type HasherInterface } from '../../infra/adapters/contracts'
import { type CreateAccount } from './contracts'

export class CreateAccountCommand implements CreateAccount {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly hasher: HasherInterface
  ) { }

  async execute(input: CreateAccount.Input): CreateAccount.Output {
    const accountEmailExistsPromise = await this.accountRepository.finOneBy({ email: input.email.toLowerCase() })
    const accountUsernameExistsPromise = await this.accountRepository.finOneBy({ username: input.username.toLowerCase() })

    const [accountEmailExists, accountUsernameExists] = await Promise.all([accountEmailExistsPromise, accountUsernameExistsPromise])

    if (accountEmailExists) throw new HttpException('Account email already exists', 422)
    if (accountUsernameExists) throw new HttpException('Account username already exists', 422)

    const account = Account.create({
      email: input.email,
      username: input.username,
      password: await this.hasher.hash(input.password)
    })

    await this.accountRepository.save(account)
  }
}
