import { z } from "zod";
import { verify } from "~/app/oauth/controller";
import { resolveZodData } from "~/utils/event";
import { getUserByEmailQuery } from "~/app/accounts/repositories/user.repo";
import { createUser } from "~/app/auth/services/auth.service";
import { randomUUID } from "uncrypto";

const schema = z.object({
  token: z.string().min(4),
});

export default eventHandler(async (event) => {
  const client_id = process.env.GOOGLE_AUTH_CLIENT_ID;

  const result = resolveZodData(
    event,
    await readValidatedBody(event, (body) => schema.safeParse(body)),
  );

  const token = result?.token;

  // verify that the account is valid
  const {
    payload: { email, given_name, family_name },
  } = await verify({ client_id, token }).catch(() => {
    throw createError({
      status: 404,
      message: "Unable to resolve User",
    });
  });

  // find existing user
  const existing_user = await getUserByEmailQuery(email);

  if (existing_user) {
    return {
      status: "success",
      data: existing_user,
    };
  }

  // or create a new user
  const new_user = await createUser({
    email,
    firstname: given_name,
    lastname: family_name,
    password: randomUUID(),
  }).catch((err) => {
    console.log(err);
    // or fail with error
    throw createError({
      message: "Unable to create a user at the time",
      stack: err.stack,
    });
  });

  return {
    status: "success",
    data: new_user,
  };
});
