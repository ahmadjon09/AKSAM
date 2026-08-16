// Production gallery: a six-image masonry-like strip with caption overlay
// on hover. Photos come from the workshop — credibility, not stock feel.

"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GALLERY_ITEMS, localized } from "@/lib/content";
import { blurPlaceholder } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function GallerySection({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const items = localized(GALLERY_ITEMS, lang);

  return (
    <section className="bg-white py-20 sm:py-28" id="gallery">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} subtitle={t("gallery.subtitle")} />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5">
          {items.map((item, i) => (
            <Reveal
              key={item.src}
              delay={(i % 3) * 90}
              className={i % 3 === 0 ? "row-span-2" : ""}
            >
              <figure className="group relative h-full min-h-[180px] overflow-hidden rounded-xl bg-paper">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(min-width:1024px) 33vw, 50vw"
                  placeholder="blur"
                  blurDataURL={blurPlaceholder(item.src)}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-[13px] font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
