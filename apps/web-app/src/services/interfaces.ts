export interface BaseResponse<T> {
  data: T;
}

export interface ListBaseResponse<T> extends BaseResponse<T[]> {
  pagination?: Pagination;
}

export interface Pagination {
  skip: number;
  take: number;
  total: number;
}
