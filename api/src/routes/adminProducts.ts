// Product CRUD for the admin panel. Reads hit the cache; every write
// invalidates it immediately so the public site sees changes within seconds.
// Roles: EDITOR+ manage content, only ADMIN+ may delete.

import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { cacheKeys, invalidate } from "../lib/redis";
import { productDto } from "../lib/serialize";
import { productInputSchema } from "../lib/validate";
import { badRequest, notFound } from "../lib/errors";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ensureSlug = (slug: string) => {
  if (!SLUG_REGEX.test(slug)) throw badRequest("Slug may contain latin letters, digits and dashes only");
};
import { sendAdminAlert } from "../lib/telegram";

export default async function adminProductRoutes(app: FastifyInstance) {
  const read = [app.rateLimit({ bucket: "admin-read", limit: 240, windowSeconds: 60 }), app.authenticate];
  const write = [app.rateLimit({ bucket: "admin-write", limit: 120, windowSeconds: 60, byToken: true }), app.authenticate];
  const destroy = [...write, app.requireRole("ADMIN")];

  app.get("/v1/admin/products", { preHandler: read }, async (request, reply) => {
    const rows = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true }
    });
    return reply.send({ data: rows.map(productDto) });
  });

  app.get("/v1/admin/products/:id", { preHandler: read }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const row = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!row) throw notFound("Product not found");
    return reply.send({ data: productDto(row) });
  });

  app.post("/v1/admin/products", { preHandler: write }, async (request, reply) => {
    const body = productInputSchema.parse(request.body);
    ensureSlug(body.slug);

    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) throw badRequest("Category does not exist");

    const exists = await prisma.product.findUnique({ where: { slug: body.slug } });
    if (exists) throw badRequest("A product with this slug already exists");

    const row = await prisma.product.create({
      data: {
        slug: body.slug,
        categoryId: body.categoryId,
        nameUz: body.name.uz,
        nameRu: body.name.ru,
        nameEn: body.name.en,
        shortUz: body.short?.uz ?? "",
        shortRu: body.short?.ru ?? "",
        shortEn: body.short?.en ?? "",
        descUz: body.description?.uz ?? "",
        descRu: body.description?.ru ?? "",
        descEn: body.description?.en ?? "",
        metaTitleUz: body.metaTitle?.uz ?? "",
        metaTitleRu: body.metaTitle?.ru ?? "",
        metaTitleEn: body.metaTitle?.en ?? "",
        metaDescUz: body.metaDesc?.uz ?? "",
        metaDescRu: body.metaDesc?.ru ?? "",
        metaDescEn: body.metaDesc?.en ?? "",
        highlightsUz: body.highlights?.uz ?? [],
        highlightsRu: body.highlights?.ru ?? [],
        highlightsEn: body.highlights?.en ?? [],
        specsUz: body.specs?.uz ?? [],
        specsRu: body.specs?.ru ?? [],
        specsEn: body.specs?.en ?? [],
        images: body.images,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0
      },
      include: { category: true }
    });

    await invalidate(cacheKeys.products, cacheKeys.stats);
    void sendAdminAlert(`New product created: ${body.name.uz}`);
    return reply.status(201).send({ data: productDto(row) });
  });

  app.patch("/v1/admin/products/:id", { preHandler: write }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = productInputSchema.partial().parse(request.body);
    if (body.slug !== undefined) ensureSlug(body.slug);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw notFound("Product not found");

    if (body.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
      if (!category) throw badRequest("Category does not exist");
    }
    if (body.slug && body.slug !== existing.slug) {
      const clash = await prisma.product.findUnique({ where: { slug: body.slug } });
      if (clash) throw badRequest("A product with this slug already exists");
    }

    const row = await prisma.product.update({
      where: { id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.name !== undefined && { nameUz: body.name.uz, nameRu: body.name.ru, nameEn: body.name.en }),
        ...(body.short !== undefined && { shortUz: body.short.uz, shortRu: body.short.ru, shortEn: body.short.en }),
        ...(body.description !== undefined && { descUz: body.description.uz, descRu: body.description.ru, descEn: body.description.en }),
        ...(body.metaTitle !== undefined && { metaTitleUz: body.metaTitle.uz, metaTitleRu: body.metaTitle.ru, metaTitleEn: body.metaTitle.en }),
        ...(body.metaDesc !== undefined && { metaDescUz: body.metaDesc.uz, metaDescRu: body.metaDesc.ru, metaDescEn: body.metaDesc.en }),
        ...(body.highlights !== undefined && { highlightsUz: body.highlights.uz, highlightsRu: body.highlights.ru, highlightsEn: body.highlights.en }),
        ...(body.specs !== undefined && { specsUz: body.specs.uz, specsRu: body.specs.ru, specsEn: body.specs.en }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder })
      },
      include: { category: true }
    });

    await invalidate(cacheKeys.products, cacheKeys.stats);
    return reply.send({ data: productDto(row) });
  });

  app.delete("/v1/admin/products/:id", { preHandler: destroy }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw notFound("Product not found");

    await prisma.product.delete({ where: { id } });
    await invalidate(cacheKeys.products, cacheKeys.stats);
    return reply.send({ ok: true });
  });
}
