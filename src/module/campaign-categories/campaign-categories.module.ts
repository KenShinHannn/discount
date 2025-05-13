import { TypeOrmModule } from "@nestjs/typeorm";
import { CampaignCategoriesController } from "./campaign-categories.controller";
import { CampaignCategoriesService } from "./campaign-categories.service";
import { CampaignCategoriesEntity } from "./entities/campaign-categories.entity";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { CampaignCategoriesRepository } from "./repositories/campaign-categories.repositories";

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignCategoriesEntity]),
    ConfigModule.forRoot({
      envFilePath: './discount/.env',
    }),
  ],
  controllers: [CampaignCategoriesController],
  providers: [CampaignCategoriesService, CampaignCategoriesRepository],
})
export class CampaignCategoriesModule {}