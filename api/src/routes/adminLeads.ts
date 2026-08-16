// Leads (orders + contact messages) for the admin panel: listing with
// pagination and status filter, status/note updates, deletion. Lead statuses
// help the sales team track follow-ups.

import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { leadDto } from "../lib/serialize";
import { leadUpdateSchema } from "../lib/validate";
import { notFound } from "../lib/errors";

export default async function adminLeadRoutes(app: FastifyInstance) {
  const read = [app.rateLimit({ bucket: "admin-read", limit: 240, windowSeconds: 60 }), app.authenticate];
  const write = [app.rateLimit({ bucket: "admin-write", limit: 120, windowSeconds: 60, byToken: true }), app.authenticate];

  app.get("/v1/admin/leads", { preHandler: read }, async (request, reply) => {
    const query = request.query as { page?: string; status?: string; q?: string };
    const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
    const pageSize = 25;
    const where: Record<string, unknown> = {};
    if (query.status && ["NEW", "CONTACTED", "CLOSED", "SPAM"].includes(query.status)) where.status = query.status;
    if (query.q) {
      where.OR = [
        { fullName: { contains: query.q, mode: "insensitive" } },
        { phone: { contains: query.q } },
        { productName: { contains: query.q, mode: "insensitive" } }
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.lead.count({ where })
    ]);

    return reply.send({ data: rows.map(leadDto), total, page, pageSize });
  });

  app.patch("/v1/admin/leads/:id", { preHandler: write }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = leadUpdateSchema.parse(request.body);

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw notFound("Lead not found");

    const row = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.note !== undefined && { note: body.note })
      }
    });

    return reply.send({ data: leadDto(row) });
  });

  app.delete("/v1/admin/leads/:id", { preHandler: [...write, app.requireRole("ADMIN")] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) throw notFound("Lead not found");
    await prisma.lead.delete({ where: { id } });
    return reply.send({ ok: true });
  });
}
