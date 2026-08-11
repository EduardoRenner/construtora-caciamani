import { cn } from "@/lib/utils";

/**
 * Entradas para conteúdo ACIMA DA DOBRA.
 *
 * Diferente de `Revelar`, não usam IntersectionObserver: o que já está
 * na tela não precisa esperar rolagem, e o observador só passa a existir
 * depois da hidratação. Sendo CSS puro, estes componentes rodam sem
 * hidratar e não vão para o bundle do cliente.
 */
export function Entrada({
  children,
  atraso = 0,
  className,
}: {
  children: React.ReactNode;
  /** Atraso em ms, para escalonar irmãos. */
  atraso?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("entrar", className)}
      style={atraso ? ({ "--atraso": `${atraso}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Título que sobe palavra por palavra.
 *
 * Só no `h1` do hero: é o único lugar do site onde vale gastar essa
 * ousadia. Repetido em cada seção viraria ruído.
 *
 * As palavras são `<span>` dentro do mesmo heading, com espaços reais
 * entre elas — o leitor de tela continua lendo uma frase só, e o texto
 * está inteiro no HTML servido.
 *
 * A animação mexe SÓ no transform. Este h1 é o elemento de LCP da home:
 * enquanto ele estiver transparente o navegador não conta a maior
 * pintura, e animar opacidade aqui custou 750 ms de LCP na medição.
 */
export function TituloEntrada({
  texto,
  className,
  atrasoPorPalavra = 70,
}: {
  texto: string;
  className?: string;
  atrasoPorPalavra?: number;
}) {
  const palavras = texto.split(" ");

  return (
    <h1 className={className}>
      {palavras.map((palavra, indice) => (
        <span key={`${palavra}-${indice}`}>
          <span
            className="palavra"
            style={{ "--atraso": `${indice * atrasoPorPalavra}ms` } as React.CSSProperties}
          >
            {palavra}
          </span>
          {indice < palavras.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
