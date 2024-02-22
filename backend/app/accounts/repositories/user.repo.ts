import { TCreateUserAttributes } from "../types/user.types";
import { prisma } from "~/config/database";
import {randomUUID} from "uncrypto";

export const createUserQuery = async (createUserDto: TCreateUserAttributes) => {
  return prisma.users.create({
      // @ts-expect-error
    data: {
      ...createUserDto,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

export const getUserByIdQuery = async (id: string) =>
  prisma.users.findUnique({ where: { id } });

export const getUserByEmailQuery = async (email: string) =>
  prisma.users.findUnique({ where: { email } });

export const getVendorsQuery = () => {
  return;
};
