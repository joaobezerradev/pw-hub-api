import { type Request, Response } from 'express'
import { z } from 'zod'
import { type CreateAccount } from '../../../application/commands/contracts'
import { HttpException } from '../../../domain/errors'
import { passwordSchema } from '../../validation'
import { handleError } from '../utils/handle-http-exception'

export class AccountController {
  constructor(private readonly createAccountCommand: CreateAccount) { }

  async createAccount(req: Request, res: Response): Promise<Response> {
    const schema = z.object({
      email: z.string().email(),
      username: z.string().max(15),
      password: passwordSchema
    })

    try {
      const validatedData = schema.parse(req.body)
      await this.createAccountCommand.execute(validatedData)
      return res.status(201).send({ message: 'Account created successfully.' })
    } catch (error) {
      return handleError(error, res)
    }
  }
}
