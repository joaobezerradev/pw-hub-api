import { AccountRole } from '../../domain/constants'
import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories'
import { JwtInterface } from '../../infra/adapters/contracts'
import { environment } from '../../infra/config/environment'
import { RefreshAuthenticateAccount } from './contracts'

export class RefreshAuthenticateAccountCommand implements RefreshAuthenticateAccount {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly jwt: JwtInterface
  ) { }

  async execute(input: RefreshAuthenticateAccount.Input): RefreshAuthenticateAccount.Output {
    const { isValid, decoded } = await this.jwt.isValidToken<{ id: string, roleId: AccountRole }>(input.refreshToken)

    if (!isValid) throw new HttpException('Account invalid credentials', 422)

    const account = await this.accountRepository.finOneBy({ id: decoded.id })

    if (!account) throw new HttpException('Account invalid credentials', 422)

    const payload = { id: account.id, roleId: account.roleId }

    return { accessToken: await this.jwt.generateToken(payload, environment.jwt.expirationIn) }
  }
}
