export interface CartProductItem {
  cartItemId: string;
  type: 'product';
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addedAt: string;
}

export interface CartPrintItem {
  cartItemId: string;
  type: 'print';
  fileName: string;
  pageCount: number;
  copies: number;
  options: {
    color: string;
    paperSize: string;
    sides: string;
    binding: string;
  };
  price: number;
  addedAt: string;
}

export type CartItem = CartProductItem | CartPrintItem;
