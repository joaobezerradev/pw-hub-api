import { type PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { type DatabaseConnectionInterface } from '../../adapters/contracts'
import { accountControllerFactory } from '../factories'
import { autenticationMiddleware } from '../middlewares'

const makeAccountRouter = (databaseConnection: DatabaseConnectionInterface<PrismaClient>): Router => {
  const accountController = accountControllerFactory(databaseConnection)

  const accountRouter = Router()

  accountRouter.post('/accounts', async (req, res) => await accountController.create(req, res))
  accountRouter.post('/accounts/login', async (req, res) => await accountController.authenticate(req, res))
  accountRouter.post('/accounts/refresh', async (req, res) => await accountController.refreshAutenticate(req, res))
  accountRouter.post('/accounts/change-password', async (req, res) => await accountController.changePassword(req, res))
  accountRouter.post('/accounts/request-change-password', async (req, res) => await accountController.requestResetPasswordToken(req, res))

  accountRouter.use(autenticationMiddleware)

  accountRouter.get('/accounts/auth', async (req, res) => await accountController.getAuthenticate(req, res))
  accountRouter.get('/accounts/profile', async (req, res) => await accountController.getProfile(req, res))
  accountRouter.put('/accounts/profile', async (req, res) => await accountController.updateProfile(req, res))
  accountRouter.post('/accounts/request-confirm', async (req, res) => await accountController.requestConfirm(req, res))
  accountRouter.post('/accounts/confirm', async (req, res) => await accountController.confirm(req, res))

  return accountRouter
}

export default makeAccountRouter
