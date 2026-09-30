export interface MonthlyBalanceItem {
  month: string;
  amount: number;
  formatted_amount: string;
  percentage: number;
}

export interface OutstandingBalanceData {
  formatted_total_amount: string;
  monthly_balances: MonthlyBalanceItem[];
  total_amount: number;
  y_axis: string[];
}

export interface OutstandingBalanceResponse {
  responseTime: string;
  device: string;
  retCode: string;
  message: string;
  data: OutstandingBalanceData;
}
