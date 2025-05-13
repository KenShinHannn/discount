import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscountCampaignController } from "./discount-campaign.controller";
import { DiscountCampaignEntity } from "./entities/discount-campaign.entity";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { DiscountCampaignRepository } from "./repositories/discount-campaign.repositories";
import { DiscountCampaignService } from "./discount-campaign.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountCampaignEntity]),
    ConfigModule.forRoot({
      envFilePath: './discount/.env',
    }),
  ],
  controllers: [DiscountCampaignController],
  providers: [DiscountCampaignService, DiscountCampaignRepository],
})
export class DiscountCampaignModule {}