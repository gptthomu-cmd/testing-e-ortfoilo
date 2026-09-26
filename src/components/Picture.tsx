/**
 * Responsive <Picture>: AVIF → WebP → fallback, explicit dimensions to avoid
 * layout shift (CLS), lazy loading below the fold, eager + high priority for
 * the LCP image.
 *
 * The site is a static export, so Next's image optimiser is unavailable — this
 * component serves the pre-generated variants instead, which is faster (no
 * optimiser round trip) and keeps Core Web Vitals stable.
 */
import type { CSSProperties } from "react";
import { withBasePath } from "@/lib/site";
import { IMAGE_MANIFEST, srcSetFor, sizesFor, type ImageAsset, type ImageKey } from "@/lib/images";

type PictureProps = {
  /** Either a manifest key or an explicit asset descriptor. */
  asset?: ImageKey;
  image?: ImageAsset;
  /** Plain file path, used for single-size images such as OG cards / diagrams. */
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Picture({
  asset,
  image,
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
  style,
}: PictureProps) {
  const resolved: ImageAsset | undefined = image || (asset ? IMAGE_MANIFEST[asset] : undefined);

  // Single-file image (diagram, SVG, OG card) — still gets explicit dimensions.
  if (!resolved) {
    if (!src) throw new Error("Picture requires `asset`, `image` or `src`");
    return (
      <img
        src={withBasePath(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        style={style}
      />
    );
  }

  const w = width ?? resolved.width;
  const h = height ?? resolved.height;

  return (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(resolved, "avif")} sizes={sizes ?? sizesFor(resolved)} />
      <source type="image/webp" srcSet={srcSetFor(resolved, "webp")} sizes={sizes ?? sizesFor(resolved)} />
      <img
        src={withBasePath(`${resolved.base}-${resolved.widths[resolved.widths.length - 1]}.${resolved.fallback}`)}
        srcSet={srcSetFor(resolved, resolved.fallback)}
        sizes={sizes ?? sizesFor(resolved)}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        style={style}
      />
    </picture>
  );
}
