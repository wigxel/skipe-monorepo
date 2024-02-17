import { z } from "zod";
export const LoginUserSchema = z.object({
  email: z.string().email({ message: "Email is mandatory" }),
  password: z.string({ required_error: "Password is mandatory" }),
});
