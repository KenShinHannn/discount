import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountCampaignEntity } from './entities/discount-campaign.entity';
import { Repository } from 'typeorm';
import { CreateDiscountCampaignDto } from './dtos/create-discount-campaign.dto';

@Injectable()
export class DiscountCampaignService {
  constructor(
    @InjectRepository(DiscountCampaignEntity)
    private readonly discountCampaignRepository: Repository<DiscountCampaignEntity>,
  ) {}

  async createDiscountCampaign(
    discountCampaignDto: CreateDiscountCampaignDto,
  ): Promise<DiscountCampaignEntity> {
    const newDiscountCampaign =
      this.discountCampaignRepository.create(discountCampaignDto);
    return await this.discountCampaignRepository.save(newDiscountCampaign);
  }

  async findOneById(id: number): Promise<DiscountCampaignEntity> {
    const entity = await this.discountCampaignRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new Error(`DiscountCampaignEntity with id ${id} not found`);
    }
    return entity;
  }

  async findAllDiscountCampaigns(query: any): Promise<{
    data: DiscountCampaignEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.discountCampaignRepository.createQueryBuilder('discount_campaign');

    try {
    if (query.orderBy && query.orderDir) {
      queryBuilder.orderBy(
        `discount_campaign.${query.orderBy}`,
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
      throw new Error('Failed to retrieve paginated discount campaign');
    }
  }

  async updateDiscountCampaign(
    id: number,
    discountCampaignDto: CreateDiscountCampaignDto,
  ): Promise<DiscountCampaignEntity> {
    const entity = await this.discountCampaignRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new Error(`DiscountCampaignEntity with id ${id} not found`);
    }
    await this.discountCampaignRepository.update(id, discountCampaignDto);
    return this.findOneById(id);
  }

  async deleteDiscountCampaign(id: number): Promise<void> {
    const entity = await this.discountCampaignRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new Error(`DiscountCampaignEntity with id ${id} not found`);
    }
    await this.discountCampaignRepository.delete(id);
  }
}
