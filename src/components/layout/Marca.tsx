import { cn } from "@/lib/utils";
import { empresa } from "@/content/empresa";

/**
 * Assinatura da marca em tipo.
 *
 * A Caciamani JÁ TEM logo (monograma amarelo de volumes de edifício +
 * wordmark), mas só existe em raster no material público. Até o arquivo
 * vetorial chegar, usamos a estrutura correta do wordmark — nome +
 * descritor — desenhada em Archivo. Não inventamos um monograma novo:
 * seria substituir a marca real do cliente por outra.
 *
 * Ver PENDENCIAS.md → "Logo em vetor".
 */
export function Marca({
  className,
  claro = false,
}: {
  className?: string;
  /** `true` para superfícies escuras. */
  claro?: boolean;
}) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "titulo text-lg tracking-[0.02em] md:text-xl",
          claro ? "text-sobre-contraste" : "text-noite",
        )}
      >
        {empresa.nomeCurto}
      </span>
      <span
        className={cn(
          // 11px em vez de 9px: o descritor é pequeno de propósito, mas
          // 9px é ilegível no celular.
          "etiqueta mt-1 text-[0.6875rem] tracking-[0.24em]",
          claro ? "text-vidro/70" : "text-concreto",
        )}
      >
        {empresa.assinatura}
      </span>
    </span>
  );
}
