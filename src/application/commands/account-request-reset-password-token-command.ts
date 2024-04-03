

import { AccountTokenType } from '../../domain/constants/account-token-type'
import { HttpException } from '../../domain/errors'
import { type AccountRepositoryInterface } from '../../domain/repositories'
import { MailerInterface } from '../../infra/adapters/contracts'
import { AccountRequestResetPasswordToken } from './contracts'

export class AccountRequestResetPasswordTokenCommand implements AccountRequestResetPasswordToken {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface
  ) { }

  async execute(input: AccountRequestResetPasswordToken.Input): AccountRequestResetPasswordToken.Output {
    const account = await this.accountRepository.finOneBy({ email: input.email })

    if (!account) throw new HttpException('Account email not found', 404)

    let code: string
    let isUniqueCode: boolean

    do {
      code = this.generateToken()
      isUniqueCode = account.tokens.some(token => token.typeId === AccountTokenType.RESET_PASSWORD && token.code === code)
    } while (isUniqueCode)

    account.storeToken(code, AccountTokenType.RESET_PASSWORD)

    await this.mailer.send(account.email, 'Código de Confirmação', this.template(code))

    await this.accountRepository.save(account)
  }

  private generateToken(): string {
    let digits = '';
    for (let i = 0; i < 6; i++) {
      digits += Math.floor(Math.random() * 10).toString();
    }
    return digits;
  }

  private template(token: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Confirmação</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .code {
            font-size: 20px;
            font-weight: bold;
            color: #007bff;
            padding: 10px;
            border: 1px dashed #007bff;
            display: inline-block;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Alteração de Senha</h2>
        <p>Olá,</p>
        <p>Você solicitou a alteração da sua senha. Use o código abaixo para confirmar a alteração no site:</p>
        <div class="code">${token}</div>
        <p>Este código é válido por 30 minutos. Não compartilhe este código com ninguém.</p>
        <p>Se você não solicitou a alteração da senha, por favor, ignore este e-mail ou entre em contato conosco para garantir a segurança da sua conta.</p>
        <hr>
        <p>Se tiver dúvidas, fique à vontade para responder este e-mail ou nos contatar diretamente.</p>
    </div>
</body>
</html>
`
  }
}
