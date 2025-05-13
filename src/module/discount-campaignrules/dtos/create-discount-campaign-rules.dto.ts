import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateDiscountCampaignRulesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    campaignId!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    protectedTypeId!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    fixedAmount!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    applicableCategory!: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    pointsCapRatio!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    stepEveryX!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    discountY!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    description!: string;
}