import User from '../models/user.model';
import { TCreateUserAttributes } from '../types/user.types';

export const CreateUserQuery = async (createUserDto: TCreateUserAttributes): Promise<User> => {
  const [user] = await User.findOrCreate({
    where: { email: createUserDto.email },
    defaults: createUserDto as User,
    attributes: ['id', 'email', 'firstname', 'lastname'],
  });
  return user;
};

export const GetUsersQuery = async (): Promise<{ rows: User[]; count: number }> => User.findAndCountAll();

export const GetUserByIdQuery = async (id: string): Promise<User | null> => User.findByPk(id);

export const GetUserByEmailQuery = async (email: string): Promise<User | null> => User.findOne({ where: { email } });

export const GetUsersByRole = async (isVendor: boolean = true): Promise<{ rows: User[]; count: number }> =>
  User.findAndCountAll({ where: { isVendor } });
