import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignTypesEntity } from './entities/campaign-types.entity';
import { GetCampaignCategoriesRequestDto } from './dtos/get-campaign-types';
import { CreateCampaignTypesDto } from './dtos/create-campaign-types';

@Injectable()
export class CampaignTypesService {
  constructor(
    @InjectRepository(CampaignTypesEntity)
    private readonly campaignTypesRepository: Repository<CampaignTypesEntity>,
  ) {}

  async createCampaignTypes(
    CampaignTypesEntity: CreateCampaignTypesDto,
  ): Promise<CampaignTypesEntity> {
    const newCampaignCategory = this.campaignTypesRepository.create({
      ...CampaignTypesEntity,

      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.campaignTypesRepository.save(newCampaignCategory);
  }

  async findOneById(id: number): Promise<CampaignTypesEntity> {
    const campaign_type = await this.campaignTypesRepository.findOne({
      where: { id },
    });
    if (!campaign_type) {
      throw new NotFoundException(
        `CampaignTypesEntity with id ${id} not found`,
      );
    }
    return campaign_type;
  }

  async findAllCampaignTypes(query: GetCampaignCategoriesRequestDto): Promise<{
    data: CampaignTypesEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.campaignTypesRepository.createQueryBuilder('campaign_type');

    try {
      if (query.orderBy && query.orderDir) {
        queryBuilder.orderBy(
          `campaign_type.${query.orderBy}`,
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

  async updateCampaignTypes(
    id: number,
    campaignCategoryDto: CreateCampaignTypesDto,
  ): Promise<CampaignTypesEntity> {
    const campaign_type = await this.campaignTypesRepository.findOne({
      where: { id },
    });
    if (!campaign_type) {
      throw new NotFoundException(
        `Campaign Type with id ${id} not found`,
      );
    }
    await this.campaignTypesRepository.update(id, {
      ...campaignCategoryDto,
      updatedAt: new Date(),
    });
    return this.findOneById(id);
  }

  async deleteCampaignTypes(id: number): Promise<void> {
    const campaign_type = await this.campaignTypesRepository.findOne({
      where: { id },
    });
    if (!campaign_type) {
      throw new NotFoundException(
        `Campaign Type with id ${id} not found`,
      );
    }
    await this.campaignTypesRepository.delete(id);
  }
}
