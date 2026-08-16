// Dashboard statistics: visitor aggregates (views + uniques per day, with
// live Redis pending flushed first) and lead counts. Charts get day series
// for the selected range.

import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { dayKey, flushPendingDays } from "../lib/analytics";

export default async function adminStatsRoutes(app: FastifyInstance) {
  const read = [app.rateLimit({ bucket: "admin-read", limit: 240, windowSeconds: 60 }), app.authenticate];

  app.get("/v1/admin/stats", { preHandler: read }, async (request, reply) => {
    await flushPendingDays();

    const today = dayKey(new Date());
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [todayAgg, rangeAgg, newLeads, productCounts, leadSeriesRaw] = await Promise.all([
      prisma.visitorDay.aggregate({
        where: { day: today },
        _sum: { views: true },
        _count: true
      }),
      prisma.visitorDay.aggregate({
        where: { day: { gte: dayKey(thirtyDaysAgo) } },
        _sum: { views: true },
        _count: true
      }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.product.groupBy({ by: ["isActive"], _count: true }),
      prisma.lead.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: fourteenDaysAgo } },
        _count: true
      })
    ]);

    // Build the 14-day lead series (grouping by exact createdAt needs manual
    // bucketing — simpler to fetch raw rows for the window).
    const leadRows = await prisma.lead.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true }
    });
    const leadBuckets = new Map<string, number>();
    for (const row of leadRows) {
      const day = dayKey(row.createdAt);
      leadBuckets.set(day, (leadBuckets.get(day) ?? 0) + 1);
    }

    const viewRows = await prisma.visitorDay.findMany({
      where: { day: { gte: dayKey(fourteenDaysAgo) } },
      orderBy: { day: "asc" }
    });
    const viewBuckets = new Map<string, { views: number; uniques: number }>();
    for (const row of viewRows) {
      const cur = viewBuckets.get(row.day) ?? { views: 0, uniques: 0 };
      cur.views += row.views;
      cur.uniques += 1;
      viewBuckets.set(row.day, cur);
    }

    const days: string[] = [];
    for (let i = 13; i >= 0; i--) {
      days.push(dayKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
    }

    const activeProducts = productCounts.find((p) => p.isActive)?._count ?? 0;
    const totalProducts = productCounts.reduce((sum, p) => sum + p._count, 0);

    return reply.send({
      data: {
        visitorsToday: todayAgg._sum.views ?? 0,
        uniqueToday: todayAgg._count,
        views30d: rangeAgg._sum.views ?? 0,
        unique30d: rangeAgg._count,
        newLeads,
        productsActive: activeProducts,
        productsTotal: totalProducts,
        series: days.map((day) => ({
          day,
          views: viewBuckets.get(day)?.views ?? 0,
          uniques: viewBuckets.get(day)?.uniques ?? 0
        })),
        leadsSeries: days.map((day) => ({ day, count: leadBuckets.get(day) ?? 0 }))
      }
    });
  });

  app.get("/v1/admin/visitors", { preHandler: read }, async (request, reply) => {
    const query = request.query as { days?: string };
    const range = Math.min(Math.max(parseInt(query.days ?? "30", 10) || 30, 7), 90);
    await flushPendingDays();

    const from = dayKey(new Date(Date.now() - range * 24 * 60 * 60 * 1000));
    const rows = await prisma.visitorDay.findMany({ where: { day: { gte: from } }, orderBy: { day: "asc" } });

    const buckets = new Map<string, { views: number; uniques: number }>();
    for (const row of rows) {
      const cur = buckets.get(row.day) ?? { views: 0, uniques: 0 };
      cur.views += row.views;
      cur.uniques += 1;
      buckets.set(row.day, cur);
    }

    const days: string[] = [];
    for (let i = range - 1; i >= 0; i--) {
      days.push(dayKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
    }

    const series = days.map((day) => ({ day, views: buckets.get(day)?.views ?? 0, uniques: buckets.get(day)?.uniques ?? 0 }));
    const totals = series.reduce(
      (acc, s) => ({ views: acc.views + s.views, uniques: acc.uniques + s.uniques }),
      { views: 0, uniques: 0 }
    );

    return reply.send({ data: { series, totalViews: totals.views, totalUniques: totals.uniques } });
  });
}
