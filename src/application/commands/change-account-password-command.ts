import { AccountTokenType } from '../../domain/constants/account-token-type'
import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories'
import { type HasherInterface } from '../../infra/adapters/contracts'
import { ChangeAccountPassword } from './contracts'

export class ChangeAccountPasswordCommand implements ChangeAccountPassword {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly hasher: HasherInterface
  ) { }

  async execute(input: ChangeAccountPassword.Input): ChangeAccountPassword.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email })

    if (!account) throw new HttpException('Account email not found', 404)

    const isValidToken = account.isValidToken(input.token, AccountTokenType.RESET_PASSWORD)

    if (!isValidToken) throw new HttpException('Account token was invalid', 422)

    const passwordHashed = await this.hasher.hash(input.password)

    account.updatePassword(passwordHashed)
    account.removeToken(input.token, AccountTokenType.RESET_PASSWORD)

    await this.accountRepository.save(account)
  }
}
