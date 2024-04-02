import { Column, Entity, OneToMany } from 'typeorm'
import { AccountTokenMapping } from './account-token'
import { BaseMapping } from './base'

@Entity('account_token_type', { schema: 'pwclub' })
export class AccountTokenTypeMapping extends BaseMapping {
  @Column('varchar', { name: 'name', length: 80 })
  name: string

  @OneToMany(
    () => AccountTokenMapping,
    (accountToken) => accountToken.type
  )
  accountTokens: AccountTokenMapping[]
}
