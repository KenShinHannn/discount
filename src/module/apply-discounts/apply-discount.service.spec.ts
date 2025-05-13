import { Test, TestingModule } from '@nestjs/testing';
import { ApplyDiscountsService } from './apply-discounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplyDiscountsEntity } from './entities/apply-discounts.entity';
import { Repository } from 'typeorm';
import { DiscountCampaignRulesService } from '../discount-campaignrules/discount-campaignrules.service';
import { DiscountCampaignService } from '../discount-campaign/discount-campaign.service';
import { CampaignCategoriesService } from '../campaign-categories/campaign-categories.service';
import { CampaignTypesService } from '../campaign-types/campaign-types.service';
import { CreateApplyDiscountsDto } from './dtos/create-apply-discounts.dto';
import { ApplyDiscountRulesService } from 'src/libs/common/src/module/service/apply-discountsrules.service';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
});

describe('ApplyDiscountsService', () => {
  let service: ApplyDiscountsService;
  let repo: Repository<ApplyDiscountsEntity>;

  const mockRule = {
    id: 1,
    fixedAmount: 10,
    percentage: null,
    stepEveryX: null,
    discountY: null,
    applicableCategory: 'Electronics',
    campaignId: 1,
  };

  const mockCampaign = {
    id: 1,
    categoryId: 1,
    typeId: 1,
  };

  const mockCategory = {
    id: 1,
    category_name: 'Coupon',
  };

  const mockType = {
    id: 1,
    typeName: 'FixedAmount',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplyDiscountsService,
        {
          provide: getRepositoryToken(ApplyDiscountsEntity),
          useFactory: mockRepo,
        },
        {
          provide: DiscountCampaignRulesService,
          useValue: { findOneById: jest.fn().mockResolvedValue(mockRule) },
        },
        {
          provide: DiscountCampaignService,
          useValue: { findOneById: jest.fn().mockResolvedValue(mockCampaign) },
        },
        {
          provide: CampaignCategoriesService,
          useValue: { findOneById: jest.fn().mockResolvedValue(mockCategory) },
        },
        {
          provide: CampaignTypesService,
          useValue: { findOneById: jest.fn().mockResolvedValue(mockType) },
        },
        {
          provide: ApplyDiscountRulesService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue(mockType),
            createApplyDiscountRules: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<ApplyDiscountsService>(ApplyDiscountsService);
    repo = module.get<Repository<ApplyDiscountsEntity>>(
      getRepositoryToken(ApplyDiscountsEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApplyDiscount', () => {
    it('should create and save apply discount successfully', async () => {
      const dto: CreateApplyDiscountsDto = {
        ruleId: [1],
        cartItems: [
          { name: 'Phone', category: 'Electronics', price: 100, quantity: 1 },
        ],
        pointsUsed: 0,
        originalPrice: 0,
        finalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const savedEntity = { ...dto, id: 1 };

      (repo.create as jest.Mock).mockReturnValue(savedEntity);
      (repo.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await service.createApplyDiscount(dto);
      expect(result).toEqual(savedEntity);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return apply discount by id', async () => {
      const entity = { id: 1 } as ApplyDiscountsEntity;
      (repo.findOne as jest.Mock).mockResolvedValue(entity);

      const result = await service.findOneById(1);
      expect(result).toEqual(entity);
    });

    it('should throw error if not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.findOneById(999)).rejects.toThrowError(
        'ApplyDiscountsEntity with id 999 not found',
      );
    });
  });

  describe('findAllApplyDiscounts', () => {
    it('should return paginated discounts', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      const total = 2;

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([data, total]),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.findAllApplyDiscounts({ page: 1, limit: 2 });

      expect(result.data).toEqual(data);
      expect(result.total).toBe(total);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should throw error if query fails', async () => {
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockRejectedValue(new Error('Database error')),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(
        service.findAllApplyDiscounts({ page: 1, limit: 2 }),
      ).rejects.toThrowError('Failed to retrieve paginated discounts');
    });
  });

  describe('deleteApplyDiscount', () => {
    it('should delete entity if exists', async () => {
      const entity = { id: 1 } as ApplyDiscountsEntity;
      (repo.findOne as jest.Mock).mockResolvedValue(entity);
      (repo.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteApplyDiscount(1)).resolves.not.toThrow();
    });

    it('should throw error if entity not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.deleteApplyDiscount(0)).rejects.toThrowError(
        'ApplyDiscountsEntity with id 0 not found',
      );
    });
  });
});
