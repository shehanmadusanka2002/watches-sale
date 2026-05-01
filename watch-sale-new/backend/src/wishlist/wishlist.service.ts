import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async getWishlist(userId: number): Promise<WishlistItem[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'user'],
    });
  }

  async addItem(userId: number, productId: number): Promise<WishlistItem> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productsService.findOne(productId);

    const existingItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingItem) {
      throw new ConflictException('Product is already in wishlist');
    }

    const newItem = this.wishlistRepository.create({
      user,
      product,
    });
    return this.wishlistRepository.save(newItem);
  }

  async removeItem(userId: number, itemId: number): Promise<void> {
    await this.wishlistRepository.delete({ id: itemId, user: { id: userId } });
  }

  async removeItemByProductId(userId: number, productId: number): Promise<void> {
    await this.wishlistRepository.delete({ user: { id: userId }, product: { id: productId } });
  }
}
