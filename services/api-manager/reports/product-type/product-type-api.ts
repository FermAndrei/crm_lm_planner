import { BaseApiManager } from "../../baseApiEndpoint";
import { ProductTypeResponse } from "./product-type-type";

class ProductTypeApiManager extends BaseApiManager {
  async fetchProductTypeReport(): Promise<ProductTypeResponse> {
    return this.get<ProductTypeResponse>(
      "api/public/v1/dev/auth/report/product-type",
    );
  }
}

export const productTypeApi = new ProductTypeApiManager();
