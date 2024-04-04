import { type PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { type DatabaseConnectionInterface } from '../../adapters/contracts'
import { accountControllerFactory } from '../../factories'
import { autenticationMiddleware } from '../middlewares'

const makeAccountRouter =  (databaseConnection: DatabaseConnectionInterface<PrismaClient>): Router => {
  const accountController = accountControllerFactory(databaseConnection)

  const accountRouter = Router()

  accountRouter.post('/accounts', async (req, res) => await accountController.createAccount(req, res))
  accountRouter.post('/accounts/login', async (req, res) => await accountController.autenticate(req, res))
  accountRouter.post('/accounts/change-password', async (req, res) => await accountController.changeAccountPassword(req, res))
  accountRouter.post('/accounts/request-change-password', async (req, res) => await accountController.accountRequestResetPasswordToken(req, res))

  accountRouter.use(autenticationMiddleware)

  accountRouter.post('/accounts/request-confirm', async (req, res) => await accountController.sendAccountVerification(req, res))
  accountRouter.post('/accounts/confirm', async (req, res) => await accountController.confirmAccount(req, res))
  accountRouter.get('/accounts/auth', async (req, res) => await accountController.getAuth(req, res))

  return accountRouter
}

export default makeAccountRouter
