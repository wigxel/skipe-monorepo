import User from '../models/user.model';
import validator from '../../../utils/validator';
import { failResult, ResponseWithEntity, returnResult } from '../../../utils/respond';
import { CreateUserSchema } from '../schemas/user.schema';
import { CreateUserQuery, GetUserByEmailQuery, GetUsersQuery } from '../repositories/user.repo';
import { TCreateUserAttributes } from '../types/user.types';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcryptjs';

export const CreateUserService = async (createUserDto: Omit<TCreateUserAttributes, 'id'>) => {
  const validate = await validator(CreateUserSchema)(createUserDto);
  if (!validate.isSuccess) return failResult(validate.message);
  const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

  const userAttributes = {
    id: createId(),
    email: createUserDto.email,
    firstname: createUserDto.firstname,
    password: hashedPassword,
  };
  const user = await CreateUserQuery(userAttributes);

  return returnResult(true, {
    status: 201,
    title: 'User created',
    message: 'User created successfully',
    entity: user,
  });
};

export const GetUsersService = async (): Promise<ResponseWithEntity<User[]>> => {
  const users = await GetUsersQuery();
  return returnResult(true, {
    status: 200,
    title: 'Users retrieved',
    message: 'Users retrieved successfully',
    entity: users,
  });
};

export const GetUserService = async (email: string) => {
  const user = await GetUserByEmailQuery(email);
  if (!user) return failResult('User not found');
  return returnResult(true, {
    status: 200,
    title: 'User retrieved',
    message: 'User retrieved successfully',
    entity: user,
  });
};
