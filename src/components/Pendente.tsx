import { MODO_DEMO } from "@/content/demo";
import { cn } from "@/lib/utils";

/**
 * Marcador visível de informação que o cliente ainda não forneceu.
 *
 * Existe para que nenhum número, nome de obra, depoimento ou dado
 * cadastral seja inventado: o que falta aparece na tela como falta.
 * Todo uso deste componente precisa ter linha correspondente no
 * PENDENCIAS.md da raiz.
 *
 * DOIS MODOS
 *
 * Normal (padrão): `⟨PENDENTE: descrição inteira⟩`, do tamanho que for
 * preciso. É um documento de trabalho na tela, e é para incomodar.
 *
 * Demo (`NEXT_PUBLIC_MODO_DEMO=true`): `⟨a confirmar⟩`, curto. O que
 * sobra em modo demo é só o que não pode ser preenchido por conteúdo
 * demonstrativo em hipótese nenhuma — CNPJ, CREA, endereço, razão
 * social, fala do Carlinhos. Numa apresentação isso lê como campo a
 * preencher, que é exatamente o que é; a descrição inteira continua
 * disponível para leitor de tela e para quem inspeciona a página.
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
  // Em modo demo nunca ocupa a largura toda: o marcador não pode ser o
  // elemento mais pesado de uma seção durante a apresentação.
  const comoBloco = bloco && !MODO_DEMO;
  const Tag = comoBloco ? "div" : "span";

  return (
    <Tag
      data-pendente=""
      className={cn(
        // `.pendente` troca de tom conforme a superfície: o óxido escuro
        // sobre fundo `noite` dá 2.78:1 e reprovaria em AA.
        "etiqueta pendente",
        comoBloco
          ? "block px-3 py-2.5"
          : "inline-block px-1.5 py-1 align-middle",
        className,
      )}
    >
      {MODO_DEMO ? (
        <>
          <span className="sr-only">Informação a confirmar: {children}. </span>
          {"⟨"}a confirmar{"⟩"}
        </>
      ) : (
        <>
          <span className="sr-only">Informação pendente: </span>
          {"⟨"}PENDENTE: {children}
          {"⟩"}
        </>
      )}
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
