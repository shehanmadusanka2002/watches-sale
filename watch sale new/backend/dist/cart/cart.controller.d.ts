import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<import("./entities/shopping-cart.entity").ShoppingCart>;
    addItem(userId: string, productId: number, quantity: number): Promise<import("./entities/shopping-cart.entity").ShoppingCart>;
    removeItem(userId: string, itemId: string): Promise<import("./entities/shopping-cart.entity").ShoppingCart>;
    clearCart(userId: string): Promise<void>;
}
