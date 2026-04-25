import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://meibymithra.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/practice", "/store", "/book", "/intake", "/terms"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date()
  }));
}
