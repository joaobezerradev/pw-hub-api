import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseMapping } from './base'
import { CommunityMemberMapping } from './community-member'

@Entity('community_post', { schema: 'pwclub' })
export class CommunityPostMapping extends BaseMapping {
  @Column('varchar', { name: 'community_member_id', length: 32 })
  communityMemberId: string

  @Column('varchar', { name: 'title', length: 100 })
  title: string

  @Column('varchar', { name: 'content', length: 500 })
  content: string

  @ManyToOne(
    () => CommunityMemberMapping,
    (communityMember) => communityMember.communityPosts,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
  )
  @JoinColumn([{ name: 'community_member_id', referencedColumnName: 'id' }])
  communityMember: CommunityMemberMapping
}
