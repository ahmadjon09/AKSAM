// Seed script: creates the first superadmin, the demo categories/products
// (imported from the frontend's fallback dataset, so local dev and the
// production fallback always show the same catalog), settings, plus a little
// sample analytics history so the dashboard isn't empty on day one.

import * as crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_SETTINGS
} from "../../web/lib/fallback/data";
import { hashPassword } from "../src/lib/tokens";

const prisma = new PrismaClient();

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(date)
    .replace(/\//g, "-");
}

function hashVisitorToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@aksam.uz").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Aksam2026!";

  console.log("Seeding AKSAM database…");

  // Superadmin
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        fullName: "Administrator",
        role: "SUPERADMIN"
      }
    });
    console.log(`Created superadmin: ${adminEmail} / ${adminPassword}`);
  }

  // Categories
  const categoryIdBySlug = new Map<string, string>();
  for (const cat of DEMO_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        nameUz: cat.name.uz,
        nameRu: cat.name.ru,
        nameEn: cat.name.en,
        descUz: cat.description.uz,
        descRu: cat.description.ru,
        descEn: cat.description.en,
        image: cat.image,
        isActive: cat.isActive,
        sortOrder: cat.sortOrder
      },
      create: {
        slug: cat.slug,
        nameUz: cat.name.uz,
        nameRu: cat.name.ru,
        nameEn: cat.name.en,
        descUz: cat.description.uz,
        descRu: cat.description.ru,
        descEn: cat.description.en,
        image: cat.image,
        isActive: cat.isActive,
        sortOrder: cat.sortOrder
      }
    });
    categoryIdBySlug.set(cat.slug, row.id);
    console.log(`Category: ${cat.slug}`);
  }

  // Products
  for (const product of DEMO_PRODUCTS) {
    const categoryId = categoryIdBySlug.get(product.category?.slug ?? "");
    if (!categoryId) {
      console.warn(`Skipping ${product.slug}: unknown category`);
      continue;
    }
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        categoryId,
        nameUz: product.name.uz,
        nameRu: product.name.ru,
        nameEn: product.name.en,
        shortUz: product.short.uz,
        shortRu: product.short.ru,
        shortEn: product.short.en,
        descUz: product.description.uz,
        descRu: product.description.ru,
        descEn: product.description.en,
        metaTitleUz: product.metaTitle.uz,
        metaTitleRu: product.metaTitle.ru,
        metaTitleEn: product.metaTitle.en,
        metaDescUz: product.metaDesc.uz,
        metaDescRu: product.metaDesc.ru,
        metaDescEn: product.metaDesc.en,
        highlightsUz: product.highlights.uz,
        highlightsRu: product.highlights.ru,
        highlightsEn: product.highlights.en,
        specsUz: product.specs.uz,
        specsRu: product.specs.ru,
        specsEn: product.specs.en,
        images: product.images,
        isActive: product.isActive,
        sortOrder: product.sortOrder
      },
      create: {
        slug: product.slug,
        categoryId,
        nameUz: product.name.uz,
        nameRu: product.name.ru,
        nameEn: product.name.en,
        shortUz: product.short.uz,
        shortRu: product.short.ru,
        shortEn: product.short.en,
        descUz: product.description.uz,
        descRu: product.description.ru,
        descEn: product.description.en,
        metaTitleUz: product.metaTitle.uz,
        metaTitleRu: product.metaTitle.ru,
        metaTitleEn: product.metaTitle.en,
        metaDescUz: product.metaDesc.uz,
        metaDescRu: product.metaDesc.ru,
        metaDescEn: product.metaDesc.en,
        highlightsUz: product.highlights.uz,
        highlightsRu: product.highlights.ru,
        highlightsEn: product.highlights.en,
        specsUz: product.specs.uz,
        specsRu: product.specs.ru,
        specsEn: product.specs.en,
        images: product.images,
        isActive: product.isActive,
        sortOrder: product.sortOrder
      }
    });
    console.log(`Product: ${product.slug}`);
  }

  // Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      siteName: DEMO_SETTINGS.siteName,
      tagline: DEMO_SETTINGS.tagline.uz,
      phone: DEMO_SETTINGS.phone,
      phone2: DEMO_SETTINGS.phone2,
      email: DEMO_SETTINGS.email,
      address: DEMO_SETTINGS.address.uz,
      workHours: DEMO_SETTINGS.workHours.uz,
      mapLat: DEMO_SETTINGS.mapLat,
      mapLng: DEMO_SETTINGS.mapLng,
      mapLabel: DEMO_SETTINGS.mapLabel.uz,
      instagram: DEMO_SETTINGS.instagram,
      telegram: DEMO_SETTINGS.telegram,
      facebook: DEMO_SETTINGS.facebook
    },
    create: {
      id: 1,
      siteName: DEMO_SETTINGS.siteName,
      tagline: DEMO_SETTINGS.tagline.uz,
      phone: DEMO_SETTINGS.phone,
      phone2: DEMO_SETTINGS.phone2,
      email: DEMO_SETTINGS.email,
      address: DEMO_SETTINGS.address.uz,
      workHours: DEMO_SETTINGS.workHours.uz,
      mapLat: DEMO_SETTINGS.mapLat,
      mapLng: DEMO_SETTINGS.mapLng,
      mapLabel: DEMO_SETTINGS.mapLabel.uz,
      instagram: DEMO_SETTINGS.instagram,
      telegram: DEMO_SETTINGS.telegram,
      facebook: DEMO_SETTINGS.facebook
    }
  });
  console.log("Settings saved");

  // Sample leads so the panel has something to show.
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    const sampleLeads = [
      { name: "Bekzod Toshpulatov", phone: "+998901234567", product: "Atlas lentalar", daysAgo: 0 },
      { name: "Ольга Смирнова", phone: "+998909876543", product: "To'qilgan yorliqlar", daysAgo: 1 },
      { name: "Jamshid Umarov", phone: "+998931112233", product: "Elastik tasma", daysAgo: 2 },
      { name: "Gulnora Yusupova", phone: "+998945556677", product: null, daysAgo: 4 }
    ];
    for (const lead of sampleLeads) {
      await prisma.lead.create({
        data: {
          source: lead.product ? "ORDER" : "CONTACT",
          fullName: lead.name,
          phone: lead.phone,
          productName: lead.product,
          productSlug: lead.product ? "atlas-lentalar" : null,
          lang: "uz",
          status: lead.daysAgo === 0 ? "NEW" : lead.daysAgo <= 2 ? "CONTACTED" : "CLOSED",
          createdAt: new Date(Date.now() - lead.daysAgo * 24 * 60 * 60 * 1000)
        }
      });
    }
    console.log("Sample leads created");
  }

  // Sample analytics history (last 30 days) so charts look alive.
  const visitorCount = await prisma.visitorDay.count();
  if (visitorCount === 0) {
    let created = 0;
    for (let i = 30; i >= 0; i--) {
      const day = dayKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
      const visitors = 14 + Math.round(Math.abs(Math.sin(i * 1.7)) * 60) + (i === 0 ? 8 : 0);
      for (let v = 0; v < visitors; v++) {
        const token = `seed-${day}-${v}`;
        await prisma.visitorDay.create({
          data: {
            day,
            tokenHash: hashVisitorToken(token),
            views: 1 + Math.floor(Math.random() * 3)
          }
        });
        created++;
      }
    }
    console.log(`Sample analytics created (${created} rows)`);
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
