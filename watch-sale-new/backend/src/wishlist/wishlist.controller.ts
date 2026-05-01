import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':userId')
  getWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getWishlist(+userId);
  }

  @Post(':userId/add')
  addItem(
    @Param('userId') userId: string,
    @Body('productId') productId: number,
  ) {
    return this.wishlistService.addItem(+userId, productId);
  }

  @Delete(':userId/remove/:itemId')
  removeItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.wishlistService.removeItem(+userId, +itemId);
  }

  @Delete(':userId/product/:productId')
  removeItemByProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItemByProductId(+userId, +productId);
  }
}
