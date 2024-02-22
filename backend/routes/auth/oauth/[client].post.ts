import { z } from "zod";
import { verify } from "../../../app/oauth/controller";
import { prisma } from "../../../config/database";
import { H3Event, EventHandlerRequest } from "h3";

export default eventHandler(async (event) => {
  const client_id = process.env.GOOGLE_AUTH_CLIENT_ID;

  async function readFormDataAsObject(event: H3Event<EventHandlerRequest>) {
    try {
      const formData = await readFormData(event);
      return Object.fromEntries(formData.entries());
    } catch {
      return {};
    }
  }

  const schema = z.object({
    token: z.string().max(4),
  });

  const body = await readValidatedBody(event, () =>
    schema.safeParse(readFormDataAsObject(event)),
  );

  const token = body.token;

  // verify that the account is valid
  const {
    payload: { email },
  } = await verify({ client_id, token }).catch(() => {
    throw createError({
      message: "Validation failed",
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
