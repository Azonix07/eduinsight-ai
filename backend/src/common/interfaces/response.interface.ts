/**
 * Standard API response interface.
 * All API responses conform to this shape for consistency.
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;

  /** The response payload */
  data: T;

  /** Human-readable message */
  message: string;

  /** HTTP status code */
  statusCode: number;

  /** ISO 8601 timestamp of the response */
  timestamp: string;
}

/**
 * Paginated response interface extending the standard response.
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  /** Pagination metadata */
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
