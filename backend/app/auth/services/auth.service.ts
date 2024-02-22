import { createNewUser } from "~/app/accounts/services/user.service";
import {
  TLoginUserAttributes,
  TRegisterUserAttributes,
} from "../types/auth.types";
import { LoginUserSchema } from "../schemas/auth.schema";
import { generateToken } from "./jwt.service";
import { getUserByEmailQuery } from "~/app/accounts/repositories/user.repo";
import * as webcrypto from "uncrypto";
import { Argon2id } from "oslo/password";

export function EncryptPassword() {
  globalThis.crypto = webcrypto;

  const argon2id = new Argon2id();

  async function hashPassword(password: string) {
    return await argon2id.hash(password);
  }

  async function comparePassword(hash: string, password: string) {
    return argon2id.verify(hash, password);
  }

  return {
    hash: hashPassword,
    verify: comparePassword,
  };
}


export const createUser = async (registerUserDto: TRegisterUserAttributes) => {
  const user = await createNewUser(registerUserDto);
  const token = await generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    id: user.id,
    email: user.email,
    access_token: token,
    roles: {
      vendor: user.is_vendor,
    },
  };
};

export const LoginUserService = async (loginUserDto: TLoginUserAttributes) => {
  const validate = await LoginUserSchema.safeParseAsync(loginUserDto);

  if (!validate.success) {
    throw createError({ message: "Invalid body provided!" });
  }

  const user = await getUserByEmailQuery(loginUserDto.email);
    const encrypt = EncryptPassword();
  const validatePassword = await encrypt.verify(
    loginUserDto.password,
    user.password,
  );

  if (!validatePassword)
    throw createError({ message: "Invalid user credentials provided" });

  const token = await generateToken({ id: user.id, email: user.email });

  return {
    auth: {
      access_token: token,
    },
    data: {
      id: user.id,
      email: user.email,
      roles: {
        vendor: user.is_vendor,
      },
    },
  };
};
