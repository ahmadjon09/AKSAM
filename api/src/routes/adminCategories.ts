// Category CRUD. Deleting is guarded against categories that still hold
// products; the admin panel explains that before confirming.

import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { cacheKeys, invalidate } from "../lib/redis";
import { categoryDto } from "../lib/serialize";
import { categoryInputSchema } from "../lib/validate";
import { badRequest, notFound } from "../lib/errors";

export default async function adminCategoryRoutes(app: FastifyInstance) {
  const read = [app.rateLimit({ bucket: "admin-read", limit: 240, windowSeconds: 60 }), app.authenticate];
  const write = [app.rateLimit({ bucket: "admin-write", limit: 120, windowSeconds: 60, byToken: true }), app.authenticate];
  const destroy = [...write, app.requireRole("ADMIN")];

  app.get("/v1/admin/categories", { preHandler: read }, async (request, reply) => {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } }
    });
    return reply.send({
      data: rows.map((row) => ({ ...categoryDto(row), productsCount: row._count.products }))
    });
  });

  app.post("/v1/admin/categories", { preHandler: write }, async (request, reply) => {
    const body = categoryInputSchema.parse(request.body);
    const exists = await prisma.category.findUnique({ where: { slug: body.slug } });
    if (exists) throw badRequest("A category with this slug already exists");

    const row = await prisma.category.create({
      data: {
        slug: body.slug,
        nameUz: body.name.uz,
        nameRu: body.name.ru,
        nameEn: body.name.en,
        descUz: body.description?.uz ?? "",
        descRu: body.description?.ru ?? "",
        descEn: body.description?.en ?? "",
        image: body.image || null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0
      }
    });

    await invalidate(cacheKeys.categories);
    return reply.status(201).send({ data: categoryDto(row) });
  });

  app.patch("/v1/admin/categories/:id", { preHandler: write }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = categoryInputSchema.partial().parse(request.body);

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw notFound("Category not found");

    if (body.slug && body.slug !== existing.slug) {
      const clash = await prisma.category.findUnique({ where: { slug: body.slug } });
      if (clash) throw badRequest("A category with this slug already exists");
    }

    const row = await prisma.category.update({
      where: { id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.name !== undefined && { nameUz: body.name.uz, nameRu: body.name.ru, nameEn: body.name.en }),
        ...(body.description !== undefined && { descUz: body.description.uz, descRu: body.description.ru, descEn: body.description.en }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder })
      }
    });

    await invalidate(cacheKeys.categories, cacheKeys.products);
    return reply.send({ data: categoryDto(row) });
  });

  app.delete("/v1/admin/categories/:id", { preHandler: destroy }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw notFound("Category not found");

    const inUse = await prisma.product.count({ where: { categoryId: id } });
    if (inUse > 0) throw badRequest("This category still contains products");

    await prisma.category.delete({ where: { id } });
    await invalidate(cacheKeys.categories, cacheKeys.products);
    return reply.send({ ok: true });
  });
}
