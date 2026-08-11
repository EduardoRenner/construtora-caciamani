"use client";

import { useState } from "react";
import { marcarLeadAtendido } from "@/acoes/admin";
import { IconeWhatsApp } from "@/components/ui/Icones";
import type { LinhaLead } from "@/lib/dadosAdmin";
import { apenasDigitos, reaisBR } from "@/lib/utils";

const rotulosOrigem: Record<string, string> = {
  orcamento: "Simulador de orçamento",
  contato: "Formulário de contato",
  obra: "Página de uma obra",
};

function dataBR(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Escapa um campo para CSV: aspas dobradas e o todo entre aspas. */
function campoCsv(valor: unknown): string {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  return `"${texto.replace(/"/g, '""')}"`;
}

export function ListaLeads({ leads }: { leads: LinhaLead[] }) {
  const [lista, setLista] = useState(leads);
  const [origem, setOrigem] = useState("todos");
  const [periodo, setPeriodo] = useState("todos");

  const agora = Date.now();
  const dias = { "7": 7, "30": 30, "90": 90 }[periodo];

  const filtrados = lista.filter((lead) => {
    if (origem !== "todos" && lead.origem !== origem) return false;
    if (dias && new Date(lead.criado_em).getTime() < agora - dias * 86400000) {
      return false;
    }
    return true;
  });

  async function alternarAtendido(lead: LinhaLead) {
    const novo = !lead.atendido;
    setLista((atual) =>
      atual.map((l) => (l.id === lead.id ? { ...l, atendido: novo } : l)),
    );
    const resposta = await marcarLeadAtendido(lead.id, novo);
    if (!resposta.ok) {
      // Desfaz se o banco recusou, para a tela não mentir.
      setLista((atual) =>
        atual.map((l) => (l.id === lead.id ? { ...l, atendido: !novo } : l)),
      );
    }
  }

  function baixarCsv() {
    const colunas = [
      "Data", "Origem", "Nome", "WhatsApp", "E-mail", "Cidade",
      "Tipo de obra", "Área (m²)", "Padrão", "Estimativa mínima",
      "Estimativa máxima", "Obra", "Mensagem", "Atendido",
    ];

    const linhas = filtrados.map((l) => [
      dataBR(l.criado_em),
      rotulosOrigem[l.origem] ?? l.origem,
      l.nome, l.telefone, l.email, l.cidade,
      l.tipo_construcao, l.area_m2, l.padrao_acabamento,
      l.estimativa_minima, l.estimativa_maxima,
      l.obra_slug, l.mensagem,
      l.atendido ? "sim" : "não",
    ]);

    // O BOM (﻿) faz o Excel em português abrir o arquivo em UTF-8.
    // Sem ele, todo acento vira caractere estranho.
    const csv =
      "﻿" +
      [colunas, ...linhas].map((linha) => linha.map(campoCsv).join(";")).join("\r\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const ancora = document.createElement("a");
    ancora.href = url;
    ancora.download = `contatos-caciamani-${new Date().toISOString().slice(0, 10)}.csv`;
    ancora.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="filtro-origem" className="etiqueta block text-concreto">
            De onde veio
          </label>
          <select
            id="filtro-origem"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="mt-2 min-h-11 border border-noite/20 bg-cal px-3 text-base"
          >
            <option value="todos">Todos</option>
            <option value="orcamento">Simulador de orçamento</option>
            <option value="contato">Formulário de contato</option>
            <option value="obra">Página de uma obra</option>
          </select>
        </div>

        <div>
          <label htmlFor="filtro-periodo" className="etiqueta block text-concreto">
            Período
          </label>
          <select
            id="filtro-periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="mt-2 min-h-11 border border-noite/20 bg-cal px-3 text-base"
          >
            <option value="todos">Desde sempre</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>

        <button
          type="button"
          onClick={baixarCsv}
          disabled={filtrados.length === 0}
          className="etiqueta ml-auto min-h-11 border border-noite/25 px-4 disabled:opacity-40"
        >
          Baixar planilha
        </button>
      </div>

      <p aria-live="polite" className="etiqueta mt-6 text-concreto">
        {filtrados.length}{" "}
        {filtrados.length === 1 ? "contato" : "contatos"}
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {filtrados.map((lead) => (
          <li
            key={lead.id}
            className={`border bg-cal p-5 ${
              lead.atendido ? "border-noite/10 opacity-60" : "border-noite/20"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="titulo text-lg">{lead.nome}</p>
                <p className="etiqueta mt-1.5 text-concreto">
                  {rotulosOrigem[lead.origem] ?? lead.origem} · {dataBR(lead.criado_em)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`https://wa.me/55${apenasDigitos(lead.telefone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="etiqueta inline-flex min-h-11 items-center gap-2 bg-contraste px-3 text-sobre-contraste"
                >
                  <IconeWhatsApp className="size-4 text-marca" />
                  Responder
                </a>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 border border-noite/20 px-3">
                  <input
                    type="checkbox"
                    checked={lead.atendido}
                    onChange={() => alternarAtendido(lead)}
                    className="size-4 accent-noite"
                  />
                  <span className="etiqueta">Atendido</span>
                </label>
              </div>
            </div>

            <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              <Par rotulo="WhatsApp" valor={lead.telefone} />
              {lead.email ? <Par rotulo="E-mail" valor={lead.email} /> : null}
              {lead.cidade ? <Par rotulo="Cidade" valor={lead.cidade} /> : null}
              {lead.tipo_construcao ? (
                <Par rotulo="Tipo de obra" valor={lead.tipo_construcao} />
              ) : null}
              {lead.area_m2 ? <Par rotulo="Área" valor={`${lead.area_m2} m²`} /> : null}
              {lead.padrao_acabamento ? (
                <Par rotulo="Padrão" valor={lead.padrao_acabamento} />
              ) : null}
              {lead.estimativa_minima && lead.estimativa_maxima ? (
                <Par
                  rotulo="Estimativa que ele viu"
                  valor={`${reaisBR(lead.estimativa_minima)} a ${reaisBR(lead.estimativa_maxima)}`}
                />
              ) : null}
              {lead.obra_slug ? <Par rotulo="Obra" valor={lead.obra_slug} /> : null}
            </dl>

            {lead.mensagem ? (
              <p className="prosa mt-4 border-l-2 border-marca pl-4 text-sm">
                {lead.mensagem}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Par({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-concreto">{rotulo}:</dt>
      <dd className="tabular">{valor}</dd>
    </div>
  );
}
