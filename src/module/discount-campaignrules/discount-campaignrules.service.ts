import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountCampaignRulesEntity } from './entities/discount-campaignrules.entity';
import { CreateDiscountCampaignRulesDto } from './dtos/create-discount-campaign-rules.dto';
import { GetDisountCampaginRulesRequest } from './dtos/get-discount-campaignrules.request';

@Injectable()
export class DiscountCampaignRulesService {
  constructor(
    @InjectRepository(DiscountCampaignRulesEntity)
    private readonly discountCampaignRulesRepository: Repository<DiscountCampaignRulesEntity>,
  ) {}

  async createDiscountCampaignRules(
    discountCampaignRulesDto: CreateDiscountCampaignRulesDto,
  ): Promise<DiscountCampaignRulesEntity> {
    const newDiscountCampaignRules =
      this.discountCampaignRulesRepository.create(discountCampaignRulesDto);
    return await this.discountCampaignRulesRepository.save(
      newDiscountCampaignRules,
    );
  }

  async findOneById(id: number): Promise<DiscountCampaignRulesEntity> {
    const discount_campaign_rules =
      await this.discountCampaignRulesRepository.findOne({
        where: { id },
      });
    if (!discount_campaign_rules) {
      throw new Error(`DiscountCampaignRules with id ${id} not found`);
    }
    return discount_campaign_rules;
  }

  async findAllDiscountCampaignRules(query: GetDisountCampaginRulesRequest): Promise<{
    data: DiscountCampaignRulesEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.discountCampaignRulesRepository.createQueryBuilder(
        'discount_campaign_rules',
      );

    try {
      if (query.orderBy && query.orderDir) {
        queryBuilder.orderBy(
          `discount_campaign_rules.${query.orderBy}`,
          query.orderDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        );
      }

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error('Failed to retrieve paginated discount campaign rules');
    }
  }

  async updateDiscountCampaignRules(
    id: number,
    discountCampaignRulesDto: CreateDiscountCampaignRulesDto,
  ): Promise<DiscountCampaignRulesEntity> {
    const discount_campaign_rules =
      await this.discountCampaignRulesRepository.findOne({
        where: { id },
      });
    if (!discount_campaign_rules) {
      throw new Error(`DiscountCampaignRules with id ${id} not found`);
    }
    await this.discountCampaignRulesRepository.update(
      id,
      discountCampaignRulesDto,
    );

    return this.findOneById(id);
  }

  async deleteDiscountCampaignRules(id: number) {
    const discount_campaign_rules =
      await this.discountCampaignRulesRepository.findOne({
        where: { id },
      });
    if (!discount_campaign_rules) {
      throw new Error(`DiscountCampaignRules with id ${id} not found`);
    }
    await this.discountCampaignRulesRepository.delete(id);
  }
}
