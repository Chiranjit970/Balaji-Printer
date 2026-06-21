import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';
import { useOrderStore } from '../store/orderStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { PaymentMethod } from '../types/order.types';

export const usePayment = () => {
  const router = useRouter();
  const { pendingOrder, updateProcessingStep, setConfirmedOrder, setPaymentError } = useOrderStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);

  const executePayment = useCallback(async (selectedMethod: PaymentMethod) => {
    if (!pendingOrder) return;

    try {
      // Navigate to processing screen immediately
      router.push('/(checkout)/processing');

      // Step 1: Initiate payment
      const paymentResult = await PaymentService.initiatePayment(
        {
          orderId: pendingOrder.id,
          razorpayOrderId: pendingOrder.razorpayOrderId || '',
          amount: pendingOrder.pricing.total,
          currency: 'INR',
          userName: user?.name || 'Customer',
          userPhone: user?.phone || '',
          description: 'Balaji Printers Order',
        },
        selectedMethod,
      );

      if (!paymentResult.success) {
        if (paymentResult.cancelled) {
          setPaymentError('Payment was cancelled by you.');
        } else {
          setPaymentError(paymentResult.error || 'Payment failed. Please try again.');
        }
        router.replace('/(checkout)/failed');
        return;
      }

      // Step 2: Update processing steps sequentially
      await new Promise((r) => setTimeout(r, 500));
      updateProcessingStep('received', 'completed');

      await new Promise((r) => setTimeout(r, 800));
      updateProcessingStep('verifying', 'active');

      // Step 3: Confirm with backend
      const confirmResult = await OrderService.confirmPayment({
        orderId: pendingOrder.id,
        razorpayPaymentId: paymentResult.razorpayPaymentId,
        razorpaySignature: paymentResult.razorpaySignature,
      });

      updateProcessingStep('verifying', 'completed');

      await new Promise((r) => setTimeout(r, 600));
      updateProcessingStep('updating', 'active');
      await new Promise((r) => setTimeout(r, 500));
      updateProcessingStep('updating', 'completed');

      if (!confirmResult.success || !confirmResult.order) {
        setPaymentError('Payment verification failed. Please contact support.');
        router.replace('/(checkout)/failed');
        return;
      }

      // Step 4: Set confirmed order + clear cart
      setConfirmedOrder(confirmResult.order);
      clearCart();

      await new Promise((r) => setTimeout(r, 400));
      router.replace('/(checkout)/confirmation');

    } catch (error) {
      setPaymentError('An unexpected error occurred. Please try again.');
      router.replace('/(checkout)/failed');
    }
  }, [pendingOrder, user, updateProcessingStep, setConfirmedOrder, setPaymentError, clearCart, router]);

  return { executePayment };
};
