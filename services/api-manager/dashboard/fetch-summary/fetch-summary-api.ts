import { FetchSummaryType } from "@/services/api-manager/dashboard/fetch-summary/fetch-summery-type";
import { BaseApiManager } from "../../baseApiEndpoint";

class FetchSummaryResponse extends BaseApiManager {
  async fetchSummaryApi(): Promise<FetchSummaryType> {
    return this.get<FetchSummaryType>(
      "api/public/v1/dev/auth/dashboard/fetch-summary-cards",
    );
  }
}

export const fetchSummaryCardsApi = new FetchSummaryResponse();