import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as yup from 'yup';
import { ValidationError, DatabaseError, Error } from 'sequelize';
import { IRequestWithUser } from '../utils/types';

interface ApiResponse {
  isSuccess: boolean;
  message?: string;
}
export const validationError = (err: yup.ValidationError): ApiResponse => {
  const errors = Object.values(err.errors).map(e => e);
  return { isSuccess: false, message: errors[0] };
};
export const dbErrorHandler = (error: any): ApiResponse => {
  if (error instanceof ValidationError) {
    const validationErrors = error.errors.map(err => err.message);
    return { isSuccess: false, message: validationErrors[0] };
  }
  if (error instanceof DatabaseError) {
    console.log('DB ERROR: ', error);
    return { isSuccess: false, message: 'Something went wrong connecting to database' };
  }
  if (error instanceof Error) {
    return { isSuccess: false, message: 'Something went wrong' };
  }
  return { isSuccess: true, message: '' };
};

export const appError = (error: any): ApiResponse => {
  if (error instanceof yup.ValidationError) {
    return validationError(error);
  }
  // const dbError = dbErrorHandler(error);
  // if (!dbError.isSuccess) return dbError;
  return { isSuccess: false, message: 'Internal Server error' };
};

export const use = (fn: RequestHandler) => {
  return (req: Request | IRequestWithUser, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
};
