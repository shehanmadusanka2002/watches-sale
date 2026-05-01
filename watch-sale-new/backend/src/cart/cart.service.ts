import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private cartRepository: Repository<ShoppingCart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async getCart(userId: number): Promise<ShoppingCart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product', 'user'],
    });

    if (!cart) {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      cart = this.cartRepository.create({ user, cartItems: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addItem(userId: number, productId: number, quantity: number): Promise<ShoppingCart> {
    const cart = await this.getCart(userId);
    const product = await this.productsService.findOne(productId);

    const existingItem = cart.cartItems.find(item => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
        price: product.price,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number): Promise<ShoppingCart> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ id: itemId, cart: { id: cart.id } });
    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
  }

  async clearCartInTransaction(manager: any, userId: number): Promise<void> {
    const cart = await this.getCart(userId);
    await manager.delete(CartItem, { cart: { id: cart.id } });
  }
}
