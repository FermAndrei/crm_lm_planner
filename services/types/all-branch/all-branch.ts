export interface AllBranchResponse {
  allBranch: AllBranchReport[];
}

export interface AllBranchReport {
  brCode: string;
  branch: string;
  custId: string;
  clientName: string;
  accountNumber: string;
  originalAmountGranted: number;
  interestRate: number;
  term: any;
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
