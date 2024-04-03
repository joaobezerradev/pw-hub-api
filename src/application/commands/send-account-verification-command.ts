import { AccountTokenType } from '../../domain/constants/account-token-type'
import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories/account-repository'
import { MailerInterface, type HasherInterface } from '../../infra/adapters/contracts'
import { type SendAccountVerification } from './contracts'

export class SendAccountVerificationCommand implements SendAccountVerification {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly hasher: HasherInterface,
    private readonly mailer: MailerInterface
  ) { }

  async execute(input: SendAccountVerification.Input): SendAccountVerification.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email.toLowerCase() })

    if (!account) throw new HttpException('Account not found', 404)
    if (account.emailConfirmedAt) throw new HttpException('Account email already verified', 422)
    if (!account.canResendEmailConfirmation()) throw new HttpException('The last confirmation link is still valid. Please check your email or try again later.', 422)

    let code: string
    let isUniqueCode: boolean

    do {
      code = await this.hasher.hash(account.id)
      isUniqueCode = account.tokens.some(token => token.typeId === AccountTokenType.CONFIRMATION && token.code === code)
    } while (isUniqueCode)

    account.storeToken(code, AccountTokenType.CONFIRMATION)

    await this.mailer.send(account.email, 'Confirmação de Conta', this.template(code))
    
    account.markEmailAsSent()

    await this.accountRepository.save(account)
  }


  private template(token: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de E-mail</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;
                color: #333;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <h1>Confirmação de E-mail</h1>
        <p>Olá,</p>
        <p>Obrigado por se registrar. Por favor, confirme seu e-mail clicando no link abaixo.</p>
        <a href="http://www.seusite.com/confirmacao?token=${token}" class="button">Confirmar E-mail</a>
        <p>Se você não se registrou em nosso site, por favor, ignore este e-mail.</p>
    </body>
    </html>
    `
  }
}
