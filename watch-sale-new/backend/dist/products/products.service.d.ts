import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
export declare class ProductsService {
    private productsRepository;
    private categoriesService;
    constructor(productsRepository: Repository<Product>, categoriesService: CategoriesService);
    create(productData: any): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, updateData: any): Promise<Product>;
    remove(id: number): Promise<void>;
    findByCategory(categoryId: number): Promise<Product[]>;
}
