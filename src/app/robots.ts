import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/site";

/**
 * Trava de indexação enquanto o conteúdo não está pronto.
 *
 * O deploy foi para produção automaticamente (comportamento padrão do
 * primeiro `vercel deploy`), mas o site ainda tem marcadores
 * `⟨PENDENTE⟩`, sem CNPJ nem CREA — publicar isso no Google antes da
 * revisão é pior que não publicar nada. Fica bloqueado até alguém
 * definir `NEXT_PUBLIC_INDEXAR=true` nas variáveis de ambiente da
 * Vercel, quando o conteúdo estiver revisado e o domínio definitivo
 * apontado.
 */
const indexavel = process.env.NEXT_PUBLIC_INDEXAR === "true";

export default function robots(): MetadataRoute.Robots {
  if (!indexavel) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

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
