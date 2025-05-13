import { Test, TestingModule } from '@nestjs/testing';
import { CampaignCategoriesService } from './campaign-categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CampaignCategoriesEntity } from './entities/campaign-categories.entity';
import { Repository } from 'typeorm';
import { CreateCampaignCategoriesDto } from './dtos/create-campaign-categories.dto';
import { GetCampaignCategoriesRequestDto } from './dtos/get-campaign-categories.request';
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

describe('CampaignCategoriesService', () => {
  let service: CampaignCategoriesService;
  let repo: Repository<CampaignCategoriesEntity>;

  const mockCategory = {
    id: 1,
    category_name: 'Electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignCategoriesService,
        {
          provide: getRepositoryToken(CampaignCategoriesEntity),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CampaignCategoriesService>(CampaignCategoriesService);
    repo = module.get<Repository<CampaignCategoriesEntity>>(
      getRepositoryToken(CampaignCategoriesEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCampaignCategory', () => {
    it('should create and save a campaign category successfully', async () => {
      const dto: CreateCampaignCategoriesDto = {
        category_name: 'Electronics',
      };

      const savedEntity = {
        ...dto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (repo.create as jest.Mock).mockReturnValue(savedEntity);
      (repo.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await service.createCampaignCategory(dto);
      expect(result).toEqual(savedEntity);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a campaign category by id', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.findOneById(1);
      expect(result).toEqual(mockCategory);
    });

    it('should throw error if category not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findOneById(0)).rejects.toThrowError(
        'Campaign Categories with id 0 not found',
      );
    });
  });

  describe('findAllCampaignCategories', () => {
    it('should return paginated campaign categories', async () => {
      const data = [mockCategory];
      const total = 1;

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([data, total]),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.findAllCampaignCategories({
        page: 1,
        limit: 10,
      } as GetCampaignCategoriesRequestDto);

      expect(result.data).toEqual(data);
      expect(result.total).toBe(total);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
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
        service.findAllCampaignCategories({
          page: 1,
          limit: 10,
        } as GetCampaignCategoriesRequestDto),
      ).rejects.toThrowError(
        'Failed to retrieve paginated campaign categories',
      );
    });
  });

  describe('updateCampaignCategory', () => {
    it('should update and return updated campaign category', async () => {
      const dto: CreateCampaignCategoriesDto = {
        category_name: 'Updated Category',
      };

      const existingCategory = { id: 1, category_name: 'Electronics' };
      const updatedCategory = { id: 1, category_name: 'Updated Category' };

      (repo.findOne as jest.Mock).mockResolvedValueOnce(existingCategory);
      (repo.findOne as jest.Mock).mockResolvedValueOnce(updatedCategory);

      (repo.update as jest.Mock).mockResolvedValue(undefined); // update usually doesn't return updated data

      const result = await service.updateCampaignCategory(1, dto);
      expect(result.category_name).toBe('Updated Category');
      expect(repo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ category_name: 'Updated Category' }),
      );
    });

    it('should throw error if category not found', async () => {
      const dto: CreateCampaignCategoriesDto = {
        category_name: 'Updated Category',
      };

      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(
        service.updateCampaignCategory(0, dto),
      ).rejects.toThrowError('Campaign Categories with id 0 not found');
    });
  });

  describe('deleteCampaignCategory', () => {
    it('should delete category if it exists', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockCategory);
      (repo.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteCampaignCategory(1)).resolves.not.toThrow();
    });

    it('should throw error if category not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteCampaignCategory(0)).rejects.toThrowError(
        'Campaign Categories with id 0 not found',
      );
    });
  });
});
