import Image from "next/image";
import { Pendente } from "@/components/Pendente";
import { empresa } from "@/content/empresa";

/**
 * Retrato do dono da construtora. Aparece na home e em `/sobre` — daí
 * viver num componente só: são duas telas que precisam concordar sobre
 * o que fazer quando a foto não existe.
 *
 * A foto é real e vem de `empresa.ts`, não de `demo.ts`: ela continua no
 * ar quando o modo demonstração for desligado. Se um dia for removida
 * de lá, a pendência volta sozinha, sem tocar nestas duas páginas.
 */
export function RetratoProprietario({
  className,
  /**
   * `true` onde a foto entra perto do topo. Em `/sobre` ela é o elemento
   * de LCP (medido: 2,86 s com carga preguiçosa) porque aparece logo na
   * segunda seção; na home ela fica na sétima, bem abaixo da dobra, e aí
   * carregar adiantado só rouba banda do que está na tela.
   */
  prioridade = false,
}: {
  className?: string;
  prioridade?: boolean;
}) {
  const { foto, nome } = empresa.proprietario;

  if (!foto) {
    return (
      <div
        aria-hidden="true"
        className={`relative aspect-3/4 w-full bg-vidro/50 bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)] ${className ?? ""}`}
      >
        <div className="absolute inset-x-3 bottom-3">
          <Pendente bloco>retrato do Carlinhos, na obra</Pendente>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-3/4 w-full overflow-hidden bg-vidro/30 ${className ?? ""}`}>
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        // A coluna trava em 24rem no desktop; abaixo disso ocupa quase
        // toda a largura do conteúdo.
        sizes="(min-width: 1024px) 24rem, 90vw"
        priority={prioridade}
        className="object-cover"
      />

      {/* O nome fica sobre a foto, não abaixo: a parte de baixo da
          imagem é lisa (a mesa e o suéter), então o texto assenta ali
          sem cobrir o rosto nem a placa da empresa. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
        <p className="etiqueta text-white">{nome}</p>
      </div>
    </div>
  );
}
