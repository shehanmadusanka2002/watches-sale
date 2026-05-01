import { ShoppingCart } from './shopping-cart.entity';
import { Product } from '../../products/entities/product.entity';
export declare class CartItem {
    id: number;
    quantity: number;
    price: number;
    cart: ShoppingCart;
    product: Product;
}
