import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AccountProfileMapping } from './account-profile'
import { BadgeMapping } from './badge'
import { BaseMapping } from './base'

@Entity('profile_badge', { schema: 'pwclub' })
export class ProfileBadgeMapping extends BaseMapping {
  @Column('varchar', { name: 'account_profile_id', length: 32 })
  accountProfileId: string

  @Column('varchar', { name: 'badge_id', length: 32 })
  badgeId: string

  @ManyToOne(
    () => AccountProfileMapping,
    (accountProfile) => accountProfile.profileBadges,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
  )
  @JoinColumn([{ name: 'account_profile_id', referencedColumnName: 'id' }])
  accountProfile: AccountProfileMapping

  @ManyToOne(() => BadgeMapping, (badge) => badge.profileBadges, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'badge_id', referencedColumnName: 'id' }])
  badge: BadgeMapping
}
