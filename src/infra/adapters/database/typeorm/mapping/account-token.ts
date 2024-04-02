import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AccountMapping } from './account'
import { AccountTokenTypeMapping } from './account-token-type'
import { BaseMapping } from './base'

@Entity('account_token', { schema: 'pwclub' })
export class AccountTokenMapping extends BaseMapping {
  @Column('varchar', { name: 'token', length: 80 })
  token: string

  @Column('datetime', { name: 'expires_at' })
  expiresAt: Date

  @Column('varchar', { name: 'account_id', length: 32 })
  accountId: string

  @Column('varchar', { name: 'account_token_type_id', length: 32 })
  accountTokenTypeId: string

  @ManyToOne(() => AccountMapping, (account) => account.tokens, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountMapping

  @ManyToOne(
    () => AccountTokenTypeMapping,
    (accountTokenType) => accountTokenType.accountTokens,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
  )
  @JoinColumn([{ name: 'account_token_type_id', referencedColumnName: 'id' }])
  type: AccountTokenTypeMapping
}
