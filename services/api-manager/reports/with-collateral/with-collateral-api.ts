import { BaseApiManager } from "../../baseApiEndpoint";
import {
  WithCollateralReportRequest,
  WithCollateralReportResponse,
} from "./with-collateral-type";

class WithCollateralReportApiManager extends BaseApiManager {
  async fetchWithCollateralReport(
    payload: WithCollateralReportRequest,
  ): Promise<WithCollateralReportResponse> {
    return this.post<WithCollateralReportResponse>(
      "api/public/v1/dev/auth/report/charged-with-collateral",
      payload,
    );
  }
}

export const withCollateralReportApi = new WithCollateralReportApiManager();
