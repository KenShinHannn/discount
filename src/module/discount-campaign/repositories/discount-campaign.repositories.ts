import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { DiscountCampaignEntity } from '../entities/discount-campaign.entity';

@Injectable()
export class DiscountCampaignRepository {
  protected readonly logger = new Logger(DiscountCampaignRepository.name);

  constructor(
    @InjectRepository(DiscountCampaignEntity)
    private readonly discountCampaignRepository: Repository<DiscountCampaignEntity>,
  ) {}

  async findAllByCondition(
    condition: FindOptionsWhere<DiscountCampaignEntity>,
  ) {
    return await this.discountCampaignRepository.find({ where: condition });
  }

  async findOne(options: FindManyOptions<DiscountCampaignEntity>) {
    return await this.discountCampaignRepository.findOne(options);
  }

  async create(
    discountCampaign: DiscountCampaignEntity,
  ): Promise<DiscountCampaignEntity> {
    return await this.discountCampaignRepository.save(discountCampaign);
  }

  async update(id: number, discountCampaign: Partial<DiscountCampaignEntity>) {
    await this.discountCampaignRepository.update(id, discountCampaign);
  }

  async delete(id: number) {
    await this.discountCampaignRepository.delete(id);
  }
}
