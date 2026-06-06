import { MailerService } from '@nestjs-modules/mailer';
import { Order } from '../orders/entities/order.entity';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    private formatPaymentMethod;
    sendOrderConfirmation(order: Order): Promise<void>;
    sendAdminOrderNotification(order: Order): Promise<void>;
}
