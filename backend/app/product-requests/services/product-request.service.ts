import { CreateProductRequestQuery } from "../repositories/product-request.repo";
import { CreateProductRequestSchema } from "../schemas/product-request.schema";
import { TCreateProductRequestAttributes } from "../types/product-request.types";
import { randomUUID } from "uncrypto";
import ProductRequest from "../models/product-request.model";

export const CreateProductRequestService = async (
  createProductRequestDto: Omit<TCreateProductRequestAttributes, "id">,
): Promise<ProductRequest> => {
  const validate = await CreateProductRequestSchema.safeParseAsync(
    createProductRequestDto,
  );

  if (!validate.success) {
    throw createError({ message: "Invalid payload" });
  }

  const createProductRequestAttributes: TCreateProductRequestAttributes = {
    id: randomUUID(),
    ...createProductRequestDto,
  };

  //   initiate a broadcast to all vendors and admin to notify them of the new product request
  return CreateProductRequestQuery(createProductRequestAttributes);
};
