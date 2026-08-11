"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { moverEstagioLead, type EstagioLead } from "@/acoes/admin";
import type { LinhaLead } from "@/lib/dadosAdmin";
import { reaisBR } from "@/lib/utils";

export const rotulosEstagio: Record<EstagioLead, string> = {
  novo: "Novo",
  contatado: "Contatado",
  orcamento_enviado: "Orçamento enviado",
  fechado: "Fechado",
  perdido: "Perdido",
};

const colunas = Object.keys(rotulosEstagio) as EstagioLead[];

/**
 * Funil de clientes, em colunas.
 *
 * Arrastar-e-soltar move o card entre estágios — é o que vende visita
 * numa demonstração. Mas arrastar não funciona por teclado nem leitor de
 * tela, então cada card também tem um `<select>` de estágio: mesma ação,
 * caminho acessível. Nenhum dos dois é o "modo secundário" — são a mesma
 * função por duas entradas.
 */
export function QuadroClientes({ leads: leadsIniciais }: { leads: LinhaLead[] }) {
  const [leads, setLeads] = useState(leadsIniciais);
  const arrastado = useRef<string | null>(null);
  const router = useRouter();

  async function mover(id: string, estagio: EstagioLead) {
    const anterior = leads;
    setLeads((atual) => atual.map((l) => (l.id === id ? { ...l, estagio } : l)));

    const resposta = await moverEstagioLead(id, estagio);
    if (!resposta.ok) {
      setLeads(anterior);
      alert(resposta.erro ?? "Não foi possível mover o cliente.");
    } else {
      router.refresh();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-[16rem]">
      {colunas.map((estagio) => {
        const doEstagio = leads.filter((l) => l.estagio === estagio);
        return (
          <div
            key={estagio}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (arrastado.current) mover(arrastado.current, estagio);
              arrastado.current = null;
            }}
            className="flex min-h-24 flex-col gap-3 border border-noite/15 bg-cal-2 p-3"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="etiqueta text-noite">{rotulosEstagio[estagio]}</h2>
              <span className="tabular text-xs text-concreto">{doEstagio.length}</span>
            </div>

            {doEstagio.length === 0 ? (
              <p className="text-xs text-concreto-claro">Nenhum cliente aqui.</p>
            ) : (
              doEstagio.map((lead) => (
                <article
                  key={lead.id}
                  draggable
                  onDragStart={() => (arrastado.current = lead.id)}
                  className="border border-noite/15 bg-cal p-3 shadow-sm"
                >
                  <Link
                    href={`/admin/clientes/${lead.id}`}
                    className="titulo block text-sm underline-offset-2 hover:underline"
                  >
                    {lead.nome}
                  </Link>
                  <p className="mt-1 text-xs text-concreto">
                    {lead.cidade ?? "cidade não informada"}
                  </p>
                  {lead.estimativa_minima && lead.estimativa_maxima ? (
                    <p className="tabular mt-1 text-xs text-concreto">
                      {reaisBR(lead.estimativa_minima)} – {reaisBR(lead.estimativa_maxima)}
                    </p>
                  ) : null}

                  <label className="sr-only" htmlFor={`estagio-${lead.id}`}>
                    Estágio de {lead.nome}
                  </label>
                  <select
                    id={`estagio-${lead.id}`}
                    value={lead.estagio}
                    onChange={(e) => mover(lead.id, e.target.value as EstagioLead)}
                    className="etiqueta mt-2.5 block w-full min-h-9 border border-noite/20 bg-cal-2 px-2 text-xs"
                  >
                    {colunas.map((c) => (
                      <option key={c} value={c}>
                        {rotulosEstagio[c]}
                      </option>
                    ))}
                  </select>
                </article>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
