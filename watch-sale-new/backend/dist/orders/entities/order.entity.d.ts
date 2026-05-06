import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare class Order {
    id: number;
    orderDate: Date;
    orderStatus: string;
    firstName: string;
    lastName: string;
    email: string;
    shippingAddress: string;
    city: string;
    phone: string;
    user: User;
    orderItems: OrderItem[];
    payment: Payment;
}
