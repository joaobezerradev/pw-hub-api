import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { AccountMapping } from './account'
import { BaseMapping } from './base'
import { CommunityMemberMapping } from './community-member'

@Entity('community', { schema: 'pwclub' })
export class CommunityMapping extends BaseMapping {
  @Column('varchar', { name: 'name', unique: true, length: 100 })
  name: string

  @Column('varchar', { name: 'description', length: 300 })
  description: string

  @Column('longtext', { name: 'image_base_64', nullable: true })
  imageBase_64: string | null

  @Column('longtext', { name: 'cover_image_base_64', nullable: true })
  coverImageBase_64: string | null

  @Column('varchar', { name: 'accountId', length: 32 })
  accountId: string

  @ManyToOne(() => AccountMapping, (account) => account.communities, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'accountId', referencedColumnName: 'id' }])
  account: AccountMapping

  @OneToMany(
    () => CommunityMemberMapping,
    (communityMember) => communityMember.community
  )
  communityMembers: CommunityMemberMapping[]
}
