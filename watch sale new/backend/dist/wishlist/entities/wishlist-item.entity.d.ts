import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class WishlistItem {
    id: number;
    user: User;
    product: Product;
    addedAt: Date;
}
