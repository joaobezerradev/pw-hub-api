import { AccountTokenType } from '../../domain/constants/account-token-type'
import { type AccountRepositoryInterface } from '../../domain/repositories/account-repository'
import { type HasherInterface } from '../../infra/adapters/contracts'
import { type QueueInterface } from '../../infra/adapters/contracts/queue'
import { type SendAccountVerification } from './contracts'

export class SendAccountVerificationCommand implements SendAccountVerification {
  private readonly accountRepository: AccountRepositoryInterface
  private readonly hasher: HasherInterface
  private readonly queue: QueueInterface

  async execute (input: SendAccountVerification.Input): SendAccountVerification.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email.toLowerCase() })

    if (!account) throw new Error('Account not found')
    if (account.emailConfirmedAt) throw new Error('Account email already verified')
    if (!account.canResendEmailConfirmation()) throw new Error('The last confirmation link is still valid. Please check your email or try again later.')

    const token = await this.hasher.hash(account.id)

    account.storeToken(token, AccountTokenType.CONFIRMATION)

    await this.queue.send('account-confirmation', {})

    await this.accountRepository.save(account)
  }
}
