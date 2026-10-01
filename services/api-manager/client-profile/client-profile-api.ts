import { BaseApiManager } from "../baseApiEndpoint";
import {
  ClientProfileRequest,
  ClientProfileResponse,
} from "./client-profile-type";

class ClientProfileApiManager extends BaseApiManager {
  async fetchClientInformation(
    payload: ClientProfileRequest,
  ): Promise<ClientProfileResponse> {
    return this.post<ClientProfileResponse>(
      "api/public/v1/dev/auth/client-profile/fetch-information",
      payload,
    );
  }
}

export const clientProfileApi = new ClientProfileApiManager();
