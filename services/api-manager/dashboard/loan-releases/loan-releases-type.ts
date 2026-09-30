export interface MonthlyRelease {
  month: string;
  amount: number;
  formatted_amount: string;
  percentage: number;
}

export interface LoanReleasesData {
  formatted_total_amount: string;
  monthly_releases: MonthlyRelease[];
  total_amount: number;
  y_axis: string[];
}

export interface LoanReleasesResponse {
  responseTime: string;
  device: string;
  retCode: string;
  message: string;
  data: LoanReleasesData;
}
