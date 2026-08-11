import { empresa } from "@/content/empresa";

/** URL canônica. Trocar quando o domínio definitivo for registrado. */
export const urlSite =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://construtoracaciamani.com.br";

export const navegacao = [
  { href: "/obras", rotulo: "Obras" },
  { href: "/servicos", rotulo: "Serviços" },
  { href: "/sobre", rotulo: "A construtora" },
  { href: "/orcamento", rotulo: "Orçamento" },
  { href: "/contato", rotulo: "Contato" },
] as const;

/**
 * Monta o link do WhatsApp com a mensagem já escrita.
 * O texto passa por encodeURIComponent para não quebrar em acento,
 * quebra de linha ou emoji.
 */
export function linkWhatsApp(mensagem?: string): string {
  const numero = empresa.telefones.principal.internacional;
  const base = `https://wa.me/${numero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

/** Mensagem padrão do botão flutuante e dos CTAs genéricos. */
export const mensagemPadraoWhatsApp =
  "Olá! Vim pelo site da Construtora Caciamani e gostaria de conversar sobre uma obra.";
