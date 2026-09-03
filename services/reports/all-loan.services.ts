import allBranch from "@/data/mock/all-branch.json";
import byBranch from "@/data/mock/by-branch.json";
import productType from "@/data/mock/product-type.json";
import pastDue from "@/data/mock/past-due.json";
import writeOffDate from "@/data/mock/writeoff.json";
import withCollateral from "@/data/mock/with-collateral.json";
import type { AllBranchResponse } from "@/services/types/all-branch/all-branch";
import { ByBranchResponse } from "../types/by-branch/by-branch";
import { ProductTypeResponse } from "../types/product-type/product-type";
import { PastDueResponse } from "../types/past-due/past-due";
import { WriteOffResponse } from "../types/writeoff/writeoff";
import { WithCollateralResponse } from "../types/with-collateral/with-collateral";

export async function getAllBranchReports(): Promise<AllBranchResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return allBranch as AllBranchResponse;
}

export async function getByBranchReports(): Promise<ByBranchResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return byBranch as ByBranchResponse;
}

export async function getProductType(): Promise<ProductTypeResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return productType as ProductTypeResponse;
}

export async function getPastDue(): Promise<PastDueResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return pastDue as PastDueResponse;
}

export async function getWriteOff(): Promise<WriteOffResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return writeOffDate as WriteOffResponse;
}

export async function getWithCollateral(): Promise<WithCollateralResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return withCollateral as WithCollateralResponse;
}
