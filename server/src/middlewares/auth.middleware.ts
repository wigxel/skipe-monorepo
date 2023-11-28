import { NextFunction, Request, Response } from 'express';
import { GetUserService } from '../modules/accounts/services/user.service';
import { ResponseWithEntity, failResult, respond, returnResult } from '../utils/respond';
import { ITokenPayLoad } from './types';
import { verifyToken } from '../common/token';

const parseAuthHeader = (header: string): ResponseWithEntity<string> => {
  const [schema, token] = header.split(' ');
  if (schema.toLowerCase() !== 'bearer') return failResult('Invalid authorization token provided');
  return returnResult(true, {
    status: 200,
    title: 'Token ',
    message: 'Authorization token',
    entity: token,
  });
};

const getBearerToken = (req: Request): ResponseWithEntity<string> => {
  const header = req.headers.authorization;
  if (!header) return failResult('No token provided');
  return parseAuthHeader(header);
};

const addUserToReq = (req: Request, userObj: ITokenPayLoad): void => {
  Object.assign(req, { user: { ...userObj } });
};

const validateUser = async (req: Request, email: string) => {
  const user = await GetUserService(email);
  if (!user.isSuccess) return false;
  const payload = { id: user.entity.id, email: user.entity.email };
  addUserToReq(req, payload);
  return true;
};
//Add rules for user specific access EG, for routes that require admin access and vendor access

export const authorized = async (req: Request, res: Response, next: NextFunction) => {
  const token = getBearerToken(req);
  if (!token.isSuccess) return respond(token, res);
  const validateToken = await verifyToken(token.entity);
  if (!validateToken) {
    return respond({ isSuccess: false, status: 402, title: 'Authorization', message: 'Invalid token provided' }, res);
  }
  const tokenData = JSON.parse(JSON.stringify(validateToken));
  const user = await validateUser(req, tokenData.email);
  if (!user) {
    return respond({ isSuccess: false, status: 402, title: 'Authorization', message: 'Unauthorized access' }, res);
  }
  return next();
};
