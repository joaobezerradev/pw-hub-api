import { Column, Entity, OneToMany } from 'typeorm'
import { AccountMapping } from './account'
import { BaseMapping } from './base'

@Entity('account_role', { schema: 'pwclub' })
export class AccountRoleMapping extends BaseMapping {
  @Column('varchar', { name: 'name', length: 20 })
  name: string

  @Column('tinyint', { name: 'is_default', width: 1 })
  isDefault: boolean

  @OneToMany(() => AccountMapping, (account) => account.role)
  accounts: AccountMapping[]
}
