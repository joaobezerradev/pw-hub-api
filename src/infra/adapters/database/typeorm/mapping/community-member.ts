import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { BaseMapping } from './base'
import { AccountMapping } from './account'
import { CommunityMapping } from './community'
import { CommunityRoleMapping } from './community-role'
import { CommunityPostMapping } from './community-post'

@Entity('community_member', { schema: 'pwclub' })
export class CommunityMemberMapping extends BaseMapping {
  @Column('varchar', { name: 'community_id', length: 32 })
  communityId: string

  @Column('varchar', { name: 'account_id', length: 32 })
  accountId: string

  @Column('varchar', { name: 'community_role_id', length: 32 })
  communityRoleId: string

  @ManyToOne(() => AccountMapping, (account) => account.communityMembers, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountMapping

  @ManyToOne(() => CommunityMapping, (community) => community.communityMembers, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'community_id', referencedColumnName: 'id' }])
  community: CommunityMapping

  @ManyToOne(
    () => CommunityRoleMapping,
    (communityRole) => communityRole.communityMembers,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
  )
  @JoinColumn([{ name: 'community_role_id', referencedColumnName: 'id' }])
  communityRole: CommunityRoleMapping

  @OneToMany(
    () => CommunityPostMapping,
    (communityPost) => communityPost.communityMember
  )
  communityPosts: CommunityPostMapping[]
}
