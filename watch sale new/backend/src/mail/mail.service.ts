import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOrderConfirmation(order: Order) {
    const orderId = `WH-${order.id.toString().padStart(6, '0')}`;
    const totalAmount = order.payment?.amount?.toLocaleString();
    const customerName = order.firstName ? `${order.firstName} ${order.lastName}` : (order.user?.username || 'Valued Customer');

    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee;">
          <div style="font-weight: 900; text-transform: uppercase; font-size: 13px; color: #000000;">${item.product.name}</div>
          <div style="font-size: 11px; color: #999999; text-transform: uppercase; margin-top: 5px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: 900; font-size: 13px;">
          Rs. ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000000; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; color: #000000; text-decoration: none; }
          .content { margin-bottom: 40px; }
          .order-summary { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .total-row { font-size: 18px; font-weight: 900; border-top: 2px solid #000000; }
          .footer { text-align: center; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 2px; margin-top: 60px; border-top: 1px solid #eeeeee; padding-top: 30px; }
          .button { display: inline-block; padding: 15px 30px; background-color: #000000; color: #ffffff; text-decoration: none; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="#" class="logo">ANIX OFFICIAL</a>
          </div>
          
          <div class="content">
            <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; tracking-tighter: -1px; margin-bottom: 10px;">Acquisition Confirmed</h1>
            <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #999999; letter-spacing: 2px; margin-bottom: 30px;">Order Reference: ${orderId}</p>
            
            <p style="font-size: 14px;">Dear <strong>${customerName}</strong>,</p>
            <p style="font-size: 14px;">Thank you for your acquisition from ANIX Official. We are pleased to confirm that your order has been successfully recorded in our archives and is currently being prepared for shipment.</p>
            
            <table class="order-summary">
              <thead>
                <tr>
                  <th style="text-align: left; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #999999; padding-bottom: 10px; border-bottom: 1px solid #000000;">Item Selection</th>
                  <th style="text-align: right; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #999999; padding-bottom: 10px; border-bottom: 1px solid #000000;">Valuation</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td style="padding: 20px 0; text-transform: uppercase; font-size: 11px;">Total Valuation</td>
                  <td style="padding: 20px 0; text-align: right;">Rs. ${totalAmount}</td>
                </tr>
              </tbody>
            </table>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 2px; margin-top: 30px;">
              <h4 style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Logistics Destination</h4>
              <p style="font-size: 12px; margin-bottom: 0;">
                ${order.shippingAddress}<br>
                ${order.city}, Sri Lanka<br>
                T: ${order.phone}
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="#" class="button">View Collection Log</a>
            </div>
          </div>

          <div class="footer">
            &copy; 2026 ANIX OFFICIAL BOUTIQUE<br>
            LUXURY TIMEPIECE EMPORIUM
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.mailerService.sendMail({
        to: order.email || order.user?.email,
        subject: `Your ANIX Acquisition Confirmed | Order ${orderId}`,
        html: html,
      });
      console.log(`Order confirmation email sent to ${order.email || order.user?.email}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }
}
