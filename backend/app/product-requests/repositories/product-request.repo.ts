import ProductRequest from "../models/product-request.model";
import { TCreateProductRequestAttributes } from "../types/product-request.types";

export const CreateProductRequestQuery = async (
	createProductRequestDto: TCreateProductRequestAttributes,
): Promise<ProductRequest> =>
	ProductRequest.create(createProductRequestDto as ProductRequest);

export const GetProductRequestsQuery = async (): Promise<{
	rows: ProductRequest[];
	count: number;
}> => ProductRequest.findAndCountAll();

export const GetProductRequestByIdQuery = async (
	id: string,
): Promise<ProductRequest | null> => ProductRequest.findByPk(id);
