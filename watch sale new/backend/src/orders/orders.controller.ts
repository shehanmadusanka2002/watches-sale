import { Controller, Get, Post, Body, Param, Put, Query, BadRequestException, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaymentMethod } from '../enums/payment-method.enum';
import { OrderStatus } from '../enums/order-status.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('admin-stats')
  getAdminStats() {
    return this.ordersService.getConsolidatedStats();
  }

  @Get('stats')
  getStats() {
    return this.ordersService.getDashboardStats();
  }

  @Post(':userId/checkout')
  checkout(
    @Param('userId') userId: string,
    @Body('paymentMethod') paymentMethod: PaymentMethod,
    @Body('items') items?: any[],
    @Body('shippingDetails') shippingDetails?: any,
  ) {
    if (items && items.length > 0) {
      return this.ordersService.createOrderWithItems(+userId, paymentMethod, items, shippingDetails);
    }
    return this.ordersService.createOrderFromCart(+userId, paymentMethod, shippingDetails);
  }

  @Get('user/:userId')
  getUserOrders(@Param('userId') userId: string) {
    const parsedUserId = Number(userId);
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      throw new BadRequestException('Invalid user id');
    }
    return this.ordersService.getUserOrders(parsedUserId);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Query('status') status: string,
  ) {
    const parsedOrderId = Number(id);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
      throw new BadRequestException('Invalid order id');
    }

    const statusValue = Number(status);
    if (isNaN(statusValue) || !Object.values(OrderStatus).includes(statusValue)) {
      throw new BadRequestException('Invalid order status');
    }

    return this.ordersService.updateOrderStatus(parsedOrderId, statusValue as OrderStatus);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    const parsedOrderId = Number(id);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
      throw new BadRequestException('Invalid order id');
    }
    return this.ordersService.getOrderById(parsedOrderId);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    const parsedOrderId = Number(id);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
      throw new BadRequestException('Invalid order id');
    }
    return this.ordersService.deleteOrder(parsedOrderId);
  }
}
