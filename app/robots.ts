import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://meibymithra.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/practice", "/store", "/book", "/intake", "/terms"],
      disallow: ["/admin"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
