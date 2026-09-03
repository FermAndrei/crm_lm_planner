export interface WriteOffResponse {
  writeOffDate: WriteOffDate[];
}

export interface WriteOffDate {
  branch: string;
  cid: string;
  memberName: string;
  accountNumber: string;
  productType: string;
  dateReleased: string;
  maturityDate: string;
  principalReleased: number;
  outstandingPrincipal: number;
  writeoffdate: string;
}
