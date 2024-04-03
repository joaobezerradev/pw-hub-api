import { type Prisma, PrismaClient } from '@prisma/client'
import { type DefaultArgs } from '@prisma/client/runtime/library'
import { type DatabaseConnectionInterface } from '../contracts'

export class DatabaseConnectionAdapter implements DatabaseConnectionInterface<PrismaClient> {
  private readonly prismaClient: PrismaClient

  constructor () {
    this.prismaClient = new PrismaClient()
  }

  getConnection (): PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> {
    return this.prismaClient
  }
}
