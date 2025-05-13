import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CampaignTypesEntity } from '../entities/campaign-types.entity';

@Injectable()
export class CampaignTypesRepository {
  protected readonly logger = new Logger(CampaignTypesRepository.name);

  constructor(
    @InjectRepository(CampaignTypesEntity)
    private readonly campaignCategoriesRepository: Repository<CampaignTypesEntity>,
  ) {}

  async findAllByCondition(condition: FindOptionsWhere<CampaignTypesEntity>) {
    return await this.campaignCategoriesRepository.find({ where: condition });
  }
  async findOne(options: FindManyOptions<CampaignTypesEntity>) {
    return await this.campaignCategoriesRepository.findOne(options);
  }
  async create(
    campaignCategories: CampaignTypesEntity,
  ): Promise<CampaignTypesEntity> {
    return await this.campaignCategoriesRepository.save(campaignCategories);
  }

  async update(id: number, campaignCategories: Partial<CampaignTypesEntity>) {
    await this.campaignCategoriesRepository.update(id, campaignCategories);
  }

  async delete(id: number) {
    await this.campaignCategoriesRepository.delete(id);
  }
}
