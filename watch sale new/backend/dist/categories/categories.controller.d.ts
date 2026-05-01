import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: Partial<Category>): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
}
