export type ColorOption = 'Black & White' | 'Color';
export type PaperSizeOption = 'A4' | 'A3' | 'Letter';
export type PrintSidesOption = 'Single Side' | 'Double Side';
export type BindingOption = 'No Binding' | 'Staple' | 'Spiral';

export interface FileDetails {
  uri: string;
  name: string;
  size: number; // in bytes
  type: string; // mime type
  pageCount?: number; // optional, as it might not be immediately known or auto-detectable
}

export interface PrintOptions {
  color: ColorOption;
  paperSize: PaperSizeOption;
  sides: PrintSidesOption;
  binding: BindingOption;
  copies: number;
  instructions?: string;
}

export interface PrintJob {
  file: FileDetails | null;
  options: PrintOptions;
  // Prices in INR (₹)
  price: {
    base: number;
    color: number;
    binding: number;
    copies: number;
    total: number;
  };
}
