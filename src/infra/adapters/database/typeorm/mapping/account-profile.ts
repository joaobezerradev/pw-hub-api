import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm'
import { AccountMapping } from './account'
import { BaseMapping } from './base'
import { ProfileBadgeMapping } from './profile-badge'

@Entity('account_profile', { schema: 'pwclub' })
export class AccountProfileMapping extends BaseMapping {
  @Column('varchar', { name: 'name', length: 80 })
  name: string

  @Column('longtext', { name: 'image_base_64', nullable: true })
  imageBase_64: string | null

  @Column('longtext', { name: 'cover_image_base_64', nullable: true })
  coverImageBase_64: string | null

  @Column('varchar', { name: 'about_me', length: 300 })
  aboutMe: string

  @Column('varchar', { name: 'address', length: 100 })
  address: string

  @Column('varchar', { name: 'birthdate', length: 10 })
  birthdate: string

  @Column('varchar', { name: 'phone', length: 15 })
  phone: string

  @Column('varchar', { name: 'account_id', length: 32 })
  accountId: string

  @OneToOne(() => AccountMapping, (account) => account.profile, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: AccountMapping

  @OneToMany(() => ProfileBadgeMapping, (profileBadge) => profileBadge.accountProfile)
  profileBadges: ProfileBadgeMapping[]
}
