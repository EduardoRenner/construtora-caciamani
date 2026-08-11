"use client";

import { useId } from "react";
import { faixaArea } from "@/config/orcamento";
import { numeroBR } from "@/lib/utils";

/**
 * Área construída: slider + campo numérico, sempre em sincronia.
 *
 * O auxílio visual é a raiz quadrada da área — o lado do quadrado
 * equivalente. É a única referência de tamanho que dá para dar sem
 * inventar nada: pura geometria, e "13 × 13 metros" é muito mais
 * tangível para o cliente do que "180 m²".
 */
export function CampoArea({
  valor,
  aoMudar,
  erro,
}: {
  valor: number;
  aoMudar: (novo: number) => void;
  erro?: string;
}) {
  const id = useId();
  const idErro = `${id}-erro`;

  const lado = Math.sqrt(valor);
  const proporcao = Math.min(
    1,
    Math.sqrt(valor / faixaArea.maximo),
  );

  return (
    // O campo numérico e o slider controlam o mesmo valor, então são um
    // grupo de verdade — `fieldset` + `legend` é a marcação correta.
    <fieldset>
      <legend className="titulo text-2xl md:text-4xl">
        Qual a área aproximada?
      </legend>
      <p className="prosa mt-4 text-concreto">
        Área construída, somando todos os pavimentos. Não precisa ser exata —
        dá para ajustar depois.
      </p>

      <div className="mt-10 flex flex-wrap items-end gap-6">
        <div>
          <label htmlFor={id} className="etiqueta block text-concreto">
            Área construída
          </label>
          <div className="mt-2.5 flex items-baseline gap-2">
            <input
              id={id}
              type="number"
              value={valor}
              min={faixaArea.minimo}
              max={faixaArea.maximo}
              step={faixaArea.passo}
              inputMode="numeric"
              aria-invalid={erro ? true : undefined}
              aria-describedby={erro ? idErro : undefined}
              onChange={(evento) => aoMudar(Number(evento.target.value))}
              className="tabular w-32 border border-noite/20 bg-cal-2 px-3 py-2.5 text-3xl focus:border-noite"
            />
            <span className="tabular text-xl text-concreto">m²</span>
          </div>
        </div>

        <p className="tabular pb-3 text-sm text-concreto">
          equivale a um quadrado de{" "}
          <strong className="font-medium text-noite">
            {lado.toFixed(1).replace(".", ",")} × {lado.toFixed(1).replace(".", ",")} m
          </strong>
        </p>
      </div>

      <input
        type="range"
        value={valor}
        min={faixaArea.minimo}
        max={faixaArea.maximo}
        step={faixaArea.passo}
        aria-label="Área construída, em metros quadrados"
        onChange={(evento) => aoMudar(Number(evento.target.value))}
        className="mt-8 h-11 w-full accent-marca-escura"
      />

      <div className="tabular flex justify-between text-xs text-concreto">
        <span>{numeroBR(faixaArea.minimo)} m²</span>
        <span>{numeroBR(faixaArea.maximo)} m²</span>
      </div>

      {/* Quadrado proporcional: a área cresce visualmente junto do número. */}
      <div
        aria-hidden="true"
        className="mt-10 flex h-44 items-end border-b border-noite/15"
      >
        <div
          className="border border-marca-escura bg-marca/15 transition-all duration-300 ease-obra"
          style={{
            width: `${Math.max(6, proporcao * 100)}%`,
            height: `${Math.max(6, proporcao * 100)}%`,
            maxWidth: "11rem",
            maxHeight: "11rem",
          }}
        />
      </div>

      {erro ? (
        <p id={idErro} role="alert" className="mt-4 text-sm text-oxido">
          {erro}
        </p>
      ) : null}
    </fieldset>
  );
}
