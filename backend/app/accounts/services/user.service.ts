import { CreateUserSchema } from "../schemas/user.schema";
import { createUserQuery } from "../repositories/user.repo";
import { randomUUID } from "uncrypto";
import { EncryptPassword } from "~/app/auth/services/auth.service";
import { z } from "zod";

export const createNewUser = async (
  createUserDto: z.infer<typeof CreateUserSchema>,
) => {
  const validate = await CreateUserSchema.safeParseAsync(createUserDto);

  if (!validate.success) {
    throw createError({
      message: "Invalid data provided",
    });
  }

  const data = validate.data;
  const encrypt = EncryptPassword();
  const hashedPassword = await encrypt.hash(data.password);

  const userAttributes = {
    id: randomUUID(),
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    password: hashedPassword,
  };

  return createUserQuery(userAttributes);
};
