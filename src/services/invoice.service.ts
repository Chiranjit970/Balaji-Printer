import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Order } from '../types/order.types';
import { DateUtils } from '../utils/date.utils';

export const InvoiceService = {
  /**
   * Generate and share invoice PDF
   * Future: GET /orders/{id}/invoice (server-generated PDF)
   */
  async downloadInvoice(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      const html = InvoiceService.generateHTML(order);

      if (Platform.OS === 'web') {
        await Print.printAsync({ html });
        return { success: true };
      }

      const result = await Print.printToFileAsync({ html });
      if (!result || !result.uri) {
        throw new Error('Failed to generate print file path');
      }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Invoice - ${order.displayOrderId}`,
          UTI: 'com.adobe.pdf',
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Invoice error:', error);
      return { success: false, error: 'Failed to generate invoice' };
    }
  },

  generateHTML(order: Order): string {
    const itemsHtml = order.items.map(item => {
      if (item.type === 'product') {
        return `
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 10px 0; font-size: 14px; color: #111111;">
              <strong>${item.name}</strong>
            </td>
            <td style="padding: 10px 0; text-align: center; font-size: 14px; color: #666666;">${item.quantity}</td>
            <td style="padding: 10px 0; text-align: right; font-size: 14px; color: #111111; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `;
      } else {
        const optionStr = [
          item.options.paperSize,
          item.options.color,
          item.options.sides,
          item.options.binding !== 'none' && item.options.binding !== 'No Binding' ? item.options.binding : null
        ].filter(Boolean).join(' • ');

        return `
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 10px 0; font-size: 14px; color: #111111;">
              <strong>Print Job: ${item.fileName}</strong><br/>
              <span style="font-size: 12px; color: #666666;">
                ${optionStr} (${item.pageCount} Pages, ${item.copies} Copies)
              </span>
            </td>
            <td style="padding: 10px 0; text-align: center; font-size: 14px; color: #666666;">${item.copies}</td>
            <td style="padding: 10px 0; text-align: right; font-size: 14px; color: #111111; font-weight: bold;">₹${item.price.toFixed(2)}</td>
          </tr>
        `;
      }
    }).join('');

    const landmarkText = order.deliveryAddress.landmark ? `, ${order.deliveryAddress.landmark}` : '';
    const line2Text = order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${order.displayOrderId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; padding: 24px; line-height: 1.5; }
            h1 { color: #2563EB; margin: 0; font-size: 26px; font-weight: 700; }
            .header { border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
            .header-info { text-align: right; }
            .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
            .label { color: #666; }
            .value { font-weight: 500; color: #111; }
            .total { font-size: 20px; font-weight: bold; color: #2563EB; border-top: 1px solid #E5E7EB; padding-top: 12px; margin-top: 12px; }
            .section { margin: 24px 0; }
            .section-title { font-weight: bold; font-size: 15px; text-transform: uppercase; color: #374151; letter-spacing: 0.5px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; margin-bottom: 12px; }
            .address-box { font-size: 14px; color: #4B5563; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; font-size: 12px; text-transform: uppercase; color: #6B7280; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Balaji Printers</h1>
              <div style="font-size: 14px; color: #666; margin-top: 4px;">Premium Quality Printing Solutions</div>
            </div>
            <div class="header-info">
              <div style="font-weight: bold; font-size: 16px; color: #2563EB;">INVOICE</div>
              <div style="font-size: 13px; color: #4B5563; margin-top: 4px;"># ${order.displayOrderId}</div>
              <div style="font-size: 13px; color: #4B5563;">Date: ${DateUtils.formatOrderDate(order.createdAt)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Delivery Details</div>
            <div class="address-box">
              <strong style="color: #111;">${order.deliveryAddress.name}</strong><br/>
              ${order.deliveryAddress.line1}${line2Text}${landmarkText}<br/>
              ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}<br/>
              Phone: ${order.deliveryAddress.phone}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Items Summary</div>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left; padding-bottom: 8px;">Description</th>
                  <th style="text-align: center; width: 60px; padding-bottom: 8px;">Qty</th>
                  <th style="text-align: right; width: 100px; padding-bottom: 8px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div class="section" style="width: 50%; margin-left: auto;">
            <div class="section-title" style="text-align: right;">Payment Breakdown</div>
            <div class="row"><span class="label">Subtotal</span><span class="value">₹${order.pricing.subtotal.toFixed(2)}</span></div>
            <div class="row"><span class="label">Delivery Fee</span><span class="value">₹${order.pricing.deliveryFee.toFixed(2)}</span></div>
            <div class="row total"><span class="label" style="color: #2563EB; font-weight: bold;">Total Paid</span><span class="value" style="color: #2563EB; font-weight: bold;">₹${order.pricing.total.toFixed(2)}</span></div>
          </div>

          <div class="section" style="background-color: #F9FAFB; padding: 16px; border-radius: 8px; border: 1px solid #F3F4F6;">
            <div class="section-title" style="border: none; margin: 0; padding: 0; font-size: 13px;">Transaction Reference</div>
            <div class="row" style="margin-top: 8px; margin-bottom: 0;"><span class="label">Payment Method</span><span class="value">Razorpay (${(order.paymentMethod || 'UPI').toUpperCase()})</span></div>
            <div class="row" style="margin-top: 4px; margin-bottom: 0;"><span class="label">Payment ID</span><span class="value" style="font-family: monospace;">${order.razorpayPaymentId || 'N/A'}</span></div>
            <div class="row" style="margin-top: 4px; margin-bottom: 0;"><span class="label">Status</span><span class="value" style="color: #16A34A; font-weight: bold;">${order.paymentStatus.toUpperCase()}</span></div>
          </div>

          <div style="text-align: center; margin-top: 48px; color: #9CA3AF; font-size: 12px; border-top: 1px solid #F3F4F6; padding-top: 16px;">
            Thank you for choosing Balaji Printers! For any support, please contact us at support@balajiprinters.com
          </div>
        </body>
      </html>
    `;
  },
};
