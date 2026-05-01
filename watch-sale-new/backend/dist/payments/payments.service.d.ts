import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
export declare class PaymentsService {
    private paymentRepository;
    constructor(paymentRepository: Repository<Payment>);
    createPayment(order: Order, method: PaymentMethod, amount: number): Promise<Payment>;
    createPaymentInTransaction(manager: any, order: Order, method: PaymentMethod, amount: number): Promise<Payment>;
}
