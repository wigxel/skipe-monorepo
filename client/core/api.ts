import { ofetch } from "ofetch";

const Env = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL + "api/v1",
};

export const api = ofetch.create({
  baseURL: Env.baseUrl,
});

export function loginUser(data: { email: string; password: string }) {
  return api("/login", {
    method: "POST",
    body: data,
    ignoreResponseError: true,
  });
}
