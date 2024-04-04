import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories'
import { JwtInterface, type HasherInterface } from '../../infra/adapters/contracts'
import { environment } from '../../infra/config/environment'
import { AuthAccount } from './contracts'

export class AuthAccountCommand implements AuthAccount {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly hasher: HasherInterface,
    private readonly jwt: JwtInterface
  ) { }

  async execute(input: AuthAccount.Input): AuthAccount.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email })

    if (!account) throw new HttpException('Account email not found', 404)

    const isValid = await this.hasher.compare(input.password, account.password)

    if (!isValid) throw new HttpException('Account invalid credentials', 422)

    return {
      token: this.jwt.generateToken({ id: account.id }, environment.jwt.expirationIn)
    }
  }
}
