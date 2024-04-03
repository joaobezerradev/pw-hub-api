import { type Request, Response } from 'express'
import { z } from 'zod'
import { AccountRequestResetPasswordToken, AuthAccount, ChangeAccountPassword, SendAccountVerification, type CreateAccount } from '../../../application/commands/contracts'
import { passwordSchema } from '../../validation'
import { handleError } from '../utils/handle-http-exception'

export class AccountController {
  constructor(
    private readonly createAccountCommand: CreateAccount,
    private readonly changeAccountPasswordCommand: ChangeAccountPassword,
    private readonly accountRequestResetPasswordTokenCommand: AccountRequestResetPasswordToken,
    private readonly sendAccountVerificationCommand: SendAccountVerification,
    private readonly authAccountCommand: AuthAccount
  ) { }

  async createAccount(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      email: z.string().email(),
      username: z.string().max(15),
      password: passwordSchema
    })

    try {
      const validatedData = schema.parse(req.body)
      await this.createAccountCommand.execute(validatedData)
      return res.json()
    } catch (error) {
      return handleError(error, res)
    }
  }

  async changeAccountPassword(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      email: z.string().email(),
      token: z.string().min(6).max(6),
      password: passwordSchema
    })

    try {
      const validatedData = schema.parse(req.body)
      await this.changeAccountPasswordCommand.execute(validatedData)
      return res.json()
    } catch (error) {
      return handleError(error, res)
    }
  }

  async accountRequestResetPasswordToken(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email() })
    try {
      const validatedData = schema.parse(req.body)
      await this.accountRequestResetPasswordTokenCommand.execute(validatedData)
      return res.json()
    } catch (error) {
      return handleError(error, res)
    }
  }

  async sendAccountVerification(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email() })
    try {
      const validatedData = schema.parse(req.body)
      await this.sendAccountVerificationCommand.execute(validatedData)
      return res.json()
    } catch (error) {
      return handleError(error, res)
    }
  }

  async autenticate(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email(), password: passwordSchema })
    try {
      const validatedData = schema.parse(req.body)
      const response = await this.authAccountCommand.execute(validatedData)
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}
