import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Só o painel fica de fora. Os recortes do portfólio por tipo são
      // páginas próprias e devem ser indexadas: "casas germinadas em
      // Maravilha" é exatamente o tipo de busca que traz cliente.
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${urlSite}/sitemap.xml`,
  };
}
