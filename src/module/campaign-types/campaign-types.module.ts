import { TypeOrmModule } from "@nestjs/typeorm";
import { CampaignTypesController } from "./campaign-types.controller";
import { CampaignTypesService } from "./campaign-types.service";
import { CampaignTypesEntity } from "./entities/campaign-types.entity";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { CampaignTypesRepository } from "./repositories/campaign-types.repositories";

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignTypesEntity]),
    ConfigModule.forRoot({
      envFilePath: './discount/.env',
    }),
  ],
  controllers: [CampaignTypesController],
  providers: [CampaignTypesService, CampaignTypesRepository],
})
export class CampaginTypesModule {}