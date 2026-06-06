import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  private formatPaymentMethod(method?: string) {
    switch (method) {
      case 'CASH_ON_DELIVERY':
        return 'Cash on Delivery (COD)';
      case 'BANK_TRANSFER':
        return 'Bank Transfer / Online Payment';
      case 'CARD':
        return 'Card Payment';
      case 'PAYPAL':
        return 'PayPal';
      default:
        return method ? method.replace(/_/g, ' ') : 'N/A';
    }
  }

  async sendOrderConfirmation(order: Order) {
    const orderId = `WH-${order.id.toString().padStart(6, '0')}`;
    const totalAmount = order.payment?.amount?.toLocaleString();
    const paymentMethod = this.formatPaymentMethod(order.payment?.method);
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
            <a href="#" class="logo">NEXORA HUB</a>
          </div>
          
          <div class="content">
            <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; tracking-tighter: -1px; margin-bottom: 10px;">Acquisition Confirmed</h1>
            <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #999999; letter-spacing: 2px; margin-bottom: 30px;">Order Reference: ${orderId}</p>
            
            <p style="font-size: 14px;">Dear <strong>${customerName}</strong>,</p>
            <p style="font-size: 14px;">Thank you for your acquisition from NEXORA HUB. We are pleased to confirm that your order has been successfully recorded in our archives and is currently being prepared for shipment.</p>

            <div style="margin: 24px 0 30px; padding: 16px 18px; border: 1px solid #eeeeee; background: #fafafa; border-radius: 2px;">
              <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #999999; margin-bottom: 6px;">Payment Method</div>
              <div style="font-size: 14px; font-weight: 900; color: #000000;">${paymentMethod}</div>
            </div>
            
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
            &copy; 2026 NEXORA HUB BOUTIQUE<br>
            LUXURY TIMEPIECE EMPORIUM
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.mailerService.sendMail({
        to: order.email || order.user?.email,
        subject: `Your NEXORA HUB Acquisition Confirmed | Order ${orderId}`,
        html: html,
      });
      console.log(`Order confirmation email sent to ${order.email || order.user?.email}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  async sendAdminOrderNotification(order: Order) {
    const orderId = `WH-${order.id.toString().padStart(6, '0')}`;
    const totalAmount = order.payment?.amount?.toLocaleString() || '0';
    const paymentMethod = order.payment?.method || 'N/A';
    const transactionId = order.payment?.transactionId || `TXN-${order.id}T${Date.now().toString().slice(-4)}`;
    const customerName = order.firstName ? `${order.firstName} ${order.lastName}` : (order.user?.username || 'Customer');
    const customerEmail = order.email || order.user?.email || 'N/A';
    const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() : new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

    const itemsHtml = order.orderItems.map(item => `
      <div style="display: flex; margin-bottom: 20px; padding: 15px; border: 1px solid #eeeeee; border-radius: 4px; background: #ffffff;">
        <div style="width: 80px; height: 80px; margin-right: 15px; background: #f5f5f5; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          ${item.product.imageUrl ? `<img src="${item.product.imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />` : `<div style="font-size: 10px; color: #999;">No Image</div>`}
        </div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-weight: 900; font-size: 14px; text-transform: uppercase; color: #000000; margin-bottom: 4px;">${item.product.name}</div>
              <div style="font-size: 10px; font-weight: 700; color: #999999; text-transform: uppercase; margin-bottom: 8px;">${item.product.brand || 'NEXORA'}</div>
              <div style="display: inline-block; padding: 4px 8px; background: #f0f0f0; border-radius: 2px; font-size: 9px; font-weight: 900; color: #000000; text-transform: uppercase;">
                ${item.product.movementType || 'AUTOMATIC'}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; font-weight: 700; color: #999999; margin-bottom: 4px;">x${item.quantity}</div>
              <div style="font-weight: 900; font-size: 14px; color: #000000;">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; background-color: #f9f9f9; -webkit-font-smoothing: antialiased; }
          .container { max-width: 800px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { padding: 30px; border-bottom: 1px solid #eeeeee; display: flex; align-items: center; }
          .header-icon { width: 48px; height: 48px; background: #000000; color: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 4px; margin-right: 20px; font-size: 24px; }
          .header-content { flex: 1; }
          .title { font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: -0.5px; }
          .subtitle { font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
          .content { display: flex; padding: 30px; flex-wrap: wrap; }
          .col-left { width: 40%; padding-right: 30px; box-sizing: border-box; border-right: 1px solid #eeeeee; }
          .col-right { width: 60%; padding-left: 30px; box-sizing: border-box; }
          .section-title { font-size: 11px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 15px 0; display: flex; align-items: center; }
          .section-title span { margin-right: 8px; font-size: 14px; }
          .info-block { margin-bottom: 40px; }
          .info-box { background: #fafafa; border: 1px solid #eeeeee; border-radius: 4px; padding: 20px; }
          .info-text { font-size: 13px; font-weight: 700; color: #000000; line-height: 1.8; text-transform: uppercase; }
          .info-subtext { font-size: 12px; font-weight: 500; color: #666666; margin-top: 5px; text-transform: none; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px dashed #eeeeee; padding-bottom: 15px; }
          .detail-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
          .detail-label { font-size: 11px; font-weight: 700; color: #999999; text-transform: uppercase; }
          .detail-value { font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; }
          .total-valuation { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #eeeeee; margin-top: 20px; }
          .total-valuation .label { font-size: 12px; font-weight: 900; color: #999999; text-transform: uppercase; letter-spacing: 2px; }
          .total-valuation .value { font-size: 24px; font-weight: 900; color: #000000; font-style: italic; letter-spacing: -1px; }
          @media (max-width: 600px) {
            .col-left, .col-right { width: 100%; padding: 0; border: none; }
            .col-right { padding-top: 30px; border-top: 1px solid #eeeeee; mt-30 }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">📦</div>
            <div class="header-content">
              <h1 class="title">ORDER DETAILS</h1>
              <p class="subtitle">ACQUISITION REFERENCE ${orderId}</p>
            </div>
          </div>
          
          <div class="content">
            <div class="col-left">
              <div class="info-block">
                <h3 class="section-title"><span>👤</span> CUSTOMER IDENTITY</h3>
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                  <div style="width: 32px; height: 32px; background: #eeeeee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; margin-right: 15px;">
                    ${customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase;">${customerName}</div>
                    <div style="font-size: 12px; color: #666666;">✉️ ${customerEmail}</div>
                  </div>
                </div>
              </div>

              <div class="info-block">
                <h3 class="section-title"><span>📍</span> SHIPPING LOGISTICS</h3>
                <div class="info-box">
                  <div style="font-size: 10px; font-weight: 900; color: #999999; text-transform: uppercase; margin-bottom: 5px;">DESTINATION ADDRESS</div>
                  <div class="info-text" style="margin-bottom: 15px;">
                    ${order.shippingAddress}<br>
                    ${order.city}
                  </div>
                  <div style="border-top: 1px solid #eeeeee; padding-top: 15px; font-size: 13px; font-weight: 700;">
                    📞 ${order.phone}
                  </div>
                </div>
              </div>

              <div class="info-block">
                <h3 class="section-title"><span>💳</span> FINANCIAL SUMMARY</h3>
                <div class="info-box">
                  <div class="detail-row">
                    <div class="detail-label">TOTAL AMOUNT</div>
                    <div class="detail-value">Rs. ${totalAmount}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">METHOD</div>
                    <div style="display: inline-block; padding: 4px 10px; border: 1px solid #e0e0e0; border-radius: 2px; font-size: 11px; font-weight: 900; background: #ffffff;">${paymentMethod.replace(/_/g, ' ')}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">TRANSACTION ID</div>
                    <div style="font-size: 11px; font-weight: 500; color: #999999;">${transactionId}</div>
                  </div>
                </div>
              </div>

              <div class="info-block" style="margin-bottom: 0;">
                <h3 class="section-title"><span>📅</span> TIMESTAMP</h3>
                <div style="font-size: 14px; font-weight: 900; color: #000000;">
                  ${orderDate}
                </div>
              </div>
            </div>

            <div class="col-right">
              <h3 class="section-title"><span>⌚</span> ACQUIRED TIMEPIECES</h3>
              
              <div style="margin-bottom: 30px;">
                ${itemsHtml}
              </div>

              <div class="total-valuation">
                <div class="label">TOTAL VALUATION</div>
                <div class="value">Rs. ${totalAmount}</div>
              </div>
            </div>
          </div>
          
          <div style="padding: 20px 30px; border-top: 1px solid #eeeeee; text-align: right; background: #fafafa;">
             <a href="#" style="display: inline-block; padding: 15px 30px; background: #000000; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">CLOSE LOG</a>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const adminEmail = process.env.MAIL_USER || 'shehan8998@gmail.com';
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: `[ADMIN ALERT] New Acquisition Reference ${orderId}`,
        html: html,
      });
      console.log(`Admin order notification sent to ${adminEmail}`);
    } catch (error) {
      console.error('Failed to send admin order notification email:', error);
    }
  }
}
