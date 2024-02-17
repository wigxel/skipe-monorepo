import { z } from "zod";

export const CreateUserSchema = z.object({
	email: z.string().email({ message: "Email is mandatory" }),
	password: z.string({ required_error: "Password is mandatory" }),
	name: z.string({ required_error: "Name is mandatory" }),
});
