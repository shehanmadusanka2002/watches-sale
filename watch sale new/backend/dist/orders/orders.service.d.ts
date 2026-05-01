import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { PaymentsService } from '../payments/payments.service';
import { MailService } from '../mail/mail.service';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private usersService;
    private cartService;
    private paymentsService;
    private mailService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, usersService: UsersService, cartService: CartService, paymentsService: PaymentsService, mailService: MailService);
    createOrderFromCart(userId: number, paymentMethod: PaymentMethod, shippingDetails: any): Promise<Order>;
    createOrderWithItems(userId: number, paymentMethod: PaymentMethod, items: any[], shippingDetails: any): Promise<Order>;
    getUserOrders(userId: number): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(orderId: number): Promise<Order>;
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order>;
    deleteOrder(orderId: number): Promise<void>;
    getDashboardStats(): Promise<any>;
    getConsolidatedStats(): Promise<any>;
}
