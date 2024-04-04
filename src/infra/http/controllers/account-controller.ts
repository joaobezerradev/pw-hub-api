import { type Request, Response } from 'express'
import { z } from 'zod'
import { AccountRequestResetPasswordToken, AuthenticateAccount, ChangeAccountPassword, ConfirmAccount, RefreshAuthenticateAccount, SendAccountVerification, UpdateAccountProfile, type CreateAccount } from '../../../application/commands/contracts'
import { GetAccount, GetAccountProfile } from '../../../application/queries/contracts'
import { passwordSchema } from '../../validation'
import { handleError } from '../utils/handle-http-exception'

export class AccountController {
  constructor(
    private readonly createAccountCommand: CreateAccount,
    private readonly changeAccountPasswordCommand: ChangeAccountPassword,
    private readonly accountRequestResetPasswordTokenCommand: AccountRequestResetPasswordToken,
    private readonly sendAccountVerificationCommand: SendAccountVerification,
    private readonly authenticateAccountCommand: AuthenticateAccount,
    private readonly getAccountQuery: GetAccount,
    private readonly confirmAccountCommand: ConfirmAccount,
    private readonly refreshAuthenticateAccountCommand: RefreshAuthenticateAccount,
    private readonly updateAccountProfileCommand: UpdateAccountProfile,
    private readonly getAccountProfileQuery: GetAccountProfile
  ) { }

  async create(req: Request, res: Response): Promise<Response> {
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

  async changePassword(req: Request, res: Response): Promise<Response> {
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

  async requestResetPasswordToken(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email() })
    try {
      const validatedData = schema.parse(req.body)
      await this.accountRequestResetPasswordTokenCommand.execute(validatedData)
      return res.json()
    } catch (error) {
      return handleError(error, res)
    }
  }

  async requestConfirm(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email() })
    try {
      const validatedData = schema.parse(req.body)
      await this.sendAccountVerificationCommand.execute(validatedData)
      return res.json()
    } catch (error) {
      return handleError(error, res)
    }
  }

  async authenticate(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email(), password: passwordSchema })
    try {
      const validatedData = schema.parse(req.body)
      const response = await this.authenticateAccountCommand.execute(validatedData)
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }

  async getAuthenticate(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.getAccountQuery.execute({ id: req.user?.id! })
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }

  async confirm(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ email: z.string().email(), token: z.string() })
    try {
      const validatedData = schema.parse(req.body)
      const response = await this.confirmAccountCommand.execute(validatedData)
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }

  async refreshAutenticate(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ refreshToken: z.string() })
    try {
      const validatedData = schema.parse(req.body)
      const response = await this.refreshAuthenticateAccountCommand.execute(validatedData)
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }

  async updateProfile(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      id: z.string().uuid(),
      name: z.string(),
      aboutMe: z.string(),
      address: z.string(),
      birthdate: z.string(),
      phone: z.string()
    })
    try {
      const validatedData = schema.parse({ id: req.user?.id, ...req.body })
      const response = await this.updateAccountProfileCommand.execute(validatedData)
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    const schema = z.object({ id: z.string().uuid() })
    try {
      const validatedData = schema.parse({ id: req.user?.id })
      const response = await this.getAccountProfileQuery.execute(validatedData)
      return res.json(response)
    } catch (error) {
      return handleError(error, res)
    }
  }
}
