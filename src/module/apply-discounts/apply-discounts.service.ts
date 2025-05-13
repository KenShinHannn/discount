import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplyDiscountsEntity } from './entities/apply-discounts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApplyDiscountsDto } from './dtos/create-apply-discounts.dto';
import { GetApplyDiscountRequestDto } from './dtos/get-apply-discount.request.dto';
import { DiscountCampaignService } from '../discount-campaign/discount-campaign.service';
import { CampaignCategoriesService } from '../campaign-categories/campaign-categories.service';
import { DiscountCampaignRulesService } from '../discount-campaignrules/discount-campaignrules.service';
import { CampaignTypesService } from '../campaign-types/campaign-types.service';
import { ApplyDiscountRulesService } from 'src/libs/common/src/module/service/apply-discountsrules.service';

@Injectable()
export class ApplyDiscountsService {
  constructor(
    @InjectRepository(ApplyDiscountsEntity)
    private readonly applyDiscountRepository: Repository<ApplyDiscountsEntity>,
    private readonly discountCampaignService: DiscountCampaignRulesService,
    private readonly discountCampaign: DiscountCampaignService,
    private readonly campaignCategoriesService: CampaignCategoriesService,
    private readonly campaignTypeService: CampaignTypesService,
    private readonly applyDiscountRulesService: ApplyDiscountRulesService,  
  ) {}

  async createApplyDiscount(
    applyDiscountDto: CreateApplyDiscountsDto,
  ): Promise<ApplyDiscountsEntity> {
    const cartItems = applyDiscountDto.cartItems ?? [];
    const originalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let discountedPrice = originalPrice;

    const rules = await Promise.all(
      (applyDiscountDto.ruleId ?? []).map((id) =>
        this.discountCampaignService.findOneById(id),
      ),
    );

    const campaignIds = rules.map((r) => r.campaignId);
    const campaigns = await Promise.all(
      campaignIds.map((id) => this.discountCampaign.findOneById(id)),
    );

    const categories = await Promise.all(
      campaigns.map((c) =>
        this.campaignCategoriesService.findOneById(c.categoryId),
      ),
    );

    const campaignTypes = await Promise.all(
      campaigns.map((c) => this.campaignTypeService.findOneById(c.typeId)),
    );

    const categoryTypePairs = new Map<string, string>();

    for (let i = 0; i < campaigns.length; i++) {
      const category = categories[i].category_name;
      const type = campaignTypes[i].type_name;

      const key = category;
      if (categoryTypePairs.has(key)) {
        const existingType = categoryTypePairs.get(key);
        if (existingType !== type) {
          throw new BadRequestException(
            `You can only apply one type of campaign per category: ${category} (conflict between '${existingType}' and '${type}')`,
          );
        }
      } else {
        categoryTypePairs.set(key, type);
      }
    }

    // Coupon > On Top > Seasonal
    const ordered = ['Coupon', 'On Top', 'Seasonal'];
    for (const order of ordered) {
      const index = categories.findIndex((c) => c.category_name === order);
      if (index === -1) continue;

      const rule = rules[index];
      const categoryName = categories[index].category_name;

      if (categoryName === 'Coupon') {
        if (rule.fixedAmount && rule.fixedAmount > 0) {
          discountedPrice -= rule.fixedAmount;
        } else if (rule.percentage && rule.percentage > 0) {
          discountedPrice *= 1 - rule.percentage / 100;
        }
      } else if (categoryName === 'On Top') {
        const targetCategory = rule.applicableCategory;
        const categoryTotal = cartItems
          .filter((item) => item.category === targetCategory)
          .reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (rule.percentage && rule.percentage > 0) {
          const discountAmount = categoryTotal * (rule.percentage / 100);
          discountedPrice -= discountAmount;
        } else if ((applyDiscountDto.pointsUsed ?? 0) > 0) {
          const maxDiscount = originalPrice * 0.2;
          const pointsDiscount = Math.min(
            applyDiscountDto.pointsUsed ?? 0,
            maxDiscount,
          );
          discountedPrice -= pointsDiscount;
        }
      } else if (categoryName === 'Seasonal') {
        if (
          rule.stepEveryX &&
          rule.discountY &&
          rule.stepEveryX > 0 &&
          rule.discountY > 0
        ) {
          const steps = Math.floor(discountedPrice / rule.stepEveryX);
          discountedPrice -= steps * rule.discountY;
        }
      }
    }

    applyDiscountDto.originalPrice = originalPrice;
    applyDiscountDto.finalPrice = Math.max(
      0,
      Number(discountedPrice.toFixed(1)),
    );
    applyDiscountDto.createdAt = new Date();
    applyDiscountDto.updatedAt = new Date();

    const newApplyDiscount =
      this.applyDiscountRepository.create(applyDiscountDto);
    const savedApplyDiscount = await this.applyDiscountRepository.save(newApplyDiscount);

    await this.applyDiscountRulesService.createApplyDiscountRules(
      savedApplyDiscount.id,  
      applyDiscountDto.ruleId ?? [],  
    );

    return savedApplyDiscount;  
  }


  async findOneById(id: number): Promise<ApplyDiscountsEntity> {
    const apply_discount = await this.applyDiscountRepository.findOne({
      where: { id },
    });
    if (!apply_discount) {
      throw new Error(`ApplyDiscountsEntity with id ${id} not found`);
    }
    return apply_discount;
  }

  async findAllApplyDiscounts(query: GetApplyDiscountRequestDto): Promise<{
    data: ApplyDiscountsEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.applyDiscountRepository.createQueryBuilder('apply_discount');

    if (query.orderBy && query.orderDir) {
      queryBuilder.orderBy(
        `apply_discount.${query.orderBy}`,
        query.orderDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );
    }

    try {
      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve paginated discounts');
    }
  }

  async deleteApplyDiscount(id: number): Promise<void> {
    const apply_discount = await this.applyDiscountRepository.findOne({
      where: { id },
    });
    if (!apply_discount) {
      throw new Error(`ApplyDiscountsEntity with id ${id} not found`);
    }
    await this.applyDiscountRepository.delete(id);
  }
}
