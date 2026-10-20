/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Headless Chromium for PDF export must not be bundled by webpack/turbopack.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // The Chromium binary is read from disk at runtime, so file tracing can't see it.
  outputFileTracingIncludes: {
    "/api/export": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default nextConfig
