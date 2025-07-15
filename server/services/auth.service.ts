import { v4 as uuidv4 } from "uuid";
import { Session, User } from "../types";

const SESSION_COOKIE_NAME = "auth_session";

const createSession = async (userId: string) => {
  

  const session = await query("INSERT INTO free_exam_sessions (id, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *", [
    uuidv4(),
    userId,
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  ]);

  if (!session.data) {
    throw new Error("Failed to create session");
  }

  return session.data[0];
};

const serialiseSession = (session:Session) => {
  return `${SESSION_COOKIE_NAME}=${session.id}; Max-Age=${session.expires_at.getTime() - Date.now()}; Path=/`;
};

const deleteOtherSessions = async (userId: string) => {
  await query("DELETE FROM free_exam_sessions WHERE user_id = $1", [userId]);
};

const validateSession = async (sessionId: string) => {
  const session = await query<Session>("SELECT * FROM free_exam_sessions WHERE id = $1", [sessionId]);

  if (!session.data || session.data.length === 0) {
    return {
      session: null,
      user: null,
    };
  }


  const user = await query<User>("SELECT * FROM free_exam_users WHERE id = $1", [session.data[0].user_id]);

  if (!user.data || user.data.length === 0) {
    return {
      session: null,
      user: null,
    };
  }

  return {
    user: user.data[0],
    session: session.data[0],
  };
};

const invalidateSession = async (sessionId: string) => {
  await query("DELETE FROM free_exam_sessions WHERE id = $1", [sessionId]);
};

export {
  SESSION_COOKIE_NAME,
  createSession,
  deleteOtherSessions,
  validateSession,
  serialiseSession,
  invalidateSession,
};
