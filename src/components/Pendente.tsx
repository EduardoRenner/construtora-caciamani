import { cn } from "@/lib/utils";

/**
 * Marcador visível de informação que o cliente ainda não forneceu.
 *
 * Existe para que nenhum número, nome de obra, depoimento ou dado
 * cadastral seja inventado: o que falta aparece na tela como falta.
 * Todo uso deste componente precisa ter linha correspondente no
 * PENDENCIAS.md da raiz.
 */
export function Pendente({
  children,
  className,
  bloco = false,
}: {
  /** O que está faltando, em linguagem que o cliente entenda. */
  children: React.ReactNode;
  className?: string;
  /** `true` renderiza como bloco de largura cheia, para áreas de texto. */
  bloco?: boolean;
}) {
  const Tag = bloco ? "div" : "span";

  return (
    <Tag
      data-pendente=""
      className={cn(
        // `.pendente` troca de tom conforme a superfície: o óxido escuro
        // sobre fundo `noite` dá 2.78:1 e reprovaria em AA.
        "etiqueta pendente",
        bloco ? "block px-3 py-2.5" : "inline-block px-1.5 py-1 align-middle",
        className,
      )}
    >
      <span className="sr-only">Informação pendente: </span>
      {"⟨"}PENDENTE: {children}
      {"⟩"}
    </Tag>
  );
}

/**
 * Imagem que ainda não existe. Mantém a proporção correta para que o
 * layout já seja avaliado sem foto, e deixa claro o que precisa entrar.
 * Não usamos banco de imagem nem imagem gerada.
 */
export function FotoPendente({
  descricao,
  proporcao = "4 / 3",
  className,
}: {
  descricao: string;
  /** Proporção CSS, ex.: "16 / 9", "3 / 4". */
  proporcao?: string;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: proporcao }}
      className={cn(
        "relative flex w-full items-end overflow-hidden bg-vidro/50",
        "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)]",
        className,
      )}
    >
      <div className="relative m-3 max-w-full">
        <Pendente bloco>foto — {descricao}</Pendente>
      </div>
    </div>
  );
}
