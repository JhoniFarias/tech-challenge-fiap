import { CategoryEntity } from '@Domain/entities/category.entity';

export interface ICategoryRepository {
  save(category: CategoryEntity): Promise<void>;
  update(category: CategoryEntity): Promise<void>;
  delete(id: number): Promise<void>;
  find(): Promise<CategoryEntity[]>;
}

export const ICategoryRepositorySymbol = Symbol('ICategoryRepository');
