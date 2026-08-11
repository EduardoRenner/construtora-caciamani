"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const entrada =
  "mt-2 block min-h-11 w-full border border-noite/20 bg-cal px-3 py-2.5 text-base text-noite focus:border-noite";

export function Campo({
  rotulo,
  valor,
  aoMudar,
  tipo = "text",
  dica,
  obrigatorio,
  className,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo?: "text" | "number" | "email";
  dica?: string;
  obrigatorio?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta block text-concreto">
        {rotulo}
        {obrigatorio ? <span className="ml-1 text-oxido">*</span> : null}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        required={obrigatorio}
        onChange={(e) => aoMudar(e.target.value)}
        className={entrada}
      />
      {dica ? <p className="mt-1.5 text-xs text-concreto">{dica}</p> : null}
    </div>
  );
}

export function Texto({
  rotulo,
  valor,
  aoMudar,
  dica,
  linhas = 4,
  className,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  dica?: string;
  linhas?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta block text-concreto">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={linhas}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className={cn(entrada, "resize-y")}
      />
      {dica ? <p className="mt-1.5 text-xs text-concreto">{dica}</p> : null}
    </div>
  );
}

export function Selecao({
  rotulo,
  valor,
  opcoes,
  aoMudar,
  className,
}: {
  rotulo: string;
  valor: string;
  opcoes: Array<{ id: string; rotulo: string }>;
  aoMudar: (v: string) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta block text-concreto">
        {rotulo}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className={entrada}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Interruptor({
  rotulo,
  dica,
  marcado,
  aoMudar,
}: {
  rotulo: string;
  dica?: string;
  marcado: boolean;
  aoMudar: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={marcado}
        onChange={(e) => aoMudar(e.target.checked)}
        className="mt-1 size-5 shrink-0 accent-noite"
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {rotulo}
        </label>
        {dica ? <p className="mt-1 text-xs text-concreto">{dica}</p> : null}
      </div>
    </div>
  );
}

export function Painel({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-noite/15 bg-cal p-5 md:p-7">
      <h2 className="titulo text-xl">{titulo}</h2>
      {descricao ? (
        <p className="prosa mt-2 text-sm text-concreto">{descricao}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Aviso({
  tom = "erro",
  children,
}: {
  tom?: "erro" | "sucesso";
  children: React.ReactNode;
}) {
  return (
    <p
      role={tom === "erro" ? "alert" : "status"}
      className={cn(
        "border px-4 py-3 text-sm",
        tom === "erro"
          ? "border-oxido/50 text-oxido"
          : "border-noite/30 bg-contraste text-sobre-contraste",
      )}
    >
      {children}
    </p>
  );
}

/** Converte texto de campo numérico para número ou `null`. */
export function paraNumero(valor: string): number | null {
  const limpo = valor.trim().replace(",", ".");
  if (limpo === "") return null;
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : null;
}

/** Gera o endereço da página a partir do título. */
export function paraEndereco(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
