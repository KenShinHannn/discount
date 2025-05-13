import { Injectable, Logger } from '@nestjs/common';
import { ApplyDiscountsEntity } from '../entities/apply-discounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ApplyDiscountsRepository {
  protected readonly logger = new Logger(ApplyDiscountsRepository.name);

  constructor(
    @InjectRepository(ApplyDiscountsEntity)
    private readonly applyDiscountsRepository: Repository<ApplyDiscountsEntity>,
  ) {}

  async findAllByCondition(condition: FindOptionsWhere<ApplyDiscountsEntity>) {
    return await this.applyDiscountsRepository.find({ where: condition });
  }

  async findOne(options: FindManyOptions<ApplyDiscountsEntity>) {
    return await this.applyDiscountsRepository.findOne(options);
  }

  async create(
    applyDiscounts: ApplyDiscountsEntity,
  ): Promise<ApplyDiscountsEntity> {
    return await this.applyDiscountsRepository.save(applyDiscounts);
  }
  async update(id: number, applyDiscounts: Partial<ApplyDiscountsEntity>) {
    await this.applyDiscountsRepository.update(id, applyDiscounts);
  }

  async delete(id: number) {
    await this.applyDiscountsRepository.delete(id);
  }
}
