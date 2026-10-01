export interface MonthlyBreakdownItem {
  month: string;
  amount: number;
  formatted_amount: string;
  percentage: number;
}

export interface PortfolioBalanceSummary {
  amount: number;
  formatted_amount: string;
  percentage: number;
  monthly_breakdown: MonthlyBreakdownItem[];
}

export interface PastDueBreakdownSummary {
  amount: number;
  formatted_amount: string;
  percentage: number;
  monthly_breakdown: MonthlyBreakdownItem[];
}

export interface PastDueData {
  formatted_par_rate: string;
  outstanding_portfolio_balance: PortfolioBalanceSummary;
  par_rate: number;
  past_due: PastDueBreakdownSummary;
  past_due_total_clients: number;
  y_axis: string[];
}

export interface PastDueResponse {
  responseTime: string;
  device: string;
  retCode: string;
  message: string;
  data: PastDueData;
}

