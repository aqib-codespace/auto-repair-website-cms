import { getSiteSettings } from "@/db/queries/content";

export default async function robots() {
  const settings = await getSiteSettings();
  const base = settings.siteUrl.replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
