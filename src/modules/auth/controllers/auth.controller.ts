import { Request, Response } from 'express';
import { LoginUserService, RegisterUserService } from '../services/auth.service';
import { respond } from '../../../utils/respond';

export const RegisterUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, name } = req.body;
  const user = await RegisterUserService({ email, password, name });
  return respond(user, res);
};

export const LoginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const user = await LoginUserService({ email, password });
  return respond(user, res);
};
