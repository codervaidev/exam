import { Lucia } from "lucia";
import type { H3Event } from "h3";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Prisma, PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

const retryMiddleware = (maxRetries: number = 3, delay: number = 1000) => {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) => {
    let attempt = 0;
    while (true) {
      try {
        return await next(params);
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries || !isTransientError(error)) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };
};

function isTransientError(error: any): boolean {
  // Add your own logic to determine whether the error is transient
  // For example, check for specific error codes or messages
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P2002", "P2003"].includes(error.code) // Example error codes, replace with actual transient error codes
  ) {
    return true;
  }

  return false;
}

// Add the middleware to the Prisma client
db.$use(retryMiddleware(3, 1000));

const adapter = new PrismaAdapter(db.session, db.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      phone: attributes.phone,
      role: attributes.role,
      institute: attributes.institute,
      tshirt: attributes.tshirt,
      address: attributes.address,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name: string;
  phone: string;
  institute: string;
  role: string;
  tshirt: string;
  address: string;
}

// role enum type
export type Role = "ADMIN" | "USER";

export const validateRequest = (
  event: H3Event,
  roles: Role[] = ["ADMIN", "USER"]
) => {
  if (!event.context.user) {
    throw createError({
      statusMessage: "Unauthorized",
      statusCode: 401,
    });
  }

  // Check if the user's role is included in the allowed roles
  if (!roles.includes(event.context.user.role as Role)) {
    throw createError({
      statusMessage: "Forbidden",
      statusCode: 403,
    });
  }
};
