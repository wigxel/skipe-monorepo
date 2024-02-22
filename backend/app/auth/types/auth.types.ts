import {z} from "zod";
import {CreateUserSchema} from "~/app/accounts/schemas/user.schema";

export type TRegisterUserAttributes = z.infer<typeof CreateUserSchema>

export type TLoginUserAttributes = {
  email: string;
  password: string;
};
