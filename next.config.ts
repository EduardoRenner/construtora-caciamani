import type { NextConfig } from "next";

/**
 * Domínio do Storage do Supabase, extraído da própria URL do projeto —
 * não fica hardcoded, então funciona com qualquer projeto que for
 * configurado em `NEXT_PUBLIC_SUPABASE_URL`.
 *
 * Por que isto é necessário: toda foto do site público passa pelo
 * otimizador de imagem do Next (`next/image` sem `unoptimized`), e o
 * Next recusa qualquer domínio que não esteja explicitamente liberado
 * aqui — devolve 400 no pedido da imagem. Sem esta configuração, a
 * PRIMEIRA foto que o Carlos subir pelo painel (que fica hospedada no
 * Storage do Supabase, em `*.supabase.co`) quebraria em toda página
 * pública que a exibisse. Hoje isso não aparece nos testes porque as
 * únicas fotos no ar são arquivos locais em `/public/obras`.
 */
function hostnameSupabase(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const host = hostnameSupabase();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: host
      ? [
          {
            protocol: "https",
            hostname: host,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },

  // Cabeçalhos de segurança básicos. Uma CSP completa fica de fora de
  // propósito: o script inline do tema (ver layout.tsx) e o mapa
  // incorporado sob demanda exigiriam nonce ou lista de domínios que eu
  // não consigo validar ao vivo sem um ambiente publicado de verdade —
  // arriscado demais para configurar às cegas. Ver PENDENCIAS.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // O painel é o único ponto que autentica — vale a barreira extra
        // contra clickjacking que o resto do site não precisa.
        source: "/admin/:path*",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },
};

export default nextConfig;
