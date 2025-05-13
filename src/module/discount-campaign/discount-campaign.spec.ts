import { Test, TestingModule } from '@nestjs/testing';
import { DiscountCampaignService } from './discount-campaign.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscountCampaignEntity } from './entities/discount-campaign.entity';
import { Repository } from 'typeorm';
import { CreateDiscountCampaignDto } from './dtos/create-discount-campaign.dto';
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

describe('DiscountCampaignService', () => {
  let service: DiscountCampaignService;
  let repo: Repository<DiscountCampaignEntity>;

  const mockCampaign = {
    id: 1,
    name: 'Seasonal Discount',
    description: 'Seasonal campaign description',
    categoryId: 1,
    typeId: 1,
    isActive: true,
    startAt: new Date(),
    endAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountCampaignService,
        {
          provide: getRepositoryToken(DiscountCampaignEntity),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<DiscountCampaignService>(DiscountCampaignService);
    repo = module.get<Repository<DiscountCampaignEntity>>(
      getRepositoryToken(DiscountCampaignEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDiscountCampaign', () => {
    it('should create and save discount campaign successfully', async () => {
      const dto: CreateDiscountCampaignDto = {
        name: 'Seasonal Discount',
        description: 'Seasonal campaign description',
        categoryId: 1,
        typeId: 1,
        isActive: true,
        startAt: new Date(),
        endAt: new Date(),
      };

      const savedEntity = {
        ...dto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (repo.create as jest.Mock).mockReturnValue(savedEntity);
      (repo.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await service.createDiscountCampaign(dto);
      expect(result).toEqual(savedEntity);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return discount campaign by id', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockCampaign);

      const result = await service.findOneById(1);
      expect(result).toEqual(mockCampaign);
    });

    it('should throw if discount campaign not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findOneById(999)).rejects.toThrowError(
        'DiscountCampaignEntity with id 999 not found',
      );
    });
  });

  describe('findAllDiscountCampaigns', () => {
    it('should return paginated discount campaigns', async () => {
      const data = [mockCampaign];
      const total = 1;

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([data, total]),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.findAllDiscountCampaigns({
        page: 1,
        limit: 10,
        orderBy: 'name',
        orderDir: 'ASC',
      });

      expect(result.data).toEqual(data);
      expect(result.total).toBe(total);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
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

      (
        repo.createQueryBuilder as jest.Mock
      ).mockReturnValue(mockQueryBuilder);

      await expect(
        service.findAllDiscountCampaigns({
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrowError('Failed to retrieve paginated discount campaign');
    });
  });

  describe('updateDiscountCampaign', () => {
    it('should update and return updated discount campaign', async () => {
      const entity = {
        id: 1,
        name: 'OldCampaign',
        description: 'Old description',
        categoryId: 1,
        typeId: 1,
        isActive: true,
        startAt: new Date(),
        endAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedEntity = {
        id: 1,
        name: 'UpdatedCampaign',
        description: 'Seasonal campaign description',
        categoryId: 1,
        typeId: 1,
        isActive: true,
        startAt: new Date(),
        endAt: new Date(),
        updatedAt: new Date(),
      };

      const dto: CreateDiscountCampaignDto = {
        name: 'UpdatedCampaign',
        description: 'Seasonal campaign description',
        categoryId: 1,
        typeId: 1,
        isActive: true,
        startAt: new Date(),
        endAt: new Date(),
      };

      (repo.findOne as jest.Mock).mockResolvedValue(entity);
      (repo.update as jest.Mock).mockResolvedValue(undefined);
      (repo.findOne as jest.Mock).mockResolvedValue(updatedEntity);

      const result = await service.updateDiscountCampaign(1, dto);

      expect(result.name).toBe('UpdatedCampaign');
      expect(repo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: 'UpdatedCampaign',
          description: 'Seasonal campaign description',
          categoryId: 1,
          typeId: 1,
          isActive: true,
          startAt: expect.any(Date),
          endAt: expect.any(Date),
        }),
      );
    });

    it('should throw if discount campaign not found', async () => {
      const dto: CreateDiscountCampaignDto = {
        name: 'Seasonal Discount',
        description: 'Seasonal campaign description',
        categoryId: 1,
        typeId: 1,
        isActive: true,
        startAt: new Date(),
        endAt: new Date(),
      };

      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(
        service.updateDiscountCampaign(999, dto),
      ).rejects.toThrowError('DiscountCampaignEntity with id 999 not found');
    });
  });

  describe('deleteDiscountCampaign', () => {
    it('should delete discount campaign successfully', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (repo.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteDiscountCampaign(1)).resolves.not.toThrow();
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if discount campaign not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteDiscountCampaign(0)).rejects.toThrowError(
        'DiscountCampaignEntity with id 0 not found',
      );
    });
  });
});
