import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async create(productData: any): Promise<Product> {
    const { categoryId, ...rest } = productData;
    const product = this.productsRepository.create(rest as Partial<Product>);
    
    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId);
      product.category = category;
    }
    
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ 
      where: { id },
      relations: ['category']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateData: any): Promise<Product> {
    const { categoryId, ...rest } = updateData;
    
    const product = await this.findOne(id);
    
    if (categoryId) {
      const category = await this.categoriesService.findOne(categoryId);
      product.category = category;
    }

    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productsRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
  }
}
