import { z } from "zod";
export const CreateProductRequestSchema = z.object({
	description: z.string({ required_error: "Email is mandatory" }),
	imageUrl: z.string().optional(),
});
