import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignCategoriesEntity } from './entities/campaign-categories.entity';
import { Repository } from 'typeorm';
import { GetCampaignCategoriesRequestDto } from './dtos/get-campaign-categories.request';
import { CreateCampaignCategoriesDto } from './dtos/create-campaign-categories.dto';

@Injectable()
export class CampaignCategoriesService {
  constructor(
    @InjectRepository(CampaignCategoriesEntity)
    private readonly campaignCategoriesRepository: Repository<CampaignCategoriesEntity>,
  ) {}

  async createCampaignCategory(
    campaignCategoryDto: CreateCampaignCategoriesDto,
  ): Promise<CampaignCategoriesEntity> {
    const newCampaignCategory = this.campaignCategoriesRepository.create({
      ...campaignCategoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.campaignCategoriesRepository.save(newCampaignCategory);
  }

  async findOneById(id: number): Promise<CampaignCategoriesEntity> {
    const campaign_category = await this.campaignCategoriesRepository.findOne({
      where: { id },
    });
    if (!campaign_category) {
      throw new NotFoundException(
        `Campaign Categories with id ${id} not found`,
      );
    }
    return campaign_category;
  }

  async findAllCampaignCategories(
    query: GetCampaignCategoriesRequestDto,
  ): Promise<{
    data: CampaignCategoriesEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.campaignCategoriesRepository.createQueryBuilder('campaign_category');

    try {
      if (query.orderBy && query.orderDir) {
        queryBuilder.orderBy(
          `campaign_category.${query.orderBy}`,
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
      throw new Error('Failed to retrieve paginated campaign categories');
    }
  }

  async updateCampaignCategory(
    id: number,
    campaignCategoryDto: CreateCampaignCategoriesDto,
  ): Promise<CampaignCategoriesEntity> {
    const campaign_category = await this.campaignCategoriesRepository.findOne({
      where: { id },
    });
    if (!campaign_category) {
      throw new NotFoundException(
        `Campaign Categories with id ${id} not found`,
      );
    }
    await this.campaignCategoriesRepository.update(id, {
      ...campaignCategoryDto,
      updatedAt: new Date(),
    });
    return this.findOneById(id);
  }

  async deleteCampaignCategory(id: number): Promise<void> {
    const campaign_category = await this.campaignCategoriesRepository.findOne({
      where: { id },
    });
    if (!campaign_category) {
      throw new NotFoundException(
        `Campaign Categories with id ${id} not found`,
      );
    }
    await this.campaignCategoriesRepository.delete(id);
  }
}
