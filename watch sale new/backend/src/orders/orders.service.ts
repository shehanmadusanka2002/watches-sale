import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { PaymentsService } from '../payments/payments.service';
import { MailService } from '../mail/mail.service';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private usersService: UsersService,
    private cartService: CartService,
    private paymentsService: PaymentsService,
    private mailService: MailService,
  ) {}

  async createOrderFromCart(userId: number, paymentMethod: PaymentMethod, shippingDetails: any): Promise<Order> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = cart.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return this.orderRepository.manager.transaction(async transactionalEntityManager => {
      // Create Order
      let order = transactionalEntityManager.create(Order, {
        user,
        status: OrderStatus.PENDING,
        ...shippingDetails,
      });
      order = await transactionalEntityManager.save(Order, order);

      // Create Order Items and Check Stock
      for (const item of cart.cartItems) {
        const product = await transactionalEntityManager.findOne('Product', { where: { id: item.product.id } }) as any;
        
        if (!product || product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Apologies, but the ${product?.name || 'requested timepiece'} is currently unavailable in this quantity. Please adjust your collection.`);
        }

        const orderItem = transactionalEntityManager.create(OrderItem, {
          order,
          product,
          quantity: item.quantity,
          price: item.price,
        });
        await transactionalEntityManager.save(OrderItem, orderItem);

        // Decrement stock
        product.stockQuantity -= item.quantity;
        await transactionalEntityManager.save('Product', product);
      }

      // Process Payment
      await this.paymentsService.createPaymentInTransaction(transactionalEntityManager, order, paymentMethod, totalAmount);

      // Clear cart
      await this.cartService.clearCartInTransaction(transactionalEntityManager, userId);

      const finalOrder = (await transactionalEntityManager.findOne(Order, {
        where: { id: order.id },
        relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
      }))!;

      // Send email asynchronously
      this.mailService.sendOrderConfirmation(finalOrder);

      return finalOrder;
    });
  }

  async createOrderWithItems(userId: number, paymentMethod: PaymentMethod, items: any[], shippingDetails: any): Promise<Order> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!items || items.length === 0) {
      throw new BadRequestException('No items provided for order');
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return this.orderRepository.manager.transaction(async transactionalEntityManager => {
      // Create Order
      let order = transactionalEntityManager.create(Order, {
        user,
        status: OrderStatus.PENDING,
        ...shippingDetails,
      });
      order = await transactionalEntityManager.save(Order, order);

      // Create Order Items and Check Stock
      for (const item of items) {
        const product = await transactionalEntityManager.findOne('Product', { where: { id: item.productId } }) as any;
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Apologies, but the ${product.name} is currently unavailable in this quantity. Please adjust your collection.`);
        }

        const orderItem = transactionalEntityManager.create(OrderItem, {
          order,
          product,
          quantity: item.quantity,
          price: item.price,
        });
        await transactionalEntityManager.save(OrderItem, orderItem);

        // Decrement stock
        product.stockQuantity -= item.quantity;
        await transactionalEntityManager.save('Product', product);
      }

      // Process Payment
      await this.paymentsService.createPaymentInTransaction(transactionalEntityManager, order, paymentMethod, totalAmount);

      const finalOrder = (await transactionalEntityManager.findOne(Order, {
        where: { id: order.id },
        relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
      }))!;

      // Send email asynchronously
      this.mailService.sendOrderConfirmation(finalOrder);

      return finalOrder;
    });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product', 'payment'],
      order: { orderDate: 'DESC' }
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
      order: { orderDate: 'DESC' },
    });
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(orderId);
    order.status = status;
    await this.orderRepository.save(order);
    return this.getOrderById(orderId);
  }

  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.getOrderById(orderId);
    await this.orderRepository.remove(order);
  }

  async getDashboardStats(): Promise<any> {
    const orders = await this.orderRepository.find({ relations: ['payment', 'orderItems', 'orderItems.product'] });
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.payment?.amount || 0);
    }, 0);

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by month (dummy for now but based on real count)
    const revenueByMonth = orders.reduce((acc: any, order) => {
      const month = order.orderDate ? new Date(order.orderDate).toLocaleString('default', { month: 'short' }) : 'Unknown';
      acc[month] = (acc[month] || 0) + (order.payment?.amount || 0);
      return acc;
    }, {});

    // Revenue by Category (Series)
    const revenueByCategory = orders.reduce((acc: any, order) => {
      order.orderItems?.forEach(item => {
        const cat = item.product?.categoryType || 'Other';
        acc[cat] = (acc[cat] || 0) + (item.price * item.quantity);
      });
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      revenueByMonth,
      revenueByCategory,
    };
  }

  async getConsolidatedStats(): Promise<any> {
    const [orders, users, products] = await Promise.all([
      this.orderRepository.find({ relations: ['payment'] }),
      this.usersService.findAllForAdmin(),
      this.orderRepository.manager.count('Product'),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.payment?.amount || 0), 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      totalProducts: products,
    };
  }
}
