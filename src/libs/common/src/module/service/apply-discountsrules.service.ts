import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyDiscountRulesEntity } from '../entity/apply-discountsrules.entity';

@Injectable()
export class ApplyDiscountRulesService {
  constructor(
    @InjectRepository(ApplyDiscountRulesEntity)
    private readonly applyDiscountRulesRepository: Repository<ApplyDiscountRulesEntity>,
  ) {}

  async createApplyDiscountRules(
  applyDiscountId: number,
  ruleIds: number[],
): Promise<ApplyDiscountRulesEntity[]> {
  const applyDiscountRules = ruleIds.map((ruleId) => {
    return this.applyDiscountRulesRepository.create({
      applyDiscountId: { id: applyDiscountId },  
      rule: { id: ruleId },  
    });
  });

  return await this.applyDiscountRulesRepository.save(applyDiscountRules);
}

}
