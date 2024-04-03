import { BaseEntity } from './base-entity'
import { randomUUID as uuid } from 'node:crypto'
import { AccountRole } from '../constants/account-role'
import { type AccountTokenType } from '../constants/account-token-type'
import { environment } from '../../infra/config/environment'

interface Token { id: string, typeId: string, code: string, expiresAt: Date, createdAt: Date, updatedAt: Date, deletedAt: Date | null }

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

  constructor(data: Partial<Account>) {
    super()
    this.tokens = []
    Object.assign(this, data)
  }

  static create(data: Account.Create): Account {
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

  canResendEmailConfirmation(): boolean {
    if (!this.emailSentAt) return true
    const expireTime = new Date(Date.now() - 60 * environment.app.tokenAccountExpiresInMinutes * 1000)
    return this.emailSentAt <= expireTime
  }

  storeToken(code: string, type: AccountTokenType): void {
    this.tokens.push({
      id: uuid(),
      code: code,
      typeId: type,
      expiresAt: new Date(Date.now() + 60 * environment.app.tokenAccountExpiresInMinutes * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    })
  }

  canResendToken(type: AccountTokenType): boolean {
    const token = this.tokens.find(token => token.typeId === type);
    if (!token) return true;
    const expireTime = token.expiresAt.getTime();
    const canResend = Date.now() > expireTime
    if (canResend) token.deletedAt = new Date()
    return canResend
  }

  removeToken(code: string, type: AccountTokenType): void {
    const token = this.tokens.find(token => token.code === code && type === token.typeId)
    if (token) token.deletedAt = new Date()
  }

  isValidToken(code: string, type: AccountTokenType): boolean {
    const token = this.tokens.find(token => token.code === code && token.typeId === type)
    if (!token) return false
    return token.expiresAt.getTime() < Date.now()
  }

  updatePassword(password: string): void {
    this.password = password
  }

  markEmailAsSent(now = new Date()): void {
    this.emailSentAt = now
  }

  confirm(now = new Date()): void {
    this.emailConfirmedAt = now
  }
}

export namespace Account {
  export interface Create {
    email: string
    password: string
    username: string
  }
}
