import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCampaignTypesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  type_name!: string;

}
