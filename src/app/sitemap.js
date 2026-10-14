import { getSiteSettings } from "@/db/queries/content";

export default async function sitemap() {
  const settings = await getSiteSettings();
  const base = settings.siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
