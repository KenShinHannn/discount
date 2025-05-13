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
import { ApplyDiscountsService } from './apply-discounts.service';
import { GetApplyDiscountRequestDto } from './dtos/get-apply-discount.request.dto';
import { ApplyDiscountsEntity } from './entities/apply-discounts.entity';
import { CreateApplyDiscountsDto } from './dtos/create-apply-discounts.dto';

@ApiTags('Apply-Discounts')
@Controller('discounts')
export class ApplyDiscountsController {
  constructor(private readonly applyDiscountsService: ApplyDiscountsService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({ status: 200, description: 'ApplyDiscounts found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async GetAllApplyDiscounts(
    @Query() query: GetApplyDiscountRequestDto,
  ): Promise<{
    data: ApplyDiscountsEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.applyDiscountsService.findAllApplyDiscounts(query);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching discounts',
      );
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Find an apply discounts by id' })
  @ApiResponse({ status: 200, description: 'ApplyDiscounts found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'ApplyDiscounts not found' })
  async findApplyDiscountById(
    @Param('id') id: number,
  ): Promise<ApplyDiscountsEntity> {
    try {
      return await this.applyDiscountsService.findOneById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while fetching the discount',
      );
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiBody({ type: CreateApplyDiscountsDto })
  @ApiResponse({
    status: 200,
    description: 'ApplyDiscounts create successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createApplyDiscount(
    @Body() applyDiscountDto: CreateApplyDiscountsDto,
  ): Promise<ApplyDiscountsEntity> {
    try {
      return await this.applyDiscountsService.createApplyDiscount(
        applyDiscountDto,
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while creating the discount',
      );
    }
  }

  // @Put('update/:id')
  // @ApiOperation({ summary: 'Update an apply discounts by id' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'ApplyDiscounts updated successfully',
  // })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // @ApiResponse({ status: 404, description: 'ApplyDiscounts not found' })
  // async updateApplyDiscount(
  //   @Param('id') id: number,
  //   @Body() applyDiscountDto: Partial<CreateApplyDiscountsDto>,
  // ): Promise<ApplyDiscountsEntity> {
  //   try {
  //     return await this.applyDiscountsService.updateApplyDiscount(
  //       id,
  //       applyDiscountDto,
  //     );
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new BadRequestException(e.message);
  //     }
  //     throw new BadRequestException(
  //       'An error occurred while updating the discount',
  //     );
  //   }
  // }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete an apply discounts by id' })
  @ApiResponse({
    status: 200,
    description: 'ApplyDiscounts deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'ApplyDiscounts not found' })
  async deleteApplyDiscount(@Param('id') id: number): Promise<void> {
    try {
      return await this.applyDiscountsService.deleteApplyDiscount(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException(
        'An error occurred while deleting the discount',
      );
    }
  }
}
