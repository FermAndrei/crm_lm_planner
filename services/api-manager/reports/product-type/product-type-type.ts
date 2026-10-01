export interface ProductTypeRecord {
  product_type: string;
  no_of_accounts: number;
  original_amount_granted: number;
  formatted_original_amount_granted?: string;
  outstanding_balance: number;
  formatted_outstanding_balance?: string;
}

export interface ProductTypeTotal {
  product_type: string;
  no_of_accounts: number;
  original_amount_granted: number;
  formatted_original_amount_granted?: string;
  outstanding_balance: number;
  formatted_outstanding_balance?: string;
}

export interface ProductTypeData {
  records: ProductTypeRecord[];
  total?: ProductTypeTotal;
  message?: string;
}

export interface ProductTypeResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: ProductTypeData;
}
