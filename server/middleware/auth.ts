import { Session, User } from "../types";
import {
  serialiseSession,
  SESSION_COOKIE_NAME,
  validateSession,
} from "../services/auth.service";

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME) ?? null;

  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await validateSession(sessionId);

  if (session) {
    appendResponseHeader(event, "Set-Cookie", serialiseSession(session));
  }
  if (!session) {
    appendResponseHeader(event, "Set-Cookie", "path=/;");
  }


 
  // @ts-ignore
  event.context.session = session;
  // @ts-ignore
  event.context.user = user
   
});

declare module "h3" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
