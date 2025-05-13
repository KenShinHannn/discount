import { DiscountCampaignEntity } from 'src/module/discount-campaign/entities/discount-campaign.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'discount_campaign_rules' })
export class DiscountCampaignRulesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'campaign_id' })
  campaignId!: number;

  @Column({ name: 'percentage', type: 'decimal', precision: 5, scale: 2 })
  percentage!: number;

  @Column({ name: 'fixed_amount', type: 'decimal', precision: 10, scale: 2 })
  fixedAmount!: number;

  @Column({ name: 'applicable_category', type: 'text', nullable: true })
  applicableCategory!: string;

  @Column({ name: 'points_cap_ratio', type: 'decimal', precision: 3, scale: 2 })
  pointsCapRatio!: number;

  @Column({ name: 'step_every_x', type: 'decimal', precision: 10, scale: 2 })
  stepEveryX!: number;

  @Column({ name: 'discount_y', type: 'decimal', precision: 10, scale: 2 })
  discountY!: number;

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

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => DiscountCampaignEntity)
  @JoinColumn({ name: 'campaign_id' })
  campaign!: DiscountCampaignEntity;
}
