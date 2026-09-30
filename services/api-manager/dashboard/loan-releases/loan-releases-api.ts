import { BaseApiManager } from "../../baseApiEndpoint";
import { LoanReleasesResponse } from "./loan-releases-type";

class LoanReleasesApiManager extends BaseApiManager {
  async fetchLoanReleases(): Promise<LoanReleasesResponse> {
    return this.get<LoanReleasesResponse>(
      "api/public/v1/dev/auth/dashboard/fetch-loan-release"
    );
  }
}

export const loanReleasesApi = new LoanReleasesApiManager();
