// Public read endpoints. Each one checks Redis first, then Postgres, then
// repopulates the cache. The frontend still works if this API is down —
// it falls back to its bundled demo dataset.

import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { getCached, setCached, cacheKeys, invalidate } from "../lib/redis";
import { categoryDto, productDto, settingsDto } from "../lib/serialize";
import { recordVisit } from "../lib/analytics";
import { sendLeadToChannel } from "../lib/telegram";
import { sanitizedContact, sanitizedOrder, trackSchema } from "../lib/validate";

export default async function publicRoutes(app: FastifyInstance) {
  app.get("/v1/public/products", async (request, reply) => {
    const cached = await getCached(cacheKeys.products);
    if (cached) return reply.header("X-Cache", "HIT").send({ data: cached });

    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true }
    });
    const data = rows.map(productDto);
    await setCached(cacheKeys.products, data);
    return reply.header("X-Cache", "MISS").send({ data });
  });

  app.get("/v1/public/categories", async (request, reply) => {
    const cached = await getCached(cacheKeys.categories);
    if (cached) return reply.header("X-Cache", "HIT").send({ data: cached });

    const rows = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });
    const data = rows.map(categoryDto);
    await setCached(cacheKeys.categories, data);
    return reply.header("X-Cache", "MISS").send({ data });
  });

  app.get("/v1/public/settings", async (request, reply) => {
    const cached = await getCached(cacheKeys.settings);
    if (cached) return reply.header("X-Cache", "HIT").send({ data: cached });

    const row = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        siteName: "AKSAM",
        phone: "+998 91 183 80 08",
        email: "abdullaxodjayev@mail.ru"
      }
    });
    const data = settingsDto(row);
    await setCached(cacheKeys.settings, data, 600);
    return reply.header("X-Cache", "MISS").send({ data });
  });

  // Anonymous visit beacon.
  app.post("/v1/track", async (request, reply) => {
    const parsed = trackSchema.parse(request.body);
    await recordVisit(parsed.token);
    return reply.send({ ok: true });
  });

  // Order form (site-wide) — saved to DB and forwarded to Telegram.
  app.post("/v1/orders", async (request, reply) => {
    const data = sanitizedOrder(request.body);
    // Honeypot: bots fill hidden fields; real users never see them.
    const raw = request.body as Record<string, unknown>;
    if (typeof raw.honey === "string" && raw.honey.length > 0) {
      return reply.send({ ok: true });
    }

    const lead = await prisma.lead.create({
      data: {
        source: "ORDER",
        fullName: data.fullName,
        phone: data.phone,
        message: data.message,
        productSlug: data.productSlug,
        productName: data.productName,
        lang: data.lang
      }
    });

    // Fire-and-forget: the Telegram delivery must never slow the user down.
    void sendLeadToChannel({
      source: "ORDER",
      fullName: data.fullName,
      phone: data.phone,
      message: data.message ?? undefined,
      productName: data.productName ?? undefined,
      lang: data.lang ?? undefined
    });

    return reply.status(201).send({ ok: true, id: lead.id });
  });

  // Contact form.
  app.post("/v1/contact", async (request, reply) => {
    const data = sanitizedContact(request.body);
    const raw = request.body as Record<string, unknown>;
    if (typeof raw.honey === "string" && raw.honey.length > 0) {
      return reply.send({ ok: true });
    }

    const lead = await prisma.lead.create({
      data: {
        source: "CONTACT",
        fullName: data.fullName,
        phone: data.phone,
        message: data.message,
        lang: data.lang
      }
    });

    void sendLeadToChannel({
      source: "CONTACT",
      fullName: data.fullName,
      phone: data.phone,
      message: data.message ?? undefined,
      lang: data.lang ?? undefined
    });

    return reply.status(201).send({ ok: true, id: lead.id });
  });
}
