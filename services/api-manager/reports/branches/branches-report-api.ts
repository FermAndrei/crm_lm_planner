import { BaseApiManager } from "../../baseApiEndpoint";
import {
  BranchesReportRequest,
  BranchesReportResponse,
  DistinctBranchesResponse,
} from "./branches-report-type";

class BranchesReportApiManager extends BaseApiManager {
  async fetchBranchesReport(
    payload: BranchesReportRequest,
  ): Promise<BranchesReportResponse> {
    return this.post<BranchesReportResponse>(
      "api/public/v1/dev/auth/report/branches",
      payload,
    );
  }

  async fetchDistinctBranches(): Promise<DistinctBranchesResponse> {
    return this.get<DistinctBranchesResponse>(
      "api/public/v1/dev/auth/report/distinct-branches",
    );
  }
}

export const branchesReportApi = new BranchesReportApiManager();
