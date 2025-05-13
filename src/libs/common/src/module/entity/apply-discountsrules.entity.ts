// apply-discount-rule.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { DiscountCampaignRulesEntity } from 'src/module/discount-campaignrules/entities/discount-campaignrules.entity';
import { ApplyDiscountsEntity } from 'src/module/apply-discounts/entities/apply-discounts.entity';

@Entity({ name: 'apply_discount_rules' })
export class ApplyDiscountRulesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ApplyDiscountsEntity, (discount) => discount.rule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apply_discount_id' })
  applyDiscountId!: ApplyDiscountsEntity;

  @ManyToOne(() => DiscountCampaignRulesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule!: DiscountCampaignRulesEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
