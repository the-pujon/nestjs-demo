export class PaginationDto {
  page?: number = 1;
  limit?: number = 10;
}

export class PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
