import { Column, Entity, OneToMany } from 'typeorm'
import { BaseMapping } from './base'
import { CommunityMemberMapping } from './community-member'

@Entity('community_role', { schema: 'pwclub' })
export class CommunityRoleMapping extends BaseMapping {
  @Column('varchar', { name: 'name', length: 20 })
  name: string

  @OneToMany(
    () => CommunityMemberMapping,
    (communityMember) => communityMember.communityRole
  )
  communityMembers: CommunityMemberMapping[]
}
