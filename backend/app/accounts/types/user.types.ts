import { z } from "zod";
import { CreateUserSchema } from "../schemas/user.schema";

type User = z.infer<typeof CreateUserSchema>;

export interface TCreateUserAttributes extends User {
}
