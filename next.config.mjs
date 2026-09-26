/**
 * Next.js configuration.
 *
 * The site is a fully static export (`output: "export"`) so it can be hosted on
 * GitHub Pages with no server runtime. That keeps hosting free, HTTPS automatic,
 * and Core Web Vitals as fast as possible (pre-rendered HTML + hashed assets).
 *
 * BASE PATH
 * ---------
 * `gptthomu-cmd.github.io/testing-e-ortfoilo` is a GitHub *project* site, so every
 * URL lives under the `/testing-e-ortfoilo` path prefix. That prefix is injected
 * only for the Pages build (`npm run build:pages`) via NEXT_PUBLIC_BASE_PATH.
 * Local development and custom-domain deploys use the empty prefix, so
 * `/about/` stays `/about/`.
 *
 * @type {import('next').NextConfig}
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  // Directory-style URLs (/about/ -> /about/index.html) are what GitHub Pages serves.
  trailingSlash: true,
  basePath,
  reactStrictMode: true,
  poweredByHeader: false,
  // Static export has no image server, so images are pre-optimised at build time by
  // `npm run images:optimize` and served through the responsive <Picture /> component.
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
