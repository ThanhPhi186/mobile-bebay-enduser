export interface IPaginationRequest {
  page: number;
}
export interface IPaginationResponse<T> {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  results: T[];
}
