import { OAuth2Client } from "google-auth-library";

export async function verify({
  token,
  client_id,
  client = new OAuth2Client(),
}: {
  token: string;
  client_id: string;
  client?: OAuth2Client;
}) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_id,
  });

  const payload = ticket.getPayload();
  const user_id = payload["sub"];

  return { user_id, payload };
}
