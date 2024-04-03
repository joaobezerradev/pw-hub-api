import { type PrismaClient } from '@prisma/client'
import { Account } from '../../../../domain/entities/account'
import { type AccountRepositoryInterface } from '../../../../domain/repositories/account-repository'
import { type DatabaseConnectionInterface } from '../../contracts'

export class AccountRepository implements AccountRepositoryInterface {
  constructor (private readonly connection: DatabaseConnectionInterface<PrismaClient>) { }

  async finOneBy (input: Partial<Account>): Promise<Account | null> {
    const data = await this.connection.getConnection().account.findFirst({
      where: input as any
    })
    return data ? new Account(data) : null
  }

  async finBy (input: Partial<Account>): Promise<Account[]> {
    const data = await this.connection.getConnection().account.findMany({
      where: input as any
    })
    return data.map(data => new Account(data))
  }

  async save (data: Account): Promise<void> {
    await this.connection.getConnection().account.upsert({
      create: {
        ...data

      },
      where: { id: data.id },
      update: data as any
    })
  }
}
