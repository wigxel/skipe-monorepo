import {
  LoginUserService,
  RegisterUserService,
} from "../services/auth.service";

import { z } from "zod";
import { CreateUserSchema } from "../../../backend/modules/accounts/schemas/user.schema";

const params = CreateUserSchema;
type CreateUser = Required<z.infer<typeof params>>;

export const RegisterUser = async (data: CreateUser) => {
  return await RegisterUserService(data);
};

export const LoginUser = async (data: Omit<CreateUser, "name">) => {
  return await LoginUserService(data);
};
