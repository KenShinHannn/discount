import { ConfigModule } from "@nestjs/config";
import { DiscountCampaignEntity } from "../discount-campaign/entities/discount-campaign.entity";
import { DiscountCampaignRulesController } from "./discount-campaignrules.controller";
import { DiscountCampaignRulesService } from "./discount-campaignrules.service";
import { DiscountCampaignRulesEntity } from "./entities/discount-campaignrules.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { DiscountCampaignRulesRepository } from "./repositories/discount-campaignrules.repositories";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountCampaignRulesEntity]),
    ConfigModule.forRoot({
      envFilePath: './discount/.env',
    }),
  ],
  controllers: [DiscountCampaignRulesController],
  providers: [DiscountCampaignRulesService, DiscountCampaignRulesRepository],
})
export class DiscountCampaginRulesModule {}