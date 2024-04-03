import { Response } from 'express'
import { z } from 'zod'
import { HttpException } from '../../../domain/errors'

export const handleError = (error: Error, res: Response): Response => {
  if (error instanceof z.ZodError) return res.status(400).send({ errors: error.errors })
  if (error instanceof HttpException) return res.status(error.code).send({ error: error.message })
  return res.status(500).send({ error: 'Internal server error', data: error })
}