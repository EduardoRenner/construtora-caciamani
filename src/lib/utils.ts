/**
 * Junta classes condicionais sem trazer dependência extra.
 *
 * ATENÇÃO — isto NÃO é `tailwind-merge`. Classes conflitantes não são
 * resolvidas: elas coexistem no atributo, e quem decide o vencedor é a
 * ORDEM DO CSS GERADO, não a ordem em que foram passadas aqui. No CSS
 * do Tailwind, por exemplo, `.inline-flex` vem depois de `.hidden` —
 * então `cn("inline-flex", "hidden")` resulta num elemento VISÍVEL.
 *
 * Regra prática: nunca passe por `className` uma utilitária que dispute
 * a mesma propriedade com a base do componente (display, cor, padding).
 * Ou a base troca a classe condicionalmente (ver `AlternarTema`), ou a
 * classe vai num elemento próprio (ver o botão do WhatsApp no
 * `Cabecalho`).
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Formata número no padrão brasileiro (1.234). */
export function numeroBR(valor: number): string {
  return new Intl.NumberFormat("pt-BR").format(valor);
}

/** Formata valor em reais, sem centavos (R$ 480.000). */
export function reaisBR(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}

/** Reduz um telefone a apenas dígitos, para montar links wa.me e tel:. */
export function apenasDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}
