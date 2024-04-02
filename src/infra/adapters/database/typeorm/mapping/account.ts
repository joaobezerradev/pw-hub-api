import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm'
import { AccountProfileMapping } from './account-profile'
import { AccountRoleMapping } from './account-role'
import { AccountTokenMapping } from './account-token'

import { BaseMapping } from './base'
import { CommunityMapping } from './community'
import { CommunityMemberMapping } from './community-member'

@Entity('account', { schema: 'pwclub' })
export class AccountMapping extends BaseMapping {
  @Column('varchar', { name: 'username', unique: true, length: 15 })
  username: string

  @Column('varchar', { name: 'password', length: 30 })
  password: string

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string

  @Column('datetime', { name: 'email_sent_at', nullable: true })
  emailSentAt: Date | null

  @Column('datetime', { name: 'email_confirmed_at', nullable: true })
  emailConfirmedAt: Date | null

  @Column('varchar', { name: 'role_id', length: 191 })
  roleId: string

  @Column('datetime', { name: 'last_access_at' })
  lastAccessAt: Date

  @Column('tinyint', { name: 'is_online', width: 1 })
  isOnline: boolean

  @ManyToOne(() => AccountRoleMapping, (accountRole) => accountRole.accounts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: AccountRoleMapping

  @OneToOne(() => AccountProfileMapping, (accountProfile) => accountProfile.account)
  profile: AccountProfileMapping

  @OneToMany(() => AccountTokenMapping, (accountToken) => accountToken.account)
  tokens: AccountTokenMapping[]

  @OneToMany(() => CommunityMapping, (community) => community.account)
  communities: CommunityMapping[]

  @OneToMany(
    () => CommunityMemberMapping,
    (communityMember) => communityMember.account
  )
  communityMembers: CommunityMemberMapping[]
}
