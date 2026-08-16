// Site settings (single row, id = 1). Updates propagate to the public site
// through cache invalidation.

import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { cacheKeys, invalidate } from "../lib/redis";
import { settingsDto } from "../lib/serialize";
import { settingsInputSchema } from "../lib/validate";

export default async function adminSettingsRoutes(app: FastifyInstance) {
  const read = [app.rateLimit({ bucket: "admin-read", limit: 240, windowSeconds: 60 }), app.authenticate];
  const write = [app.rateLimit({ bucket: "admin-write", limit: 60, windowSeconds: 60, byToken: true }), app.authenticate, app.requireRole("ADMIN")];

  app.get("/v1/admin/settings", { preHandler: read }, async (request, reply) => {
    const row = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, siteName: "AKSAM", phone: "+998 91 183 80 08", email: "abdullaxodjayev@mail.ru" }
    });
    return reply.send({ data: settingsDto(row) });
  });

  app.patch("/v1/admin/settings", { preHandler: write }, async (request, reply) => {
    const body = settingsInputSchema.parse(request.body);
    const row = await prisma.settings.update({
      where: { id: 1 },
      data: {
        ...(body.siteName !== undefined && { siteName: body.siteName }),
        ...(body.tagline !== undefined && { tagline: body.tagline }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.phone2 !== undefined && { phone2: body.phone2 }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.workHours !== undefined && { workHours: body.workHours }),
        ...(body.mapLat !== undefined && { mapLat: body.mapLat }),
        ...(body.mapLng !== undefined && { mapLng: body.mapLng }),
        ...(body.mapLabel !== undefined && { mapLabel: body.mapLabel }),
        ...(body.instagram !== undefined && { instagram: body.instagram }),
        ...(body.telegram !== undefined && { telegram: body.telegram }),
        ...(body.facebook !== undefined && { facebook: body.facebook })
      }
    });

    await invalidate(cacheKeys.settings);
    return reply.send({ data: settingsDto(row) });
  });
}
