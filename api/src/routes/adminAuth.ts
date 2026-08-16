// Admin authentication: login with email + password, short-lived access
// tokens in the response body and rotating refresh tokens in an httpOnly
// cookie. Refresh rotation revokes the used token and issues a new one, so
// a leaked refresh token is detected and killed on next use.

import type { FastifyInstance } from "fastify";
import { env } from "../lib/env";
import { prisma } from "../lib/prisma";
import { hashToken, hashPassword, randomRefreshToken, verifyPassword } from "../lib/tokens";
import { loginSchema } from "../lib/validate";
import { unauthorized } from "../lib/errors";
import type { AccessPayload } from "../plugins/auth";

const COOKIE = "aksam_refresh";
const COOKIE_PATH = "/v1/admin/auth";

function setRefreshCookie(reply: import("fastify").FastifyReply, token: string) {
  reply.setCookie(COOKIE, token, {
    path: COOKIE_PATH,
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    maxAge: 60 * 60 * 24 * env.refreshTokenTtlDays
  });
}

async function issueTokens(userId: string, email: string, role: "SUPERADMIN" | "ADMIN" | "EDITOR", app: FastifyInstance, replacedBy?: string) {
  const accessToken = app.jwt.sign({ sub: userId, email, role } satisfies AccessPayload, {
    expiresIn: env.accessTokenTtl as never
  });
  const refreshToken = randomRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * env.refreshTokenTtlDays * 1000)
    }
  });
  if (replacedBy) {
    await prisma.refreshToken.updateMany({ where: { tokenHash: replacedBy }, data: { replacedBy: hashToken(refreshToken) } });
  }
  return { accessToken, refreshToken };
}

export default async function adminAuthRoutes(app: FastifyInstance) {
  app.post(
    "/v1/admin/auth/login",
    { preHandler: [app.rateLimit({ bucket: "auth", limit: 10, windowSeconds: 60 })] },
    async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !user.isActive) throw unauthorized("Invalid credentials");

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) throw unauthorized("Invalid credentials");

    const { accessToken, refreshToken } = await issueTokens(user.id, user.email, user.role, app);
    setRefreshCookie(reply, refreshToken);

    return reply.send({
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
    });
  }
  );

  app.post(
    "/v1/admin/auth/refresh",
    { preHandler: [app.rateLimit({ bucket: "auth", limit: 30, windowSeconds: 60 })] },
    async (request, reply) => {
    const token = request.cookies[COOKIE];
    if (!token) throw unauthorized();

    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) throw unauthorized();

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || !user.isActive) throw unauthorized();

    // Rotation: mark the presented token used and replaced.
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

    const { accessToken, refreshToken } = await issueTokens(user.id, user.email, user.role, app, stored.tokenHash);
    setRefreshCookie(reply, refreshToken);

    return reply.send({
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
    });
  }
  );

  app.post(
    "/v1/admin/auth/logout",
    { preHandler: [app.rateLimit({ bucket: "auth", limit: 20, windowSeconds: 60 }), app.authenticate] },
    async (request, reply) => {
      const token = request.cookies[COOKIE];
      if (token) {
        await prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(token) }, data: { revokedAt: new Date() } });
      }
      reply.clearCookie(COOKIE, { path: COOKIE_PATH });
      return reply.send({ ok: true });
    }
  );

  app.get(
    "/v1/admin/auth/me",
    { preHandler: [app.rateLimit({ bucket: "auth", limit: 60, windowSeconds: 60 }), app.authenticate] },
    async (request, reply) => {
      const user = await prisma.user.findUnique({ where: { id: request.authUser!.id } });
      if (!user || !user.isActive) throw unauthorized();
      return reply.send({
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
      });
    }
  );
}
