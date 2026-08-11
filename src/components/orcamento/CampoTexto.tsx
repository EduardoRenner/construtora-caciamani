"use client";

import { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

export function CampoTexto({
  rotulo,
  registro,
  erro,
  tipo = "text",
  dica,
  opcional = false,
  autoComplete,
  inputMode,
  className,
}: {
  rotulo: string;
  registro: UseFormRegisterReturn;
  erro?: string;
  tipo?: "text" | "email" | "tel";
  dica?: string;
  opcional?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  className?: string;
}) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;

  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta block text-concreto">
        {rotulo}
        {opcional ? <span className="ml-2 normal-case">(opcional)</span> : null}
      </label>

      <input
        id={id}
        type={tipo}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={erro ? true : undefined}
        aria-describedby={
          [erro ? idErro : null, dica ? idDica : null].filter(Boolean).join(" ") ||
          undefined
        }
        {...registro}
        className={cn(
          // `text-noite` explícito: o campo pode estar dentro de uma seção
          // escura, e sem isto o texto digitado herdaria a cor clara e
          // sumiria no fundo do próprio campo.
          "mt-2.5 block min-h-12 w-full border bg-cal-2 px-4 py-3 text-base text-noite",
          "transition-colors placeholder:text-concreto-claro",
          erro ? "border-oxido" : "border-noite/20 focus:border-noite",
        )}
      />

      {dica ? (
        <p id={idDica} className="mt-2 text-sm text-concreto">
          {dica}
        </p>
      ) : null}

      {erro ? (
        <p id={idErro} role="alert" className="mt-2 text-sm text-oxido">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

export function CampoTextoLongo({
  rotulo,
  registro,
  erro,
  dica,
  linhas = 5,
}: {
  rotulo: string;
  registro: UseFormRegisterReturn;
  erro?: string;
  dica?: string;
  linhas?: number;
}) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;

  return (
    <div>
      <label htmlFor={id} className="etiqueta block text-concreto">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={linhas}
        aria-invalid={erro ? true : undefined}
        aria-describedby={
          [erro ? idErro : null, dica ? idDica : null].filter(Boolean).join(" ") ||
          undefined
        }
        {...registro}
        className={cn(
          "mt-2.5 block w-full resize-y border bg-cal-2 px-4 py-3 text-base text-noite transition-colors",
          erro ? "border-oxido" : "border-noite/20 focus:border-noite",
        )}
      />
      {dica ? (
        <p id={idDica} className="mt-2 text-sm text-concreto">
          {dica}
        </p>
      ) : null}
      {erro ? (
        <p id={idErro} role="alert" className="mt-2 text-sm text-oxido">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Campo-armadilha contra robô de spam.
 *
 * Escondido de gente (fora da tela) e de leitor de tela
 * (`aria-hidden` + `tabIndex={-1}`), mas presente no DOM. Robô que
 * preenche tudo cai nele; o envio é descartado sem CAPTCHA.
 */
export function CampoArmadilha({ registro }: { registro: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="site">Não preencha este campo</label>
      <input id="site" type="text" tabIndex={-1} autoComplete="off" {...registro} />
    </div>
  );
}
