import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BaseInterfaceRepository } from "./base.interfaces";

interface HasId {
    id: string | number;
}
export abstract class BaseAbstractRepostitory<T extends HasId> implements BaseInterfaceRepository<T>{
    private entity: Repository<T>
    protected constructor(entity: Repository<T>) {
        this.entity = entity
    }

    public async save(data: DeepPartial<T>): Promise<T> {
        return await this.entity.save(data)
    }

    public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
        return this.entity.save(data)
    }

    public create(data: DeepPartial<T>): T {
        return this.entity.create(data)
    }

    public createMany(data: DeepPartial<T>[]): T[] {
        return this.entity.create(data);
    }

    public async findOneById(id: any): Promise<T> {
        const options: FindOptionsWhere<T> = {
            id: id
        }
        const entity = await this.entity.findOneBy(options);
        if (!entity) {
            throw new Error(`Entity with ID ${id} not found`);
        }
        return entity;
    }

    public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
        const entity = await this.entity.findOne(filterCondition);
        if (!entity) {
            throw new Error('Entity not found');
        }
        return entity;
    }

    public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
        return await this.entity.find(relations)
    }

    public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.entity.find(options)
    }

    public async remove(data: T): Promise<T> {
        return await this.entity.remove(data)
    }

    public async preload(entityLike: DeepPartial<T>): Promise<T> {
        const entity = await this.entity.preload(entityLike);
        if (!entity) {
            throw new Error('Entity could not be preloaded');
        }
        return entity;
    }

    public async findOne(options: FindOneOptions<T>): Promise<T> {
        const entity = await this.entity.findOne(options);
        if (!entity) {
            throw new Error('Entity not found');
        }
        return entity;
    }

    public async updateById(id: string | number, updateData: DeepPartial<T>): Promise<T> {
        const entityToUpdate = await this.entity.preload({
            id: id,
            ...updateData,
        });
    
        if (!entityToUpdate) {
            throw new Error(`Entity with ID ${id} not found`);
        }
    
        return await this.entity.save(entityToUpdate);
    }
}
