import { type PrismaClient } from '@prisma/client'
import { CreateAccountCommand } from '../../application/commands/'
import { type DatabaseConnectionInterface } from '../adapters/contracts'
import { AccountRepository } from '../adapters/database/repositories'
import { HasherAdapter } from '../adapters/hasher/hasher-adapter'
import { AccountController } from '../http/controllers/account-controller'

export const accountControllerFactory = (databaseConnection: DatabaseConnectionInterface<PrismaClient>): AccountController => {
  const accountRepository = new AccountRepository(databaseConnection)
  const hasher = new HasherAdapter()
  const createAccountCommand = new CreateAccountCommand(accountRepository, hasher)
  return new AccountController(createAccountCommand)
}
