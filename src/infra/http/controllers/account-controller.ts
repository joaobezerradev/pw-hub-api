import { type Request, type Response } from 'express'
import { z } from 'zod'
import { type CreateAccount } from '../../../application/commands/contracts'
import { passwordSchema } from '../../validation'

export class AccountController {
  constructor (private readonly createAccountCommand: CreateAccount) { }

  async createAccount (req: Request, res: Response): Promise<Response> {
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
      if (error instanceof z.ZodError) {
        return res.status(400).send({ errors: error.errors })
      }
      console.error(error)
      return res.status(500).send({ error: 'Internal server error' })
    }
  }
}
