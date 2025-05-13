import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscountCampaignRulesService } from './discount-campaignrules.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DiscountCampaignRulesEntity } from './entities/discount-campaignrules.entity';
import { CreateDiscountCampaignRulesDto } from './dtos/create-discount-campaign-rules.dto';
import { GetDisountCampaginRulesRequest } from './dtos/get-discount-campaignrules.request';

@ApiTags('Discount Campaign Rules')
@Controller('discount-campaign-rules')
export class DiscountCampaignRulesController {
  constructor(
    private readonly discountCampaignRulesService: DiscountCampaignRulesService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all discount campaign rules' })
  @ApiResponse({ status: 200, description: 'Discount campaign rules found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAllDiscountCampaignRules(
    @Query() query: GetDisountCampaginRulesRequest,
  ): Promise<{
    data: DiscountCampaignRulesEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.discountCampaignRulesService.findAllDiscountCampaignRules(
        query,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching discount campaign rules',
      );
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Find a discount campaign rule by id' })
  @ApiResponse({ status: 200, description: 'Discount campaign rule found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Discount campaign rule not found' })
  async findDiscountCampaignRuleById(
    @Param('id') id: number,
  ): Promise<DiscountCampaignRulesEntity> {
    try {
      return await this.discountCampaignRulesService.findOneById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching the discount campaign rule',
      );
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new discount campaign rule' })
  @ApiBody({ type: CreateDiscountCampaignRulesDto })
  @ApiResponse({ status: 201, description: 'Discount campaign rule created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createDiscountCampaignRule(
    @Body() discountCampaignRulesDto: CreateDiscountCampaignRulesDto,
  ): Promise<DiscountCampaignRulesEntity> {
    try {
      return await this.discountCampaignRulesService.createDiscountCampaignRules(
        discountCampaignRulesDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while creating the discount campaign rule',
      );
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a discount campaign rule' })
  @ApiBody({ type: CreateDiscountCampaignRulesDto })
  @ApiResponse({ status: 200, description: 'Discount campaign rule updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateDiscountCampaignRule(
    @Param('id') id: number,
    @Body() discountCampaignRulesDto: CreateDiscountCampaignRulesDto,
  ): Promise<DiscountCampaignRulesEntity> {
    try {
      return await this.discountCampaignRulesService.updateDiscountCampaignRules(
        id,
        discountCampaignRulesDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while updating the discount campaign rule',
      );
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a discount campaign rule' })
  @ApiResponse({ status: 200, description: 'Discount campaign rule deleted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteDiscountCampaignRule(@Param('id') id: number): Promise<void> {
    try {
      return await this.discountCampaignRulesService.deleteDiscountCampaignRules(
        id,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while deleting the discount campaign rule',
      );
    }
  }
}
