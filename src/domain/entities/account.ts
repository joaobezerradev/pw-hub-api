import { BaseEntity } from './base-entity'
import { randomUUID as uuid } from 'node:crypto'
import { AccountRole } from '../constants/account-role'

interface Token { id: string, type: string, code: number }
interface Role { id: string }

export class Account extends BaseEntity {
  readonly email: string
  readonly password: string
  readonly username: string
  readonly emailSentAt: Date | null
  readonly emailConfirmedAt: Date | null
  readonly lastAccessAt: Date
  readonly isOnline: boolean
  readonly role: Role
  readonly profile: {}
  readonly tokens: Token[]

  constructor (data: Partial<Account>) {
    super()
    Object.assign(this, data)
  }

  static create (data: Account.Create): Account {
    return new Account({
      id: uuid(),
      email: data.email,
      password: data.password,
      isOnline: false,
      emailConfirmedAt: null,
      emailSentAt: null,
      role: { id: AccountRole.PLAYER },
      lastAccessAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
}

export namespace Account {
  export interface Create {
    email: string
    password: string
  }
}
