import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories'
import { JwtInterface, type HasherInterface } from '../../infra/adapters/contracts'
import { environment } from '../../infra/config/environment'
import { AuthenticateAccount } from './contracts'

export class AuthenticateAccountCommand implements AuthenticateAccount {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly hasher: HasherInterface,
    private readonly jwt: JwtInterface
  ) { }

  async execute(input: AuthenticateAccount.Input): AuthenticateAccount.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email })

    if (!account) throw new HttpException('Account invalid credentials', 422)

    const isValid = await this.hasher.compare(input.password, account.password)

    if (!isValid) throw new HttpException('Account invalid credentials', 422)

    const payload = { id: account.id, roleId: account.roleId }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.generateToken(payload, environment.jwt.expirationIn),
      this.jwt.generateToken(payload, environment.jwt.refreshExpirationIn)
    ])

    return { accessToken, refreshToken }
  }
}
