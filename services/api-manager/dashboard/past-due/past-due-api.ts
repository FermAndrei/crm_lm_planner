import { BaseApiManager } from "../../baseApiEndpoint";
import { PastDueResponse } from "./past-due-type";

class PastDueApiManager extends BaseApiManager {
  async fetchPastDue(): Promise<PastDueResponse> {
    return this.get<PastDueResponse>(
      "api/public/v1/dev/auth/dashboard/fetch-past-due"
    );
  }
}

export const pastDueApi = new PastDueApiManager();
