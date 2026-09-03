export interface WithCollateralResponse {
  withCollateral: WithCollateral[];
}

export interface WithCollateral {
  branchBooked: string;
  collateralType: string;
  collateralDescription: string;
  sequence: string;
  cidNo: string;
  acctNumberOfLoan: string;
  nameOfBorrower: string;
  description: string;
  dateOfAppraisal: string;
  appraiseValue: number;
  loanValue: number;
  collateralCode: string;
  collateralCodeDesc: string;
  reviewDateFqu?: string;
  valueDate: string;
  expiryDate: string;
  address: string;
  notes: any;
}
