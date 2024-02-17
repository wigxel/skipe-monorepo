import User from "../../../backend/modules/accounts/models/user.model";

import { CreateUserSchema } from "../schemas/user.schema";
import {
	CreateUserQuery,
	getUserByEmail,
	GetUsersQuery,
} from "../repositories/user.repo";
import { TCreateUserAttributes } from "../types/user.types";
import { randomUUID } from "uncrypto";
import * as bcrypt from "bcryptjs";

export const CreateUserService = async (
	createUserDto: Omit<TCreateUserAttributes, "id">,
) => {
	const validate = await CreateUserSchema.safeParseAsync(createUserDto);

	if (!validate.success) {
		throw createError({
			message: "Invalid data provided",
		});
	}

	const data = validate.data;
	const hashedPassword = bcrypt.hashSync(data.password, 10);

	const userAttributes = {
		id: randomUUID(),
		email: data.email,
		firstname: data.name,
		password: hashedPassword,
	};
	const user = await CreateUserQuery(userAttributes);

	return {
		status: 201,
		title: "User created",
		message: "User created successfully",
		entity: user,
	};
};

export const GetUsersService = async (): Promise<{ users: User[] }> => {
	const users = await GetUsersQuery();
	return { users: users.rows };
};

export const GetUserService = async (email: string) => {
	const user = await getUserByEmail(email);

	if (!user) throw createError({ message: "User not found" });

	return user;
};
