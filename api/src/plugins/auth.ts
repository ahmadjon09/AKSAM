// Auth plugin: JWT access tokens via @fastify/jwt and an RBAC guard.
// Roles rank SUPERADMIN > ADMIN > EDITOR. Every /v1/admin route except
// login/refresh goes through requireAuth; destructive routes also pass
// requireRole("ADMIN").

import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../lib/env";
import { forbidden, unauthorized } from "../lib/errors";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (minRole: "SUPERADMIN" | "ADMIN" | "EDITOR") => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    authUser?: { id: string; email: string; role: "SUPERADMIN" | "ADMIN" | "EDITOR" };
  }
}

export interface AccessPayload {
  sub: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN" | "EDITOR";
}

const RANK: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPERADMIN: 3 };

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: env.jwtAccessSecret,
    sign: { expiresIn: env.accessTokenTtl as never }
  });

  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = await request.jwtVerify<AccessPayload>();
      request.authUser = { id: payload.sub, email: payload.email, role: payload.role };
    } catch {
      throw unauthorized();
    }
  });

  fastify.decorate("requireRole", (minRole) => async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.authUser) throw unauthorized();
    if ((RANK[request.authUser.role] ?? 0) < (RANK[minRole] ?? 0)) throw forbidden();
  });
});
