export interface ProductTypeResponse {
  productType: ProductType[];
}

export interface ProductType {
  prodType: string;
  noOfAccount: number;
  originalAmountGranted: number;
  outstandingBalance: number;
}
