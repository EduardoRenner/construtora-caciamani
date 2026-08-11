/**
 * Elevação em linha que se desenha sobre a foto do hero.
 *
 * É a metade "traço" do conceito "do traço à obra": o desenho técnico
 * aparece primeiro e assenta sobre o prédio construído. Dramatiza
 * exatamente o que a empresa vende — transformar desenho em prédio.
 *
 * A animação é CSS puro (`stroke-dashoffset` com `pathLength="1"`), roda
 * UMA vez e termina em `forwards`. Sob `prefers-reduced-motion` a regra
 * global zera a duração e o desenho aparece pronto e estático — que é o
 * comportamento correto, não a ausência dele.
 *
 * ⟨PENDENTE⟩ Esta é uma elevação genérica de prédio residencial, na
 * massa do edifício que a Caciamani mostra no Instagram. Se existir o
 * desenho real do projeto, ele deve substituir este traçado.
 */
export function ElevacaoTraco({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 430"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Linha do terreno */}
      <path className="traco" pathLength="1" style={{ animationDelay: "0ms" }} d="M4 412H316" />

      {/* Volume principal e platibanda */}
      <path
        className="traco"
        pathLength="1"
        style={{ animationDelay: "120ms" }}
        d="M58 412V96h204v316"
      />
      <path
        className="traco"
        pathLength="1"
        style={{ animationDelay: "300ms" }}
        d="M48 96v-14h224v14"
      />

      {/* Lajes */}
      {[158, 220, 282, 344].map((y, indice) => (
        <path
          key={y}
          className="traco"
          pathLength="1"
          style={{ animationDelay: `${420 + indice * 90}ms` }}
          d={`M58 ${y}h204`}
        />
      ))}

      {/* Sacadas — coluna da esquerda, avançadas em relação à fachada */}
      {[112, 174, 236, 298].map((y, indice) => (
        <path
          key={`sacada-${y}`}
          className="traco"
          pathLength="1"
          style={{ animationDelay: `${560 + indice * 90}ms` }}
          d={`M58 ${y}h56v34H58`}
        />
      ))}

      {/* Esquadrias — malha da direita */}
      {[112, 174, 236, 298].map((y, linha) =>
        [140, 186, 232].map((x, coluna) => (
          <path
            key={`janela-${y}-${x}`}
            className="traco"
            pathLength="1"
            style={{ animationDelay: `${700 + linha * 80 + coluna * 40}ms` }}
            d={`M${x} ${y}h30v34h-30z`}
          />
        )),
      )}

      {/* Térreo: acesso e garagem */}
      <path
        className="traco"
        pathLength="1"
        style={{ animationDelay: "1080ms" }}
        d="M96 412v-46h56v46"
      />
      <path
        className="traco"
        pathLength="1"
        style={{ animationDelay: "1160ms" }}
        d="M178 412v-30h84v30"
      />

      {/* Cota de altura, à esquerda — a mesma linguagem do resto do site */}
      <g style={{ stroke: "var(--color-marca)" }}>
        <path
          className="traco"
          pathLength="1"
          style={{ animationDelay: "1240ms" }}
          d="M28 82v330"
        />
        <path
          className="traco"
          pathLength="1"
          style={{ animationDelay: "1320ms" }}
          d="M20 82h16M20 412h16"
        />
      </g>
    </svg>
  );
}
