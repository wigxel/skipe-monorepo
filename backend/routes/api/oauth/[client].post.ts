import { z } from "zod";
import { verify } from "~/app/oauth/controller";
import { prisma } from "~/config/database";
import { resolveZodData } from "~/utils/event";

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
    payload: { email },
  } = await verify({ client_id, token }).catch(() => {
    throw createError({
      status: 404,
      message: "Unable to resolve User",
    });
  });

  const matched_user = await prisma.users.findUnique({
    where: { email },
  });

  return {
    status: "success",
    data: matched_user,
  };
});
