export interface PastDueResponse {
  pastDue: PastDue[];
}

export interface PastDue {
  branch: string;
  cid: string;
  memberName: string;
  accountNumber: string;
  productType: string;
  dateReleased: string;
  maturityDate: string;
  principalReleased: number;
  outstandingPrincipal: number;
  startArrears: string;
  daysOfArrears: number;
  parAmount: number;
  defaultPrincipal: number;
  defaultInterest: number;
  dateOfLastPayment: any;
}
