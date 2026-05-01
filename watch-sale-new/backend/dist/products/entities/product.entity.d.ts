import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: number;
    name: string;
    brand: string;
    description: string;
    movementType: string;
    caseMaterial: string;
    waterResistance: string;
    warranty: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
    categoryType: string;
    category: Category;
}
