import jwt from "jsonwebtoken";

const AUTH_SECRET: string = process.env.AUTH_SECRET as unknown as string;

export const verifyToken = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, AUTH_SECRET, (err: any, decoded: any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

export const generateToken = (payload: {
  id: string;
  email: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, AUTH_SECRET, { algorithm: "HS256" }, (err, token) => {
      if (err) return reject(err);
      if (typeof token === "undefined") {
        return reject(new Error("Unable to generate token"));
      }
      resolve(token);
    });
  });
};
