/**
 * Typed asset manifest — mirrors `assets/images.json` and the files emitted by
 * `npm run images:build`. Keeping it hand-written (rather than generated) means
 * a missing asset fails the type check instead of shipping a broken <img>.
 */
import { withBasePath } from "./site";

export type ImageAsset = {
  /** Path without the width/extension suffix, e.g. "/images/profile/george-s-thomas". */
  base: string;
  widths: number[];
  /** Intrinsic size of the largest variant, used for width/height attributes. */
  width: number;
  height: number;
  alt: string;
  /** Fallback format matching the file on disk. */
  fallback: "jpg" | "png";
};

export const IMAGE_MANIFEST = {
  profilePortrait: {
    base: "/images/profile/george-s-thomas",
    widths: [320, 480, 960],
    width: 960,
    height: 960,
    alt: "Identity card for George S. Thomas showing a GST monogram on a technical grid",
    fallback: "jpg",
  },
  nktGroupLogo: {
    base: "/images/brand/nkt-group-logo",
    widths: [128, 256, 512],
    width: 512,
    height: 512,
    alt: "NKT Group logo mark",
    fallback: "png",
  },
  siteIcon: {
    base: "/images/brand/site-icon",
    widths: [96, 192, 512],
    width: 512,
    height: 512,
    alt: "Monogram icon for George S. Thomas",
    fallback: "png",
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGE_MANIFEST;

/** Build a `srcset` string for one image format. */
export function srcSetFor(asset: ImageAsset, format: string): string {
  return asset.widths
    .map((w) => `${withBasePath(`${asset.base}-${w}.${format}`)} ${w}w`)
    .join(", ");
}

/** Build the `sizes` attribute default: full width on mobile, capped on desktop. */
export function sizesFor(asset: ImageAsset, maxCssWidth = 960): string {
  return `(max-width: ${maxCssWidth}px) 100vw, ${maxCssWidth}px`;
}
