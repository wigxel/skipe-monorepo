import { CreateProductRequestService } from "../services/product-request.service";

export const CreateProductRequest = async (data: { body: any; user: any }) => {
	const { description, imageUrl } = data.body;
	const userId = data.user.id;

	return CreateProductRequestService({
		description,
		imageUrl,
		userId,
	});
};
