// Product image gallery: large stage plus thumbnail rail. Thumbnails switch
// the stage image with a subtle crossfade; the active thumb gets the red
// keyline. Arrow keys move through the gallery too.

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blurPlaceholder, cn } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ["/images/hero-main.jpg"];
  const current = safeImages[Math.min(index, safeImages.length - 1)];

  const step = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + safeImages.length) % safeImages.length);
    },
    [safeImages.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <div>
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={alt}
              fill
              priority={index === 0}
              sizes="(min-width:1024px) 55vw, 100vw"
              placeholder="blur"
              blurDataURL={blurPlaceholder(current)}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {safeImages.length > 1 && (
          <>
            <button
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-lg transition-all duration-300 hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-lg transition-all duration-300 hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5" role="tablist" aria-label="Gallery">
          {safeImages.slice(0, 5).map((img, i) => (
            <button
              key={img + i}
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg ring-1 transition-all duration-300",
                i === index ? "ring-2 ring-brand" : "ring-ink/10 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="120px"
                placeholder="blur"
                blurDataURL={blurPlaceholder(img)}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
