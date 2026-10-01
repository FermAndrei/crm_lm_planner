export interface LoanRecord {
  registered_collateral?: string;
  outstanding_principal_balance?: number;
  formatted_outstanding_principal_balance?: string;
  total_principal_released?: number;
  formatted_total_principal_released?: string;
  principal_released?: number;
  formatted_principal_released?: string;
}

export interface LoanPortfolioItem {
  active_loan_type?: string;
  total_outstanding_balance?: number;
  formatted_total_outstanding_balance?: string;
  total_records?: number;
  records?: LoanRecord[];
}

export interface PersonalAndAccountDetails {
  client_classification?: string;
  date_recognized?: string;
  date_of_birth?: string;
  email_address?: string;
  registered_address?: string;
  client_type?: string;
  mobile_no?: string;
  government?: string;
  client_id?: string;
}

export interface ClientProfileData {
  formatted_total_principal?: string;
  loan_portfolio_profile?: LoanPortfolioItem[];
  personal_and_account_details?: PersonalAndAccountDetails;
  total_active_loans?: number;
  total_principal?: number;
}

export interface ClientProfileRequest {
  client_id: string;
}

export interface ClientProfileErrorData {
  message?: string;
}

export interface ClientProfileResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: ClientProfileData | ClientProfileErrorData;
}
