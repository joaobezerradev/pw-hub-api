import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

export class BaseMapping {
  @PrimaryColumn('uuid', { primary: true, name: 'id' })
  id: string

  @Generated('increment')
  @Column({ type: 'bigint', name: 'alternative_id' })
  alternativeId: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp'
  })
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp'
  })
  deletedAt?: Date
}
