import { Test, TestingModule } from '@nestjs/testing';
import { CampaignTypesService } from './campaign-types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CampaignTypesEntity } from './entities/campaign-types.entity';
import { Repository } from 'typeorm';
import { CreateCampaignTypesDto } from './dtos/create-campaign-types';
import { GetCampaignCategoriesRequestDto } from './dtos/get-campaign-types';
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

describe('CampaignTypesService', () => {
  let service: CampaignTypesService;
  let repo: Repository<CampaignTypesEntity>;

  const mockType = {
    id: 1,
    type_name: 'FixedAmount',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignTypesService,
        {
          provide: getRepositoryToken(CampaignTypesEntity),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CampaignTypesService>(CampaignTypesService);
    repo = module.get<Repository<CampaignTypesEntity>>(
      getRepositoryToken(CampaignTypesEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCampaignTypes', () => {
    it('should create and save campaign type successfully', async () => {
      const dto: CreateCampaignTypesDto = { type_name: 'FixedAmount' };

      const savedEntity = {
        ...dto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (repo.create as jest.Mock).mockReturnValue(savedEntity);
      (repo.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await service.createCampaignTypes(dto);
      expect(result).toEqual(savedEntity);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return campaign type by id', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockType);

      const result = await service.findOneById(1);
      expect(result).toEqual(mockType);
    });

    it('should throw if campaign type not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findOneById(999)).rejects.toThrowError(
        'CampaignTypesEntity with id 999 not found',
      );
    });
  });

  describe('findAllCampaignTypes', () => {
    it('should return paginated campaign types', async () => {
      const data = [mockType];
      const total = 1;

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([data, total]),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await service.findAllCampaignTypes({
        page: 1,
        limit: 10,
        orderBy: 'type_name',
        orderDir: 'ASC',
      } as GetCampaignCategoriesRequestDto);

      expect(result.data).toEqual(data);
      expect(result.total).toBe(total);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should throw if query fails', async () => {
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockRejectedValue(new Error('DB Error')),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(
        service.findAllCampaignTypes({
          page: 1,
          limit: 10,
        } as GetCampaignCategoriesRequestDto),
      ).rejects.toThrowError(
        'Failed to retrieve paginated campaign categories',
      );
    });
  });

  describe('updateCampaignTypes', () => {
    it('should update and return updated campaign type', async () => {
      const entity = {
        id: 1,
        type_name: 'OldType',
        updatedAt: new Date(),
      } as CreateCampaignTypesDto;
      const updatedEntity = {
        id: 1,
        type_name: 'UpdatedType',
        updatedAt: new Date(),
      } as CreateCampaignTypesDto;
      const dto = { type_name: 'UpdatedType' };

      (repo.findOne as jest.Mock).mockResolvedValue(entity);
      (repo.update as jest.Mock).mockResolvedValue(undefined);
      (repo.findOne as jest.Mock).mockResolvedValue(updatedEntity);

      const result = await service.updateCampaignTypes(1, dto);

      expect(result.type_name).toBe('UpdatedType');
      expect(repo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ type_name: 'UpdatedType' }),
      );
    });

    it('should throw if campaign type not found', async () => {
      const dto: CreateCampaignTypesDto = {
        type_name: 'NewType',
      };

      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.updateCampaignTypes(999, dto)).rejects.toThrowError(
        'Campaign Type with id 999 not found',
      );
    });
  });

  describe('deleteCampaignTypes', () => {
    it('should delete campaign type successfully', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ id: 1 }); 
      (repo.delete as jest.Mock).mockResolvedValue(undefined); 

      await expect(service.deleteCampaignTypes(1)).resolves.not.toThrow();
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } }); 
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if type not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteCampaignTypes(0)).rejects.toThrowError(
        'Campaign Type with id 0 not found',
      );
    });
  });
});
