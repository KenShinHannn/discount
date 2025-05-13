import { DiscountCampaignEntity } from 'src/module/discount-campaign/entities/discount-campaign.entity';
import { DiscountCampaignRulesEntity } from 'src/module/discount-campaignrules/entities/discount-campaignrules.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemDto } from '../dtos/items.dto';

@Entity({ name: 'apply_discounts' })
export class ApplyDiscountsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'cart_items', type: 'json' })
  cartItems!: ItemDto[];

  @Column({ name: 'points_used'})
  pointsUsed!: number;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2 })
  originalPrice!: number;

  @Column({ name: 'discount_price', type: 'decimal', precision: 10, scale: 2 })
  finalPrice!: number;

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

  @ManyToOne(() => DiscountCampaignRulesEntity)
  @JoinColumn({ name: 'rule_id' })
  rule!: DiscountCampaignRulesEntity;

}
