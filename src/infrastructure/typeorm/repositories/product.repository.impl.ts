import { ProductEntity } from '@Domain/entities/product.entity';
import { IProductRepository } from '@Domain/repositories/product.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductModel } from '../models/product.model';

@Injectable()
export class ProductRepositoryImpl implements IProductRepository {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepository: Repository<ProductModel>,
  ) {}

  async find(name: string, categoryId: number): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      relations: ['category'],
      loadEagerRelations: true,
      where: {
        category: { id: categoryId },
        name: name ? ILike(`%${name}%`) : undefined,
      },
      order: {
        price: 'DESC',
      },
    });

    return products.map(ProductMapper.toEntity);
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    let productModel = await this.productRepository.save(
      ProductMapper.toModel(product),
    );

    return ProductMapper.toEntity(productModel);
  }

  async update(id: number, product: ProductEntity): Promise<void> {
    await this.productRepository.update(id, {
      ...ProductMapper.toModel(product),
    });
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
