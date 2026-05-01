import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(order: Order, method: PaymentMethod, amount: number): Promise<Payment> {
    const payment = this.paymentRepository.create({
      order,
      method,
      amount,
      status: PaymentStatus.SUCCESS, // For now, we auto-approve payments
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });

    return this.paymentRepository.save(payment);
  }

  async createPaymentInTransaction(manager: any, order: Order, method: PaymentMethod, amount: number): Promise<Payment> {
    const payment = manager.create(Payment, {
      order,
      method,
      amount,
      status: PaymentStatus.SUCCESS,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
    return manager.save(Payment, payment);
  }
}
