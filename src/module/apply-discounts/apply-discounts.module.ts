import { ConfigModule } from '@nestjs/config';
import { ApplyDiscountsController } from './apply-discounts.controller';
import { ApplyDiscountsEntity } from './entities/apply-discounts.entity';
import { ApplyDiscountsService } from './apply-discounts.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyDiscountsRepository } from './repositories/apply-discounts.repositories';
import { CampaignCategoriesService } from '../campaign-categories/campaign-categories.service';
import { DiscountCampaignService } from '../discount-campaign/discount-campaign.service';
import { DiscountCampaignRulesService } from '../discount-campaignrules/discount-campaignrules.service';
import { DiscountCampaignRulesRepository } from '../discount-campaignrules/repositories/discount-campaignrules.repositories';
import { DiscountCampaignRepository } from '../discount-campaign/repositories/discount-campaign.repositories';
import { CampaignCategoriesRepository } from '../campaign-categories/repositories/campaign-categories.repositories';
import { DiscountCampaignRulesEntity } from '../discount-campaignrules/entities/discount-campaignrules.entity';
import { DiscountCampaignEntity } from '../discount-campaign/entities/discount-campaign.entity';
import { CampaignCategoriesEntity } from '../campaign-categories/entities/campaign-categories.entity';
import { CampaignTypesEntity } from '../campaign-types/entities/campaign-types.entity';
import { CampaignTypesRepository } from '../campaign-types/repositories/campaign-types.repositories';
import { CampaignTypesService } from '../campaign-types/campaign-types.service';
import { ApplyDiscountRulesService } from 'src/libs/common/src/module/service/apply-discountsrules.service';
import { ApplyDiscountRulesEntity } from 'src/libs/common/src/module/entity/apply-discountsrules.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplyDiscountsEntity]),
    TypeOrmModule.forFeature([DiscountCampaignRulesEntity]),
    TypeOrmModule.forFeature([DiscountCampaignEntity]),
    TypeOrmModule.forFeature([CampaignCategoriesEntity]),
    TypeOrmModule.forFeature([CampaignTypesEntity]),
    TypeOrmModule.forFeature([ApplyDiscountRulesEntity]),
    ConfigModule.forRoot({
      envFilePath: './discount/.env',
    }),
  ],
  controllers: [ApplyDiscountsController],
  providers: [
    ApplyDiscountsService,
    DiscountCampaignRulesService,
    DiscountCampaignService,
    CampaignCategoriesService,
    CampaignTypesService,
    ApplyDiscountRulesService,
    ApplyDiscountsRepository,
    DiscountCampaignRulesRepository,
    DiscountCampaignRepository,
    CampaignCategoriesRepository,
    CampaignTypesRepository,
  ],
})
export class ApplyDiscountsModule {}
