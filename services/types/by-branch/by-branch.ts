export interface ByBranchResponse {
  byBranch: ByBranch[];
}

export interface ByBranch {
  brCode: string;
  branch: string;
  custId: string;
  clientName: string;
  accountNumber: string;
  originalAmountGranted: number;
  interestRate: number;
  term?: number;
  dateGranted: string;
  maturityDate: string;
  outstandingBalance: number;
  prodType: string;
  loanStatus: string;
  agingStatus: string;
  defPrin: number;
  defInt: number;
  noOfDaysPastDue: number;
}
