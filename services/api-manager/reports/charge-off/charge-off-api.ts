import { BaseApiManager } from "../../baseApiEndpoint";
import {
  ChargeOffReportRequest,
  ChargeOffReportResponse,
} from "./charge-off-type";

class ChargeOffReportApiManager extends BaseApiManager {
  async fetchChargeOffReport(
    payload: ChargeOffReportRequest,
  ): Promise<ChargeOffReportResponse> {
    return this.post<ChargeOffReportResponse>(
      "api/public/v1/dev/auth/report/charge-off-client",
      payload,
    );
  }
}

export const chargeOffReportApi = new ChargeOffReportApiManager();
