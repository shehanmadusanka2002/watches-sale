import { OrdersService } from './orders.service';
import { PaymentMethod } from '../enums/payment-method.enum';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAllOrders(): Promise<import("./entities/order.entity").Order[]>;
    getAdminStats(): Promise<any>;
    getStats(): Promise<any>;
    checkout(userId: string, paymentMethod: PaymentMethod, items?: any[], shippingDetails?: any): Promise<import("./entities/order.entity").Order>;
    getUserOrders(userId: string): Promise<import("./entities/order.entity").Order[]>;
    updateStatus(id: string, status: string): Promise<import("./entities/order.entity").Order>;
    getOrderById(id: string): Promise<import("./entities/order.entity").Order>;
    deleteOrder(id: string): Promise<void>;
}
