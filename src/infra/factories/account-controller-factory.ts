import { type PrismaClient } from '@prisma/client'
import { AccountRequestResetPasswordTokenCommand, AuthenticateAccountCommand, ChangeAccountPasswordCommand, CreateAccountCommand, SendAccountVerificationCommand } from '../../application/commands'
import { type DatabaseConnectionInterface } from '../adapters/contracts'
import { AccountRepository } from '../database/repositories'
import { HasherAdapter } from '../adapters/hasher/hasher-adapter'
import { AccountController } from '../http/controllers/account-controller'
import { MailerAdapter } from '../adapters/mailer/mailer-adapter'
import { JwtAdapter } from '../adapters/jwt/jwt-adapter'
import { GetAccountQuery } from '../../application/queries'
import { ConfirmAccountCommand } from '../../application/commands/confirm-account-command'

export const accountControllerFactory = (databaseConnection: DatabaseConnectionInterface<PrismaClient>): AccountController => {
  const accountRepository = new AccountRepository(databaseConnection)
  const hasher = new HasherAdapter()
  const mailer = new MailerAdapter()
  const jwt = new JwtAdapter()
  const createAccountCommand = new CreateAccountCommand(accountRepository, hasher)
  const changeAccountPasswordCommand = new ChangeAccountPasswordCommand(accountRepository, hasher)
  const accountRequestResetPasswordTokenCommand = new AccountRequestResetPasswordTokenCommand(accountRepository, mailer)
  const sendAccountVerificationCommand = new SendAccountVerificationCommand(accountRepository, hasher, mailer)
  const authenticateAccountCommand = new AuthenticateAccountCommand(accountRepository, hasher, jwt)
  const confirmAccountCommand = new ConfirmAccountCommand(accountRepository)
  const getAccountQuery = new GetAccountQuery(accountRepository)

  return new AccountController(
    createAccountCommand,
    changeAccountPasswordCommand,
    accountRequestResetPasswordTokenCommand,
    sendAccountVerificationCommand,
    authenticateAccountCommand,
    getAccountQuery,
    confirmAccountCommand
  )
}
