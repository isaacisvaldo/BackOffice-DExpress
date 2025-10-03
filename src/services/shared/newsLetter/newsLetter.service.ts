

import {
  type FilterParams,
  fetchDataWithFilter,
  fetchData,
  deleteData,
} from "../../api-client";

export interface NewsLetterSubscription {
  id: string;
  email: string;
  createdAt: string;
 
}

interface GetNewsLetterSubscriptionsParams extends FilterParams {
  search?: string;
}

export interface PaginatedNewsLetterStatusesResponse {
  data: NewsLetterSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export async function GetNewsLetterSubscriptionsList(
  params: GetNewsLetterSubscriptionsParams = {},
): Promise<PaginatedNewsLetterStatusesResponse> {
  return fetchDataWithFilter("/newsletter", params);
}
export async function GetNewsLetterSubscriptions(id: string): Promise<NewsLetterSubscription> {
  return fetchData(`/newsletter/${id}`);
}
export async function DeleteNewsLetterSubscription(id: string): Promise<void> {
  return deleteData(`/newsletter/${id}`);
}