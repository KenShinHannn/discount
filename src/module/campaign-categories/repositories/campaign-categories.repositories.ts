import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CampaignCategoriesEntity } from '../entities/campaign-categories.entity';

@Injectable()
export class CampaignCategoriesRepository {
  protected readonly logger = new Logger(CampaignCategoriesRepository.name);

  constructor(
    @InjectRepository(CampaignCategoriesEntity)
    private readonly campaignCategoriesRepository: Repository<CampaignCategoriesEntity>,
  ) {}

  async findAllByCondition(
    condition: FindOptionsWhere<CampaignCategoriesEntity>,
  ) {
    return await this.campaignCategoriesRepository.find({ where: condition });
  }

  async findOne(options: FindManyOptions<CampaignCategoriesEntity>) {
    return await this.campaignCategoriesRepository.findOne(options);
  }

  async create(
    campaignCategories: CampaignCategoriesEntity,
  ): Promise<CampaignCategoriesEntity> {
    return await this.campaignCategoriesRepository.save(campaignCategories);
  }

  async update(
    id: number,
    campaignCategories: Partial<CampaignCategoriesEntity>,
  ) {
    await this.campaignCategoriesRepository.update(id, campaignCategories);
  }

  async delete(id: number) {
    await this.campaignCategoriesRepository.delete(id);
  }
}
