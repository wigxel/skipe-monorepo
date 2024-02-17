import {
  CreateUserService,
  GetUserService,
} from "../../../backend/modules/accounts/services/user.service";
import {
  TLoginUserAttributes,
  TRegisterUserAttributes,
} from "../types/auth.types";

import * as bcrypt from "bcryptjs";
import { LoginUserSchema } from "../schemas/auth.schema";
import { generateToken } from "../../../backend/common/token";

export const RegisterUserService = async (
  registerUserDto: TRegisterUserAttributes,
) => {
  const user = await CreateUserService(registerUserDto);
  const token = await generateToken({
    id: user.entity.id,
    email: user.entity.email,
  });
  return {
    id: user.entity.id,
    email: user.entity.email,
    token,
    isVendor: user.entity.isVendor,
  };
};

export const LoginUserService = async (loginUserDto: TLoginUserAttributes) => {
  const validate = await LoginUserSchema.safeParseAsync(loginUserDto);

  if (!validate.success) {
    throw createError({ message: "Invalid body provided!" });
  }

  const user = await GetUserService(loginUserDto.email);
  const validatePassword = bcrypt.compareSync(
    loginUserDto.password,
    user.password,
  );

  if (!validatePassword)
    throw createError({ message: "Invalid user credentials provided" });

  const token = await generateToken({ id: user.id, email: user.email });

  return {
    status: 200,
    title: "Login User",
    message: "User logged in successfully",
    entity: {
      id: user.id,
      email: user.email,
      token,
      isVendor: user.isVendor,
    },
  };
};
