import { Response } from 'express';
import { CreateProductRequestService } from '../services/product-request.service';
import { respond } from '../../../utils/respond';
import { IRequestWithUser } from '../../../utils/types';

export const CreateProductRequest = async (req: IRequestWithUser, res: Response): Promise<Response> => {
  const { description, imageUrl } = req.body;
  const userId = req.user.id;
  const productRequestAttributes = {
    description,
    imageUrl,
    userId,
  };
  const productRequest = await CreateProductRequestService(productRequestAttributes);
  return respond(productRequest, res);
};
