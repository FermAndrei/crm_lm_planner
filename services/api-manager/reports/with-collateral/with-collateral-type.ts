export interface WithCollateralAccountInformation {
  date_and_time?: string;
  branch_booked?: string;
  cid_no?: string;
  account_number_of_loan?: string;
  name_of_borrower?: string;
  sequence?: string;
}

export interface WithCollateralInformation {
  collateral_type?: string;
  collateral_description?: string;
  description?: string;
  collateral_code?: string;
  collateral_code_description?: string;
}

export interface WithCollateralAppraisalDetails {
  date_of_appraisal?: string;
  appraisal_value?: number | string;
  loan_value?: number | string;
  review_date_fqu?: string;
  value_date?: string;
  expiry_date?: string;
}

export interface WithCollateralAdditionalDetails {
  address_notes?: string;
}

export interface WithCollateralRecord {
  branch_booked: string;
  collateral_type: string;
  account_number: string;
  sequence: string;
  borrower: string;
  date_of_appraisal: string;
  appraisal_value: number | string;
  loan_value: number | string;
  account_information?: WithCollateralAccountInformation;
  collateral_information?: WithCollateralInformation;
  appraisal_details?: WithCollateralAppraisalDetails;
  additional_details?: WithCollateralAdditionalDetails;
}

export interface WithCollateralPagination {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

export interface WithCollateralReportData {
  pagination?: WithCollateralPagination;
  records?: WithCollateralRecord[];
  message?: string;
}

export interface WithCollateralReportRequest {
  search_key: string;
  page: number;
  per_page: number;
}

export interface WithCollateralReportResponse {
  responseTime?: string;
  device?: string;
  retCode: string;
  message: string;
  data: WithCollateralReportData;
}
