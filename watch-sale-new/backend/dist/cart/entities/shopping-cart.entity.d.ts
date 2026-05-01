import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';
export declare class ShoppingCart {
    id: number;
    user: User;
    cartItems: CartItem[];
}
