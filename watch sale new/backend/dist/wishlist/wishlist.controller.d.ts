import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(userId: string): Promise<import("./entities/wishlist-item.entity").WishlistItem[]>;
    addItem(userId: string, productId: number): Promise<import("./entities/wishlist-item.entity").WishlistItem>;
    removeItem(userId: string, itemId: string): Promise<void>;
    removeItemByProduct(userId: string, productId: string): Promise<void>;
}
