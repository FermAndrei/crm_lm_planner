import { BaseApiManager } from "../../baseApiEndpoint";
import {
  PastDueReportRequest,
  PastDueReportResponse,
} from "./past-due-type";

class PastDueReportApiManager extends BaseApiManager {
  async fetchPastDueReport(
    payload: PastDueReportRequest,
  ): Promise<PastDueReportResponse> {
    return this.post<PastDueReportResponse>(
      "api/public/v1/dev/auth/report/past-due",
      payload,
    );
  }
}

export const pastDueReportApi = new PastDueReportApiManager();
