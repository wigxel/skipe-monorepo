import jwt from 'jsonwebtoken';
import { TPayLoad } from './types';
import { failResult } from '../utils/respond';

const TOKEN_KEY: string = process.env.TOKEN_SECRET as unknown as string;

const verifyJWTToken = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_KEY, (err: any, decoded: any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};
export const verifyToken = async (token: string) => verifyJWTToken(token);

const generateJWTToken = (payLoad: TPayLoad): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payLoad, TOKEN_KEY, { algorithm: 'HS256' }, (err, token) => {
      if (err) reject(err);
      if (typeof token === 'undefined') {
        throw new Error('Unable to generate token');
      }
      resolve(token);
    });
  });
};

export const generateToken = async (payLoad: TPayLoad) => {
  const token = await generateJWTToken(payLoad);
  if (!token) return failResult('Unable to generate token');
  return token;
};
