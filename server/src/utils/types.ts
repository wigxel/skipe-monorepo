import { Request } from 'express';
export interface IRequestWithUser extends Request {
  user?: any;
}
export interface ResponseData {
  status: number;
  title: string;
  message: string;
}

export interface PaginatedResponse {
  data: Record<string, any>;
  meta_data: {
    totalCount: number;
    currentPage: number;
    itemsOnThisPage: number;
    itemsLeft: number;
    totalPages: number;
  };
}
