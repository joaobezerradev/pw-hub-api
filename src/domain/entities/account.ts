import { BaseEntity } from './base-entity'
import { randomUUID as uuid } from 'node:crypto'
import { AccountRole } from '../constants/account-role'
import { type AccountTokenType } from '../constants/account-token-type'

interface Token { id: string, typeId: string, code: string }

export class Account extends BaseEntity {
  email: string
  password: string
  username: string
  emailSentAt: Date | null
  emailConfirmedAt: Date | null
  lastAccessAt: Date
  isOnline: boolean
  roleId: AccountRole
  profile: Record<string, unknown>
  tokens: Token[]

  constructor (data: Partial<Account>) {
    super()
    Object.assign(this, data)
  }

  static create (data: Account.Create): Account {
    return new Account({
      id: uuid(),
      email: data.email,
      password: data.password,
      username: data.username,
      isOnline: false,
      emailConfirmedAt: null,
      emailSentAt: null,
      roleId: AccountRole.PLAYER,
      lastAccessAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  canResendEmailConfirmation (): boolean {
    if (!this.emailSentAt) return true
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    return this.emailSentAt <= oneHourAgo
  }

  storeToken (token: string, type: AccountTokenType): void {
    this.tokens.push({
      id: uuid(),
      code: token,
      typeId: type
    })
  }

  markEmailAsSent (now = new Date()): void {
    this.emailSentAt = now
  }
}

export namespace Account {
  export interface Create {
    email: string
    password: string
    username: string
  }
}
