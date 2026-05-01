import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
export declare class WishlistService {
    private wishlistRepository;
    private productsService;
    private usersService;
    constructor(wishlistRepository: Repository<WishlistItem>, productsService: ProductsService, usersService: UsersService);
    getWishlist(userId: number): Promise<WishlistItem[]>;
    addItem(userId: number, productId: number): Promise<WishlistItem>;
    removeItem(userId: number, itemId: number): Promise<void>;
    removeItemByProductId(userId: number, productId: number): Promise<void>;
}
