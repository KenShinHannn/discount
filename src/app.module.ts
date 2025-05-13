import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplyDiscountsModule } from './module/apply-discounts/apply-discounts.module';
import { CampaignCategoriesModule } from './module/campaign-categories/campaign-categories.module';
import { CampaginTypesModule } from './module/campaign-types/campaign-types.module';
import { DiscountCampaignModule } from './module/discount-campaign/discount-campaign.module';
import { DiscountCampaginRulesModule } from './module/discount-campaignrules/discount-campaignrules.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ApplyDiscountsModule,
    CampaignCategoriesModule,
    CampaginTypesModule,
    DiscountCampaignModule,
    DiscountCampaginRulesModule,
    ConfigModule.forRoot({
      envFilePath: '../discount/.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
          console.log('✅ DB_HOST from env:', configService.get('DB_HOST')); 

        return {
          type: 'mysql',
          synchronize: true,
          autoLoadEntities: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
