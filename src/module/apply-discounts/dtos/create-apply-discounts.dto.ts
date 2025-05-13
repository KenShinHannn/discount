import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ItemDto } from './items.dto';

export class CreateApplyDiscountsDto {
  @ApiPropertyOptional({ type: [Number]})
  @IsOptional()
  @IsArray()
  ruleId?: number[];

  @ApiPropertyOptional({ type: () => [ItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  cartItems?: ItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  pointsUsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  originalPrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  finalPrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  createdAt!: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  updatedAt!: Date;
}
