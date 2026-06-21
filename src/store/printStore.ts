import { create } from 'zustand';
import type { FileDetails, PrintOptions, PrintJob } from '../types/print.types';

interface PrintState {
  job: PrintJob;
  
  // Actions
  setFile: (file: FileDetails | null) => void;
  setOptions: (options: Partial<PrintOptions>) => void;
  resetJob: () => void;
}

const DEFAULT_OPTIONS: PrintOptions = {
  color: 'Black & White',
  paperSize: 'A4',
  sides: 'Single Side',
  binding: 'No Binding',
  copies: 1,
};

const DEFAULT_JOB: PrintJob = {
  file: null,
  options: DEFAULT_OPTIONS,
  price: {
    base: 0,
    color: 0,
    binding: 0,
    copies: 0,
    total: 0,
  },
};

// Mock Pricing constants
const PRICING = {
  base: {
    'A4': 2,
    'A3': 5,
    'Letter': 3,
  },
  color: {
    'Black & White': 0,
    'Color': 8,
  },
  binding: {
    'No Binding': 0,
    'Staple': 10,
    'Spiral': 50,
  },
};

const calculatePrice = (file: FileDetails | null, options: PrintOptions) => {
  const pages = file?.pageCount || 1; // Default to 1 if unknown
  const multiplier = options.sides === 'Double Side' ? 0.8 : 1; // 20% discount on double sided per page

  const basePricePerPage = PRICING.base[options.paperSize] || 2;
  const colorPricePerPage = PRICING.color[options.color] || 0;
  
  // Base cost based on paper and sides
  const basePrice = Math.ceil(pages * basePricePerPage * multiplier);
  
  // Color cost
  const colorPrice = pages * colorPricePerPage;
  
  // Binding cost is flat per copy
  const bindingPrice = PRICING.binding[options.binding] || 0;
  
  // Calculate per copy
  const perCopyTotal = basePrice + colorPrice + bindingPrice;
  
  // Total
  const total = perCopyTotal * options.copies;

  return {
    base: basePrice * options.copies,
    color: colorPrice * options.copies,
    binding: bindingPrice * options.copies,
    copies: options.copies,
    total,
  };
};

export const usePrintStore = create<PrintState>((set) => ({
  job: DEFAULT_JOB,

  setFile: (file) => 
    set((state) => {
      const newJob = { ...state.job, file };
      newJob.price = calculatePrice(file, newJob.options);
      return { job: newJob };
    }),

  setOptions: (options) => 
    set((state) => {
      const newOptions = { ...state.job.options, ...options };
      const newJob = { ...state.job, options: newOptions };
      newJob.price = calculatePrice(newJob.file, newOptions);
      return { job: newJob };
    }),

  resetJob: () => set({ job: DEFAULT_JOB }),
}));
