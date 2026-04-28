export interface BillItem {
  id: string;
  category: string;
  weight: number;
  rate: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  date: string;
  purchasedFrom: string;
  // Make these optional for backward compatibility
  category?: string;
  weight?: number;
  rate?: number;
  // New items array
  items?: BillItem[];
  amount: number;
  transportType: 'Train' | 'Truck' | '';
  transportNumber: string;
  paymentMethod: 'Cash' | 'Online' | 'Cheque' | '';
  paymentReference?: string;
  amountDeposited: number;
  pendingAmount: number;
}
