export interface ChargeOffAccountInformation {
  date_and_time?: string;
  branch?: string;
  cid?: string;
  member_name?: string;
  account_number?: string;
  product_type?: string;
}

export interface ChargeOffLoanDetails {
  date_released?: string;
  maturity_date?: string;
  principal_release?: number;
  formatted_principal_release?: string;
  outstanding_balance?: number;
  formatted_outstanding_balance?: string;
}

export interface ChargeOffWriteOffStatus {
  write_off_date?: string;
}

export interface ChargeOffRecord {
  branch: string;
  cid: string;
  member_name: string;
  account_number: string;
  product_type: string;
  term_window_start_date?: string;
  term_window_end_date?: string;
  principal_released?: number;
  formatted_principal_released?: string;
  outstanding_principal?: number;
  formatted_outstanding_principal?: string;
  write_off_date?: string;
  account_information?: ChargeOffAccountInformation;
  loan_details?: ChargeOffLoanDetails;
  write_off_status?: ChargeOffWriteOffStatus;
}

export interface ChargeOffPagination {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface ChargeOffReportData {
  pagination?: ChargeOffPagination;
  records?: ChargeOffRecord[];
  message?: string;
}

export interface ChargeOffReportRequest {
  search_key: string;
  page: number;
  per_page: number;
}

export interface ChargeOffReportResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: ChargeOffReportData;
}
