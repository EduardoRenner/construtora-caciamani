/** Junta classes condicionais sem trazer dependência extra. */
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
