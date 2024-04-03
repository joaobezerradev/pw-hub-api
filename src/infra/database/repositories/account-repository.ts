import { type PrismaClient } from '@prisma/client'
import { AccountRole } from '../../../domain/constants/account-role'
import { Account } from '../../../domain/entities/account'
import { type AccountRepositoryInterface } from '../../../domain/repositories/account-repository'
import { type DatabaseConnectionInterface } from '../../adapters/contracts'

export class AccountRepository implements AccountRepositoryInterface {
  constructor(private readonly connection: DatabaseConnectionInterface<PrismaClient>) { }

  async finOneBy(input: Partial<Account>): Promise<Account | null> {
    const data = await this.connection.getConnection().account.findFirst({
      where: {
        id: input?.id,
        email: input.email?.toLowerCase(),
        username: input.username?.toLowerCase(),
      },
      include: { tokens: true }
    })
    return data ? new Account({
      id: data.id,
      email: data.email,
      username: data.username,
      password: data.password,
      emailConfirmedAt: data.emailConfirmedAt,
      emailSentAt: data.emailSentAt,
      isOnline: data.isOnline,
      lastAccessAt: data.lastAccessAt,
      roleId: data.roleId as AccountRole,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      tokens: data.tokens.filter(tokens => !tokens.deletedAt),
    }) : null
  }

  async finBy(input: Partial<Account>): Promise<Account[]> {
    const data = await this.connection.getConnection().account.findMany({
      where: {
        id: input?.id,
        email: input.email?.toLowerCase(),
        username: input.username?.toLowerCase(),
      },
      include: { tokens: true }
    })
    return data.map(data => new Account({
      id: data.id,
      email: data.email,
      username: data.username,
      password: data.password,
      emailConfirmedAt: data.emailConfirmedAt,
      emailSentAt: data.emailSentAt,
      isOnline: data.isOnline,
      lastAccessAt: data.lastAccessAt,
      roleId: data.roleId as AccountRole,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }))
  }

  async save(data: Account): Promise<void> {
    await this.connection.getConnection().$transaction(async (prisma) => {
      const { tokens, ...accountData } = data
      const account = await prisma.account.upsert({
        create: {
          id: accountData.id,
          email: accountData.email,
          username: accountData.username,
          password: accountData.password,
          emailConfirmedAt: accountData.emailConfirmedAt,
          emailSentAt: accountData.emailSentAt,
          isOnline: accountData.isOnline,
          lastAccessAt: accountData.lastAccessAt,
          roleId: accountData.roleId,
          createdAt: accountData.createdAt,
          updatedAt: accountData.updatedAt,
        },
        where: { id: data.id },
        update: {
          id: accountData.id,
          email: accountData.email,
          username: accountData.username,
          password: accountData.password,
          emailConfirmedAt: accountData.emailConfirmedAt,
          emailSentAt: accountData.emailSentAt,
          isOnline: accountData.isOnline,
          lastAccessAt: accountData.lastAccessAt,
          roleId: accountData.roleId,
          createdAt: accountData.createdAt,
          updatedAt: accountData.updatedAt,
        },
      });

      const tokenPromises = data.tokens.map(tokenData => {
        return prisma.accountToken.upsert({
          where: { id: tokenData.id },
          create: {
            id: tokenData.id,
            code: tokenData.code,
            expiresAt: tokenData.expiresAt,
            typeId: tokenData.typeId,
            createdAt: tokenData.createdAt,
            updatedAt: tokenData.updatedAt,
            deletedAt: tokenData.deletedAt,
            accountId: account.id,
          },
          update: {
            id: tokenData.id,
            code: tokenData.code,
            expiresAt: tokenData.expiresAt,
            typeId: tokenData.typeId,
            createdAt: tokenData.createdAt,
            updatedAt: tokenData.updatedAt,
            deletedAt: tokenData.deletedAt,
            accountId: account.id,
          },
        });
      });

      await Promise.all(tokenPromises);
    });
  }
}
