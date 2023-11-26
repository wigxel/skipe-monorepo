import { Response } from 'express';
import { PaginatedResponse, ResponseData } from '../utils/types';

export const returnResult = (isSuccess: boolean, data: any) => ({ isSuccess, ...data });

export const failResult = (err: string) =>
  returnResult(false, {
    status: 422,
    title: 'Oops something went wrong',
    message: err,
  });

export type ResponseWithEntity<T> = ResponseData & ({ isSuccess: true; entity: T } | { isSuccess: false });

export const respond = (data: ResponseWithEntity<any>, res: Response) => {
  return data.isSuccess
    ? res
        .status(data.status)
        .send({ status: data.status, title: data.title, message: data.message, entity: data.entity })
    : res.status(data.status).send({ status: data.status, title: data.title, message: data.message });
};

export const getPaginatedEntity = ({
  rows,
  count,
  page,
  limit,
}: {
  rows: any[];
  count: number;
  page: number;
  limit: number;
}): PaginatedResponse => {
  return {
    meta_data: {
      totalCount: count,
      currentPage: page,
      itemsOnThisPage: rows.length,
      itemsLeft: count - page * limit < 1 ? 0 : count - page * limit,
      totalPages: Math.ceil(count / limit),
    },
    data: rows,
  };
};
