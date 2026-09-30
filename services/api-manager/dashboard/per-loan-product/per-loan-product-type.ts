export interface LoanProductItem {
  product_description: string;
  product_type: string;
  total_amount: number;
  formatted_amount: string;
  total_clients: number;
  percentage: number;
}

export interface PerLoanProductData {
  formatted_total_amount: string;
  products: LoanProductItem[];
  total_active_clients: number;
  total_amount: number;
  y_axis: string[];
}

export interface PerLoanProductResponse {
  responseTime: string;
  device: string;
  retCode: string;
  message: string;
  data: PerLoanProductData;
}
