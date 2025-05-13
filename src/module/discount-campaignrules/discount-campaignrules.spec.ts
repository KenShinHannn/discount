import { Test, TestingModule } from '@nestjs/testing';
import { DiscountCampaignRulesService } from './discount-campaignrules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscountCampaignRulesEntity } from './entities/discount-campaignrules.entity';
import { Repository } from 'typeorm';
import { CreateDiscountCampaignRulesDto } from './dtos/create-discount-campaign-rules.dto';
import { NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
});

describe('DiscountCampaignRulesService', () => {
  let service: DiscountCampaignRulesService;
  let repo: Repository<DiscountCampaignRulesEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountCampaignRulesService,
        {
          provide: getRepositoryToken(DiscountCampaignRulesEntity),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<DiscountCampaignRulesService>(
      DiscountCampaignRulesService,
    );
    repo = module.get<Repository<DiscountCampaignRulesEntity>>(
      getRepositoryToken(DiscountCampaignRulesEntity),
    );
  });

  const dto: CreateDiscountCampaignRulesDto = {
    campaignId: 1,
    protectedTypeId: 2,
    fixedAmount: 100,
    applicableCategory: 'ELECTRONICS',
    pointsCapRatio: 0.5,
    stepEveryX: 1000,
    discountY: 100,
    description: '100 THB off every 1000 THB for electronics',
  };

  const mockRule = {
    id: 1,
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDiscountCampaignRules', () => {
    it('should create and save a discount campaign rule', async () => {
      (repo.create as jest.Mock).mockReturnValue(mockRule);
      (repo.save as jest.Mock).mockResolvedValue(mockRule);

      const result = await service.createDiscountCampaignRules(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockRule);
      expect(result).toEqual(mockRule);
    });
  });

  describe('findOneById', () => {
    it('should return a rule by ID', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockRule);
      const result = await service.findOneById(1);
      expect(result).toEqual(mockRule);
    });

    it('should throw NotFoundException if rule not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.findOneById(0)).rejects.toThrow(
        new NotFoundException('DiscountCampaignRules with id 0 not found'),
      );
    });
  });

  describe('findAllDiscountCampaignRules', () => {
    it('should return paginated rules', async () => {
      const data = [mockRule];
      const total = 1;

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([data, total]),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.findAllDiscountCampaignRules({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual({
        data,
        total,
        page: 1,
        limit: 10,
      });
    });

    it('should throw error if query fails', async () => {
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockRejectedValue(new Error('Query Failed')),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(
        service.findAllDiscountCampaignRules({ page: 1, limit: 10 }),
      ).rejects.toThrow('Failed to retrieve paginated discount campaign rules');
    });
  });

  describe('updateDiscountCampaignRules', () => {
    it('should update and return updated rule', async () => {
      const updatedDto: CreateDiscountCampaignRulesDto = {
        ...dto,
        fixedAmount: 200,
        description: 'Updated rule',
      };
      const updatedEntity = { ...mockRule, ...updatedDto };

      (repo.findOne as jest.Mock).mockResolvedValueOnce(mockRule);
      (repo.update as jest.Mock).mockResolvedValue(undefined);
      (repo.findOne as jest.Mock).mockResolvedValueOnce(updatedEntity);

      const result = await service.updateDiscountCampaignRules(1, updatedDto);
      expect(repo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining(updatedDto),
      );
      expect(result.fixedAmount).toBe(200);
      expect(result.description).toBe('Updated rule');
    });

    it('should throw if rule not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.updateDiscountCampaignRules(0, dto)).rejects.toThrow(
        'DiscountCampaignRules with id 0 not found',
      );
    });
  });

  describe('deleteDiscountCampaignRules', () => {
    it('should delete rule successfully', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockRule); // mock ว่ามี rule นี้อยู่จริง
      (repo.delete as jest.Mock).mockResolvedValue(undefined); // mock delete success

      await expect(
        service.deleteDiscountCampaignRules(1),
      ).resolves.not.toThrow();
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if rule not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined); // mock ว่าไม่เจอ rule

      await expect(service.deleteDiscountCampaignRules(999)).rejects.toThrow(
        new Error('DiscountCampaignRules with id 999 not found'),
      );
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
