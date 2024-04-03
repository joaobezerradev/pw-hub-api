import { type PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { type DatabaseConnectionInterface } from '../../adapters/contracts'
import { accountControllerFactory } from '../../factories'

const makeAccountRouter = async (databaseConnection: DatabaseConnectionInterface<PrismaClient>): Promise<Router> => {
  const accountController = accountControllerFactory(databaseConnection)

  const accountRouter = Router()

  accountRouter.post('/accounts', async (req, res) => await accountController.createAccount(req, res))

  return accountRouter
}

export default makeAccountRouter
