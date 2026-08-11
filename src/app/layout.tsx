import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { scriptDoTema } from "@/components/layout/AlternarTema";
import { empresa } from "@/content/empresa";
import { urlSite } from "@/lib/site";

/**
 * Layout raiz: só o documento, as fontes e os metadados.
 *
 * O cabeçalho e o rodapé do site NÃO vivem aqui — eles são do grupo
 * `(site)`. Sem essa separação, o painel admin herdaria o menu público
 * e o botão flutuante de WhatsApp.
 *
 * Três papéis tipográficos, self-hosted pelo next/font (zero requisição
 * a terceiros, zero layout shift):
 * - display: Archivo, desenhada na grade, cara de sinalização de obra
 * - corpo: Instrument Sans, humanista e legível (deliberadamente não Inter)
 * - técnica: IBM Plex Mono, para TODO número — m², prazos, valores.
 *
 * `display: "optional"` e não `"swap"`: com swap, o navegador desenha a
 * página na fonte de reserva e depois troca, e a troca movia o hero
 * inteiro — 0,12 de CLS medido, acima do limite de 0,1 do Google. Com
 * optional, se a fonte não chegar em ~100 ms o navegador simplesmente
 * mantém a reserva naquele carregamento e não há troca nenhuma. Quem
 * volta ao site já tem a fonte em cache e vê a tipografia real.
 */
const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "optional",
});

const corpo = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-corpo",
  display: "optional",
});

const tecnica = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-tecnica",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlSite),
  title: {
    default: `${empresa.nome} — construção de casas e prédios em ${empresa.cidadeSede}/${empresa.uf}`,
    template: `%s — ${empresa.nome}`,
  },
  description: `Construtora e incorporadora em ${empresa.cidadeSede}, Santa Catarina. Projeto e construção de casas, casas germinadas e prédios em ${empresa.cidadeSede} e região.`,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: empresa.nome,
    url: urlSite,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A1826" },
    { media: "(prefers-color-scheme: light)", color: "#0A1826" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      // O tema escuro é o padrão do servidor. Quem já escolheu "claro"
      // tem o atributo corrigido pelo script abaixo, antes da pintura.
      data-tema="escuro"
      // O script inline mexe em `data-tema` e acrescenta a classe `js`
      // ANTES do React hidratar — é justamente esse o objetivo, para não
      // piscar. Sem isto o React acusa divergência e avisa que não vai
      // corrigir; pior, o aviso esconderia divergências de verdade.
      suppressHydrationWarning
      className={`${display.variable} ${corpo.variable} ${tecnica.variable}`}
    >
      <head>
        {/* Precisa ser inline e síncrono: qualquer coisa assíncrona aqui
            deixaria a página piscar do escuro para o claro na frente de
            quem escolheu o claro. Também é ele que marca `html.js`, de
            que dependem as revelações. */}
        <script dangerouslySetInnerHTML={{ __html: scriptDoTema }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
