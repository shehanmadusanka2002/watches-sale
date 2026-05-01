import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // In a real app, you would extract userId from a JWT Guard
  // @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(+userId);
  }

  @Post(':userId/add')
  addItem(
    @Param('userId') userId: string,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addItem(+userId, productId, quantity || 1);
  }

  @Delete(':userId/remove/:itemId')
  removeItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(+userId, +itemId);
  }

  @Delete(':userId/clear')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(+userId);
  }
}
