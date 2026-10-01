export interface AccountInformation {
  date_and_time?: string;
  br_code?: string;
  branch?: string;
  customer_id?: string;
  client_name?: string;
  account_name?: string;
  original_amount_granted?: number;
  interest_rate?: number;
  term_window_start_date?: string;
  term_window_end_date?: string;
  term?: string;
}

export interface PaymentDetails {
  date_granted?: string;
  maturity_date?: string;
  outstanding_balance?: number;
  product_type?: string;
  loan_status?: string;
  aging_status?: string;
}

export interface DelinquencyDetails {
  defprin?: number;
  defint?: number;
  no_of_days_past_due?: number;
}

export interface BranchReportAccountDetails {
  account_information?: AccountInformation;
  payment_details?: PaymentDetails;
  delinquency_details?: DelinquencyDetails;
}

export interface BranchReportRecord {
  branch: string;
  br_code: string;
  client: string;
  customer_id: string;
  account: string;
  product_type: string;
  granted?: string;
  term_window_start_date?: string;
  term_window_end_date?: string;
  term_window?: string;
  defprin: number;
  defint: number;
  loan_status: string;
  aging_status: string;
  date_and_time?: string;
  original_amount_granted: number;
  interest_rate: number;
  no_of_days_past_due: number;
  outstanding_balance: number;
  account_details?: BranchReportAccountDetails;
}

export interface BranchReportPagination {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface BranchesReportData {
  pagination?: BranchReportPagination;
  records?: BranchReportRecord[];
  message?: string;
}

export interface BranchesReportRequest {
  search_key: string;
  branch_code: string;
  page: number;
  per_page: number;
}

export interface BranchesReportResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: BranchesReportData;
}

export interface DistinctBranch {
  branch: string;
  branch_code: string;
}

export interface DistinctBranchesResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: DistinctBranch[];
}
