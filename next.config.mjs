/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Without this, Turbopack tries to bundle sharp's native binary itself
  // and picks the wrong (wasm32) build, crashing at runtime. This tells it
  // to leave `require("sharp")` alone and let Node resolve it normally.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
