import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/wallah-admin", "/wallah-admin/*", "/api/*"],
      },
    ],
    sitemap: "https://onlinewallah.com/sitemap.xml",
  };
}
