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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscountCampaignEntity } from './entities/discount-campaign.entity';
import { CreateDiscountCampaignDto } from './dtos/create-discount-campaign.dto';
import { GetDiscountCampaignRequest } from './dtos/get-discount-campaign.request';
import { DiscountCampaignService } from './discount-campaign.service';

@ApiTags('Discount Campaigns')
@Controller('discount-campaigns')
export class DiscountCampaignController {
  constructor(
    private readonly discountCampaignService: DiscountCampaignService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all discount campaigns' })
  @ApiResponse({ status: 200, description: 'DiscountCampaigns found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAllDiscountCampaigns(
    @Query() query: GetDiscountCampaignRequest,
  ): Promise<{
    data: DiscountCampaignEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.discountCampaignService.findAllDiscountCampaigns(query);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching discount campaigns',
      );
    }
  }
  @Get('detail/:id')
  @ApiOperation({ summary: 'Find a discount campaign by id' })
  @ApiResponse({ status: 200, description: 'DiscountCampaigns found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'DiscountCampaigns not found' })
  async findDiscountCampaignById(
    @Param('id') id: number,
  ): Promise<DiscountCampaignEntity> {
    try {
      return await this.discountCampaignService.findOneById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching the discount campaign',
      );
    }
  }
  @Post('create')
  @ApiOperation({ summary: 'Create a new discount campaign' })
  @ApiBody({ type: CreateDiscountCampaignDto })
  @ApiResponse({
    status: 200,
    description: 'DiscountCampaigns created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createDiscountCampaign(
    @Body() discountCampaignDto: CreateDiscountCampaignDto,
  ): Promise<DiscountCampaignEntity> {
    try {
      return await this.discountCampaignService.createDiscountCampaign(
        discountCampaignDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while creating the discount campaign',
      );
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a discount campaign' })
  @ApiBody({ type: CreateDiscountCampaignDto })
  @ApiResponse({
    status: 200,
    description: 'DiscountCampaigns updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'DiscountCampaigns not found' })
  async updateDiscountCampaign(
    @Param('id') id: number,
    @Body() discountCampaignDto: CreateDiscountCampaignDto,
  ): Promise<DiscountCampaignEntity> {
    try {
      return await this.discountCampaignService.updateDiscountCampaign(
        id,
        discountCampaignDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while updating the discount campaign',
      );
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a discount campaign' })
  @ApiResponse({
    status: 200,
    description: 'DiscountCampaigns deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'DiscountCampaigns not found' })
  async deleteDiscountCampaign(@Param('id') id: number): Promise<void> {
    try {
      return await this.discountCampaignService.deleteDiscountCampaign(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while deleting the discount campaign',
      );
    }
  }
}
