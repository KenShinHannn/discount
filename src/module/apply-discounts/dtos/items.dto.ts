import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class ItemDto {
  @ApiProperty({ example: 'Cloth' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 29900 })
  @IsInt()
  @IsPositive()
  @IsNumber()
  price!: number;

  @ApiProperty({ example: 'Category'})
  @IsString()
  @IsNotEmpty()
  category!: string;
}
