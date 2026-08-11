"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface Opcao {
  id: string;
  rotulo: string;
  descricao?: string;
  itens?: string[];
}

/**
 * Grupo de escolha única em formato de cartão.
 *
 * Por baixo são `input[type=radio]` de verdade dentro de um `fieldset`
 * com `legend`: setas do teclado navegam sozinhas, o leitor de tela
 * anuncia "opção 2 de 6" sem ajuda, e o formulário funcionaria num POST
 * comum. O cartão é só a aparência, via `peer`.
 */
export function CampoOpcoes({
  legenda,
  descricao,
  opcoes,
  registro,
  erro,
  colunas = 2,
}: {
  legenda: string;
  descricao?: string;
  opcoes: Opcao[];
  registro: UseFormRegisterReturn;
  erro?: string;
  colunas?: 1 | 2 | 3;
}) {
  const grade = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
  }[colunas];

  return (
    <fieldset>
      <legend className="titulo text-2xl md:text-4xl">{legenda}</legend>
      {descricao ? (
        <p className="prosa mt-4 text-concreto">{descricao}</p>
      ) : null}

      <div className={cn("mt-8 grid gap-3", grade)}>
        {opcoes.map((opcao) => (
          <label key={opcao.id} className="relative block cursor-pointer">
            <input
              type="radio"
              value={opcao.id}
              {...registro}
              className="peer sr-only"
              aria-describedby={erro ? `${registro.name}-erro` : undefined}
            />
            <span
              className={cn(
                "flex h-full flex-col border p-5 transition-colors",
                "border-noite/20 bg-cal-2",
                "peer-hover:border-noite/50",
                "peer-checked:border-noite peer-checked:bg-contraste peer-checked:text-sobre-contraste",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-noite",
              )}
            >
              <span className="titulo text-lg">{opcao.rotulo}</span>

              {/* Cor por opacidade, não por classe: `peer-checked:` só
                  alcança irmãos do input, não os descendentes deles.
                  Herdando a cor, o texto acompanha a inversão do cartão. */}
              {opcao.descricao ? (
                <span className="mt-2 text-sm opacity-75">{opcao.descricao}</span>
              ) : null}

              {opcao.itens ? (
                <span className="mt-4 flex flex-col gap-2">
                  {opcao.itens.map((item) => (
                    <span key={item} className="flex gap-2.5 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-px w-3 shrink-0 bg-marca"
                      />
                      {item}
                    </span>
                  ))}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>

      {erro ? (
        <p id={`${registro.name}-erro`} role="alert" className="mt-4 text-sm text-oxido">
          {erro}
        </p>
      ) : null}
    </fieldset>
  );
}
