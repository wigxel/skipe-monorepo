import { ResponseWithEntity, failResult, returnResult } from '../../../utils/respond';
import validator from '../../../utils/validator';
import { CreateProductRequestQuery } from '../repositories/product-request.repo';
import { CreateProductRequestSchema } from '../schemas/product-request.schema';
import { TCreateProductRequestAttributes } from '../types/product-request.types';
import { createId } from '@paralleldrive/cuid2';

export const CreateProductRequestService = async (
  createProductRequestDto: Omit<TCreateProductRequestAttributes, 'id'>
): Promise<ResponseWithEntity<TCreateProductRequestAttributes>> => {
  const validate = await validator(CreateProductRequestSchema)(createProductRequestDto);
  if (!validate.isSuccess) return failResult(validate.message);
  const createProductRequestAttributes: TCreateProductRequestAttributes = {
    id: createId(),
    ...createProductRequestDto,
  };

  const productRequest = await CreateProductRequestQuery(createProductRequestAttributes);
  //   initiate a broadcast to all vendors and admin to notify them of the new product request
  return returnResult(true, {
    status: 201,
    title: 'Request created',
    message: 'Product request sent successfully',
    entity: productRequest,
  });
};
