export type Request = {
  id: string;
  user: { username: string; verified: boolean };
  description: string;
  images: string[];
  category: string;
};
