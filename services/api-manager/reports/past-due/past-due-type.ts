export interface PastDueClientInformation {
  branch?: string;
  cid?: string;
  client?: string;
}

export interface PastDueAccountInformation {
  date_and_time?: string;
  branch?: string;
  cid?: string;
  account_number?: string;
  product_type?: string;
  pd_type?: string;
  principal_release?: number;
  formatted_principal_release?: string;
  outstanding_balance?: number;
  formatted_outstanding_balance?: string;
  date_release?: string;
  date_released?: string;
  maturity_date?: string;
  member_name?: string;
  client?: string;
}

export interface PastDuePrincipalBalance {
  principal_released?: number;
  formatted_principal_released?: string;
  outstanding_principal?: number;
  formatted_outstanding_principal?: string;
}

export interface PastDueArrearsDetails {
  start_arrears?: string;
  days_of_arrears?: number;
  formatted_days_of_arrears?: string;
  par_amount?: number;
  formatted_par_amount?: string;
  default_principal?: number;
  formatted_default_principal?: string;
  default_interest?: number;
  formatted_default_interest?: string;
  date_of_last_payment?: string;
}

export interface PastDueLoanAccount {
  account_information?: PastDueAccountInformation;
  arrears_details?: PastDueArrearsDetails;
}

export interface PastDueRecord {
  branch: string;
  cid: string;
  client?: string;
  member_name?: string;
  total_loan?: number;
  formatted_total_loan?: string;
  outstanding_balance?: number;
  formatted_outstanding_balance?: string;
  par_amount?: number;
  formatted_par_amount?: string;
  client_information?: PastDueClientInformation;
  loan_accounts?: PastDueLoanAccount[];

  // Fallback properties for backwards compatibility
  account_number?: string;
  product_type?: string;
  date_released?: string;
  maturity_date?: string;
  account_information?: PastDueAccountInformation;
  principal_balance?: PastDuePrincipalBalance;
  arrears_details?: PastDueArrearsDetails;
}

export interface PastDuePagination {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface PastDueReportData {
  pagination?: PastDuePagination;
  records?: PastDueRecord[];
  message?: string;
}

export interface PastDueReportRequest {
  search_key: string;
  page: number;
  per_page: number;
}

export interface PastDueReportResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: PastDueReportData;
}
