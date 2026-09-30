import { BaseApiManager } from "../../baseApiEndpoint";
import { PerLoanProductResponse } from "./per-loan-product-type";

class PerLoanProductApiManager extends BaseApiManager {
  async fetchPerLoanProduct(): Promise<PerLoanProductResponse> {
    return this.get<PerLoanProductResponse>(
      "api/public/v1/dev/auth/dashboard/fetch-per-loan-product"
    );
  }
}

export const perLoanProductApi = new PerLoanProductApiManager();
