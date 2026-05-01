import { Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private productsService;
    private usersService;
    constructor(cartRepository: Repository<ShoppingCart>, cartItemRepository: Repository<CartItem>, productsService: ProductsService, usersService: UsersService);
    getCart(userId: number): Promise<ShoppingCart>;
    addItem(userId: number, productId: number, quantity: number): Promise<ShoppingCart>;
    removeItem(userId: number, itemId: number): Promise<ShoppingCart>;
    clearCart(userId: number): Promise<void>;
    clearCartInTransaction(manager: any, userId: number): Promise<void>;
}
