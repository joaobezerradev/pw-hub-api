import { type PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
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
      include: { tokens: true, profile: { include: { profileBadge: { include: { badge: true } } } } }
    })
    return data ? this.mapper(data) : null
  }

  async finBy(input: Partial<Account>): Promise<Account[]> {
    const data = await this.connection.getConnection().account.findMany({
      where: {
        id: input?.id,
        email: input.email?.toLowerCase(),
        username: input.username?.toLowerCase(),
      },
      include: { tokens: true, profile: { include: { profileBadge: { include: { badge: true } } } } }
    })
    return data.map(this.mapper)
  }

  async save(data: Account): Promise<void> {
    await this.connection.getConnection().$transaction(async (prisma) => {
      const { tokens, ...accountData } = data
      const account = await prisma.account.upsert({
        create: {
          id: accountData.id,
          email: accountData.email.toLowerCase(),
          username: accountData.username.toLowerCase(),
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
          email: accountData.email.toLowerCase(),
          username: accountData.username.toLowerCase(),
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

      await prisma.accountProfile.upsert({
        where: { accountId: accountData.id },
        create: {
          id: randomUUID(),
          name: accountData.profile.name,
          aboutMe: accountData.profile.aboutMe,
          address: accountData.profile.address,
          birthdate: accountData.profile.birthdate,
          phone: accountData.profile.phone,
          accountId: accountData.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          name: accountData.profile.name,
          aboutMe: accountData.profile.aboutMe,
          address: accountData.profile.address,
          birthdate: accountData.profile.birthdate,
          phone: accountData.profile.phone,
          accountId: accountData.id,
          updatedAt: new Date(),
        }
      })

      const promises: Promise<unknown>[] = []

      accountData.badges.map(badge => {
        const promise = prisma.profileBadge.upsert({
          where: { badgeId: badge.id, profile: { accountId: accountData.id }, id: badge.id },
          create: {
            id: badge.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            badge: { connect: { id: badge.id } },
            profile: { connect: { accountId: accountData.id } }
          },
          update: {
            updatedAt: new Date(),
            badge: { connect: { id: badge.id } },
            profile: { connect: { accountId: accountData.id } }
          }
        })

        promises.push(promise)
      })

      data.tokens.forEach(tokenData => {
        const promise = prisma.accountToken.upsert({
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

        promises.push(promise)
      });

      await Promise.all(promises);
    });
  }

  private mapper(data: any): Account {
    return new Account({
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
      tokens: data.tokens?.filter((tokens: { deletedAt: Date | null }) => !tokens.deletedAt),
      badges: data?.profile[0]?.profileBadge?.map((profileBadge: { badge: { id: string } }) => ({ id: profileBadge.badge.id })) ?? [],
      profile: {
        aboutMe: data.profile.at(0)?.aboutMe!,
        address: data.profile.at(0)?.address!,
        name: data.profile.at(0)?.name!,
        birthdate: data.profile.at(0)?.birthdate!,
        phone: data.profile.at(0)?.phone!
      }
    })
  }
}
