// Optimized image component with lazy loading, blur placeholder and loader.
// Uses Next.js Image with optimized settings for mobile performance.

"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends Omit<ImageProps, "onLoad" | "placeholder"> {
  className?: string;
  loaderClassName?: string;
}

export function ImageWithLoader({
  src,
  alt,
  className,
  loaderClassName,
  fill,
  sizes,
  ...props
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn("relative overflow-hidden bg-paper", !isLoaded && "animate-pulse", className)}>
      {!isLoaded && (
        <div className={cn("absolute inset-0 flex items-center justify-center", loaderClassName)}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      )}
      {isVisible && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
          onLoad={handleLoad}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
    </div>
  );
}
