import type { MetadataRoute } from "next";
import { obterObras } from "@/lib/conteudo";
import { urlSite } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();

  const paginas: MetadataRoute.Sitemap = [
    { url: urlSite, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${urlSite}/obras`, lastModified: agora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${urlSite}/servicos`, lastModified: agora, changeFrequency: "yearly", priority: 0.8 },
    { url: `${urlSite}/orcamento`, lastModified: agora, changeFrequency: "yearly", priority: 0.8 },
    { url: `${urlSite}/sobre`, lastModified: agora, changeFrequency: "yearly", priority: 0.6 },
    { url: `${urlSite}/contato`, lastModified: agora, changeFrequency: "yearly", priority: 0.6 },
  ];

  const obras = await obterObras();
  const tipos = [...new Set(obras.map((obra) => obra.tipo))];

  return [
    ...paginas,
    // Recortes do portfólio por tipo — cada um é uma página estática.
    ...tipos.map((tipo) => ({
      url: `${urlSite}/obras/tipo/${tipo}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...obras.map((obra) => ({
      url: `${urlSite}/obras/${obra.slug}`,
      lastModified: agora,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
