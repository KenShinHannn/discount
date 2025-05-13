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
import { CampaignTypesService } from './campaign-types.service';
import { CampaignTypesEntity } from './entities/campaign-types.entity';
import { GetCampaignCategoriesRequestDto } from './dtos/get-campaign-types';
import { CreateCampaignTypesDto } from './dtos/create-campaign-types';

@ApiTags('Campagin Types')
@Controller('campaign-types')
export class CampaignTypesController {
  constructor(private readonly campaignTypesService: CampaignTypesService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all campaign types' })
  @ApiResponse({ status: 200, description: 'Campaign types found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAllCampaignTypes(
    @Query() query: GetCampaignCategoriesRequestDto,
  ): Promise<{
    data: CampaignTypesEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.campaignTypesService.findAllCampaignTypes(query);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching campaign types',
      );
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Find a campaign type by id' })
  @ApiResponse({ status: 200, description: 'Campaign type found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Campaign type not found' })
  async findCampaignTypeById(
    @Param('id') id: number,
  ): Promise<CampaignTypesEntity> {
    try {
      return await this.campaignTypesService.findOneById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching the campaign type',
      );
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new campaign type' })
  @ApiBody({ type: CreateCampaignTypesDto })
  @ApiResponse({ status: 201, description: 'Campaign type created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCampaignType(
    @Body() campaignTypeDto: CampaignTypesEntity,
  ): Promise<CampaignTypesEntity> {
    try {
      return await this.campaignTypesService.createCampaignTypes(
        campaignTypeDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while creating the campaign type',
      );
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a campaign type by id' })
  @ApiResponse({ status: 200, description: 'Campaign type updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Campaign type not found' })
  async updateCampaignType(
    @Param('id') id: number,
    @Body() campaignTypeDto: CampaignTypesEntity,
  ): Promise<CampaignTypesEntity> {
    try {
      return await this.campaignTypesService.updateCampaignTypes(
        id,
        campaignTypeDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while updating the campaign type',
      );
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a campaign type by id' })
  @ApiResponse({ status: 200, description: 'Campaign type deleted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Campaign type not found' })
  async deleteCampaignType(@Param('id') id: number): Promise<void> {
    try {
      return await this.campaignTypesService.deleteCampaignTypes(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while deleting the campaign type',
      );
    }
  }
}
