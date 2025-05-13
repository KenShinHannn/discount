import { CampaignCategoriesEntity } from 'src/module/campaign-categories/entities/campaign-categories.entity';
import { CampaignTypesEntity } from 'src/module/campaign-types/entities/campaign-types.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'discount_campaign' })
export class DiscountCampaignEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string;

  @Column({ name: 'category_id', type: 'int' })
  categoryId!: number;

  @Column({ name: 'type_id', type: 'int' })
  typeId!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({
    name: 'start_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startAt!: Date;

  @Column({ name: 'end_at', type: 'timestamp', nullable: true })
  endAt!: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => CampaignCategoriesEntity)
  @JoinColumn({ name: 'category_id' })
  category!: CampaignCategoriesEntity;

  @ManyToOne(() => CampaignTypesEntity)
  @JoinColumn({ name: 'type_id' })
  type!: CampaignTypesEntity;
}
