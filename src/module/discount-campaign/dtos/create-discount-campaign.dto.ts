import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateDiscountCampaignDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    name!: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    description!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    categoryId!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    typeId!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    isActive!: boolean;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsDate()
    startAt!: Date;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsDate()
    endAt!: Date;

}