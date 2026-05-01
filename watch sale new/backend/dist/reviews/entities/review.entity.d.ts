import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Review {
    id: number;
    user: User;
    product: Product;
    rating: number;
    comment: string;
    createdAt: Date;
}
