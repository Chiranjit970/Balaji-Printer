import { PaymentMethod } from '../types/order.types';

export interface PaymentInitPayload {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  userName: string;
  userPhone: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  error?: string;
  cancelled?: boolean;
}

export const PaymentService = {
  /**
   * MOCK: Simulate Razorpay payment
   * Future: Replace with actual Razorpay React Native SDK
   */
  async initiatePayment(
    payload: PaymentInitPayload,
    selectedMethod: PaymentMethod,
  ): Promise<PaymentResult> {
    // Simulate payment processing time
    await new Promise((r) => setTimeout(r, 2000));

    // Mock: simulate failure when amount is 0 (or cancelled)
    if (payload.amount === 0) {
      return {
        success: false,
        cancelled: true,
        error: 'Payment cancelled by user',
      };
    }

    const mockPaymentId = `pay_mock_${Date.now()}`;
    const mockSignature = `sig_mock_${Date.now()}`;

    return {
      success: true,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: mockSignature,
    };
  },
};
