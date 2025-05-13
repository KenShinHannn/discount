import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCampaignCategoriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  category_name!: string;

}
