import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @Transform(({ value }) => Number(value))
  limit?: number;

  @ApiPropertyOptional({ default: 'id' })
  orderBy?: string;

  @ApiPropertyOptional({
    enum: Object.values(OrderEnum),
    default: OrderEnum.ASC,
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  orderDir?: OrderEnum;
}
