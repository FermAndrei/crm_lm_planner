export interface FetchSummaryType {
  responseTime: string;
  device: string;
  retCode: string;
  message: string;
  data: FetchSummaryTypeData;
}

export interface FetchSummaryTypeData {
  outstanding_balance: OutstandingBalance;
  par_rate: ParRate;
  total_active_clients: TotalActiveClients;
  total_amount_of_past_due_account: TotalAmountOfPastDueAccount;
  total_amount_release_for_the_month: TotalAmountReleaseForTheMonth;
}

export interface OutstandingBalance {
  title: string;
  total_outstanding_balance: number;
  formatted_outstanding_balance: string;
}

export interface ParRate {
  title: string;
  par_rate: number;
  formatted_par_rate: string;
}

export interface TotalActiveClients {
  title: string;
  total_clients: number;
  formatted_total_clients: string;
}

export interface TotalAmountOfPastDueAccount {
  title: string;
  total_past_due: number;
  formatted_total_past_due: string;
}

export interface TotalAmountReleaseForTheMonth {
  title: string;
  total_amount_release: number;
  formatted_total_amount_release: string;
}
