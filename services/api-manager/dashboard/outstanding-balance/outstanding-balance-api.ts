import { BaseApiManager } from "../../baseApiEndpoint";
import { OutstandingBalanceResponse } from "./outstanding-balance-type";

class OutstandingBalanceApiManager extends BaseApiManager {
  async fetchOutstandingBalance(): Promise<OutstandingBalanceResponse> {
    return this.get<OutstandingBalanceResponse>(
      "api/public/v1/dev/auth/dashboard/fetch-outstanding-balance"
    );
  }
}

export const outstandingBalanceApi = new OutstandingBalanceApiManager();
