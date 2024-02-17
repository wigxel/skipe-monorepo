import { TCreateUserAttributes } from "../types/user.types";
import { prisma } from "../../../config/database";

export const CreateUserQuery = async (createUserDto: TCreateUserAttributes) => {
  await prisma.users.findUniqueOrThrow({
    where: { email: createUserDto.email },
  });
  return prisma.users.create({
    data: {
      ...createUserDto,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

export const getUserById = async (id: string) =>
  prisma.users.findUnique({ where: { id } });

export const getUserByEmail = async (email: string) =>
  prisma.users.findUnique({ where: { email } });

export const getVendors = () => {
  return;
};
