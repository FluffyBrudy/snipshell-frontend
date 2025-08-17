export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  notificationId: number;
  notificationInfo: string;
  isRead: boolean;
  notificationOnType: string;
  notificationOnId: number;
  createdAt: string;
}
