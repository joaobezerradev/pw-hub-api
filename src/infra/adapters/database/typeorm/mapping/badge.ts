import { Column, Entity, OneToMany } from 'typeorm'
import { BaseMapping } from './base'
import { ProfileBadgeMapping } from './profile-badge'

@Entity('badge', { schema: 'pwclub' })
export class BadgeMapping extends BaseMapping {
  @Column('longtext', { name: 'image_base_64', nullable: true })
  imageBase_64: string | null

  @Column('varchar', { name: 'name', unique: true, length: 100 })
  name: string

  @Column('varchar', { name: 'description', length: 300 })
  description: string

  @OneToMany(() => ProfileBadgeMapping, (profileBadge) => profileBadge.badge)
  profileBadges: ProfileBadgeMapping[]
}
