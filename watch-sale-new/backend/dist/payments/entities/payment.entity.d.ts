import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
export declare class Payment {
    id: number;
    method: PaymentMethod;
    amount: number;
    status: PaymentStatus;
    transactionId: string;
    order: Order;
}
