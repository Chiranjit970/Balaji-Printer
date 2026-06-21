import { create } from 'zustand';
import { Order, ProcessingStep, ProcessingStepStatus } from '../types/order.types';
import { PROCESSING_STEPS } from '../constants/checkout.constants';

interface OrderStore {
  // Current checkout order
  pendingOrder: Order | null;
  confirmedOrder: Order | null;

  // Payment processing state
  processingSteps: Array<ProcessingStep & { status: ProcessingStepStatus }>;

  // Payment failure
  paymentError: string | null;

  // Actions
  setPendingOrder: (order: Order) => void;
  setConfirmedOrder: (order: Order) => void;
  updateProcessingStep: (stepId: string, status: ProcessingStepStatus) => void;
  resetProcessingSteps: () => void;
  setPaymentError: (error: string | null) => void;
  clearOrder: () => void;
}

const initialSteps = PROCESSING_STEPS.map((step) => ({
  ...step,
  status: 'pending' as ProcessingStepStatus,
}));

export const useOrderStore = create<OrderStore>((set) => ({
  pendingOrder: null,
  confirmedOrder: null,
  processingSteps: initialSteps,
  paymentError: null,

  setPendingOrder: (order) => set({ pendingOrder: order }),
  setConfirmedOrder: (order) => set({ confirmedOrder: order }),

  updateProcessingStep: (stepId, status) =>
    set((state) => ({
      processingSteps: state.processingSteps.map((step) =>
        step.id === stepId ? { ...step, status } : step
      ),
    })),

  resetProcessingSteps: () =>
    set({ processingSteps: initialSteps.map((s) => ({ ...s, status: 'pending' })) }),

  setPaymentError: (error) => set({ paymentError: error }),

  clearOrder: () =>
    set({
      pendingOrder: null,
      confirmedOrder: null,
      processingSteps: initialSteps.map((s) => ({ ...s, status: 'pending' })),
      paymentError: null,
    }),
}));
