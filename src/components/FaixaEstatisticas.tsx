"use client";

import { useEffect, useRef, useState } from "react";
import { Pendente } from "@/components/Pendente";
import { Secao } from "@/components/ui/Secao";
import type { Estatistica } from "@/content/empresa";
import { animarQuadros, prefereMenosMovimento } from "@/lib/animacao";
import { numeroBR } from "@/lib/utils";

/**
 * Faixa de prova. Vem logo depois do hero porque prova vem antes de
 * discurso — é o que faz alguém que nunca ouviu falar da Caciamani
 * continuar rolando.
 *
 * As estatísticas chegam por props: quem lê o banco é a página, no
 * servidor.
 */
export function FaixaEstatisticas({ estatisticas }: { estatisticas: Estatistica[] }) {
  return (
    <Secao tom="noite" cota="prova" espacamento="justo">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {estatisticas.map((estatistica) => (
          <div key={estatistica.rotulo}>
            <dt className="etiqueta text-vidro/75">{estatistica.rotulo}</dt>
            <dd className="mt-3">
              {estatistica.valor === null ? (
                <Pendente>{estatistica.rotulo.toLowerCase()}</Pendente>
              ) : (
                <Contador valor={estatistica.valor} sufixo={estatistica.sufixo} />
              )}
              <p className="mt-2 text-sm text-vidro/70">
                {estatistica.qualificador ?? (
                  <Pendente>frase curta que qualifica o número</Pendente>
                )}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </Secao>
  );
}

/**
 * Conta até o valor uma única vez, quando entra na viewport.
 * Com `prefers-reduced-motion`, mostra o número final direto.
 */
function Contador({ valor, sufixo }: { valor: number; sufixo?: string }) {
  const referencia = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(() => (prefereMenosMovimento() ? valor : 0));

  useEffect(() => {
    const alvo = referencia.current;
    if (!alvo || prefereMenosMovimento()) {
      setAtual(valor);
      return;
    }

    let cancelar: (() => void) | null = null;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        observador.disconnect();
        cancelar = animarQuadros({
          quadros: [0, valor],
          duracao: 1100,
          aoAtualizar: (v) => setAtual(Math.round(v)),
        });
      },
      { threshold: 0.6 },
    );

    observador.observe(alvo);

    return () => {
      observador.disconnect();
      cancelar?.();
    };
  }, [valor]);

  return (
    <span ref={referencia} className="tabular text-4xl text-sobre-contraste md:text-5xl">
      {numeroBR(atual)}
      {sufixo}
    </span>
  );
}
