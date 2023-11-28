import { generateToken } from '../../../common/token';
import { failResult, returnResult } from '../../../utils/respond';
import { CreateUserService, GetUserService } from '../../accounts/services/user.service';
import { TLoginUserAttributes, TRegisterUserAttributes } from '../types/auth.types';
import validator from '../../../utils/validator';
import * as bcrypt from 'bcryptjs';
import { LoginUserSchema } from '../schemas/auth.schema';

export const RegisterUserService = async (registerUserDto: TRegisterUserAttributes) => {
  const user = await CreateUserService(registerUserDto);
  if (!user.isSuccess) return failResult(user.message);
  const token = await generateToken({ id: user.entity.id, email: user.entity.email });
  return returnResult(true, {
    status: 201,
    title: 'Register User',
    message: 'User created successfully',
    entity: {
      id: user.entity.id,
      email: user.entity.email,
      token,
      isVendor: user.entity.isVendor,
    },
  });
};

export const LoginUserService = async (loginUserDto: TLoginUserAttributes) => {
  const validate = await validator(LoginUserSchema)(loginUserDto);
  if (!validate.isSuccess) return failResult(validate.message);

  const user = await GetUserService(loginUserDto.email);
  if (!user.isSuccess) return failResult(user.message);

  const validatePassword = bcrypt.compareSync(loginUserDto.password, user.entity.password);
  if (!validatePassword) return failResult('Invalid user credentials provided');

  const token = await generateToken({ id: user.entity.id, email: user.entity.email });

  return returnResult(true, {
    status: 200,
    title: 'Login User',
    message: 'User logged in successfully',
    entity: {
      id: user.entity.id,
      email: user.entity.email,
      token,
      isVendor: user.entity.isVendor,
    },
  });
};
