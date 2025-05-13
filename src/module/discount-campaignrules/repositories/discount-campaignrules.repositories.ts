import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { DiscountCampaignRulesEntity } from "../entities/discount-campaignrules.entity";

@Injectable()
export class DiscountCampaignRulesRepository {
    protected readonly logger = new Logger(DiscountCampaignRulesRepository.name);

    constructor(
        @InjectRepository(DiscountCampaignRulesEntity)
        private readonly DiscountCampaignRulesRepository: Repository<DiscountCampaignRulesEntity>,
    ) {}

  async findAllByCondition(condition: FindOptionsWhere<DiscountCampaignRulesEntity>) {
        return await this.DiscountCampaignRulesRepository.find({ where: condition });
    }

    async findOne(options: FindManyOptions<DiscountCampaignRulesEntity>) {
        return await this.DiscountCampaignRulesRepository.findOne(options);
    }

    async create(discountCampaignRules: DiscountCampaignRulesEntity): Promise<DiscountCampaignRulesEntity> {
        return await this.DiscountCampaignRulesRepository.save(discountCampaignRules);
    }

    async update(id: number, discountCampaignRules: Partial<DiscountCampaignRulesEntity>) {
        await this.DiscountCampaignRulesRepository.update(id, discountCampaignRules);
    }

    async delete(id: number) {
        await this.DiscountCampaignRulesRepository.delete(id);
    }
}