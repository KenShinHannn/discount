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
import { CampaignCategoriesEntity } from './entities/campaign-categories.entity';
import { CampaignCategoriesService } from './campaign-categories.service';
import { GetCampaignCategoriesRequestDto } from './dtos/get-campaign-categories.request';
import { CreateApplyDiscountsDto } from '../apply-discounts/dtos/create-apply-discounts.dto';
import { CreateCampaignCategoriesDto } from './dtos/create-campaign-categories.dto';

@ApiTags('Campaign Categories')
@Controller('campaign-categories')
export class CampaignCategoriesController {
  constructor(
    private readonly campaignCategoriesService: CampaignCategoriesService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all campaign categories' })
  @ApiResponse({ status: 200, description: 'Campaign categories found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAllCampaignCategories(
    @Query() query: GetCampaignCategoriesRequestDto,
  ): Promise<{
    data: CampaignCategoriesEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.campaignCategoriesService.findAllCampaignCategories(
        query,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching campaign categories',
      );
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Find a campaign category by id' })
  @ApiResponse({ status: 200, description: 'Campaign category found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Campaign category not found' })
  async findCampaignCategoryById(
    @Param('id') id: number,
  ): Promise<CampaignCategoriesEntity> {
    try {
      return await this.campaignCategoriesService.findOneById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching the campaign category',
      );
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new campaign category' })
  @ApiBody({ type: CreateCampaignCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Campaign category created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCampaignCategory(
    @Body() campaignCategoryDto: CreateCampaignCategoriesDto,
  ): Promise<CampaignCategoriesEntity> {
    try {
      return await this.campaignCategoriesService.createCampaignCategory(
        campaignCategoryDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while creating the campaign category',
      );
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a campaign category by id' })
  @ApiBody({ type: CreateCampaignCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Campaign category updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Campaign category not found' })
  async updateCampaignCategory(
    @Param('id') id: number,
    @Body() campaignCategoryDto: CampaignCategoriesEntity,
  ): Promise<CampaignCategoriesEntity> {
    try {
      return await this.campaignCategoriesService.updateCampaignCategory(
        id,
        campaignCategoryDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while updating the campaign category',
      );
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a campaign category by id' })
  @ApiResponse({
    status: 200,
    description: 'Campaign category deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Campaign category not found' })
  async deleteCampaignCategory(@Param('id') id: number): Promise<void> {
    try {
      return await this.campaignCategoriesService.deleteCampaignCategory(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while deleting the campaign category',
      );
    }
  }
}
