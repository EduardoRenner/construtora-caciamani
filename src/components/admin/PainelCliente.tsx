"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  apagarCliente,
  apagarTarefa,
  concluirTarefa,
  criarTarefa,
  moverEstagioLead,
  registrarInteracao,
  type EstagioLead,
  type TipoInteracao,
} from "@/acoes/admin";
import { Aviso, Campo, Painel, Selecao, Texto } from "@/components/admin/Campos";
import { rotulosEstagio } from "@/components/admin/QuadroClientes";
import { Botao } from "@/components/ui/Botao";
import type { LinhaInteracao, LinhaLead, LinhaTarefa } from "@/lib/dadosAdmin";

const rotulosTipo: Record<TipoInteracao, string> = {
  ligacao: "Ligação",
  whatsapp: "WhatsApp",
  email: "E-mail",
  visita: "Visita",
  outro: "Outro",
};

/**
 * Formata uma data pura ("AAAA-MM-DD", sem hora — é o que o Postgres
 * devolve para uma coluna `date`). `new Date("2026-08-15")` seria
 * interpretado como meia-noite UTC, e no fuso do Brasil isso volta um
 * dia ao converter para local — uma tarefa "para hoje" apareceria
 * datada de ontem. Monta a data a partir das partes, sem passar por UTC.
 */
function dataBR(isoData: string): string {
  const [ano, mes, dia] = isoData.split("-");
  return `${dia}/${mes}/${ano}`;
}

function dataHoraBR(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PainelCliente({
  lead,
  interacoes: interacoesIniciais,
  tarefas: tarefasIniciais,
}: {
  lead: LinhaLead;
  interacoes: LinhaInteracao[];
  tarefas: LinhaTarefa[];
}) {
  const router = useRouter();
  const [estagio, setEstagio] = useState(lead.estagio);
  const [interacoes, setInteracoes] = useState(interacoesIniciais);
  const [tarefas, setTarefas] = useState(tarefasIniciais);

  const [tipoNovo, setTipoNovo] = useState<TipoInteracao>("whatsapp");
  const [notaNova, setNotaNova] = useState("");
  const [salvandoInteracao, setSalvandoInteracao] = useState(false);
  const [erroInteracao, setErroInteracao] = useState<string | null>(null);

  const [apagando, setApagando] = useState(false);

  const [tituloTarefa, setTituloTarefa] = useState("");
  const [vencimentoTarefa, setVencimentoTarefa] = useState("");
  const [salvandoTarefa, setSalvandoTarefa] = useState(false);
  const [erroTarefa, setErroTarefa] = useState<string | null>(null);

  async function removerCliente() {
    // Mesma confirmação usada em obra e depoimento. Apagar leva junto o
    // histórico inteiro (interações e tarefas, por cascata no banco), e
    // por isso a pergunta diz o tamanho do estrago antes de acontecer.
    const aviso =
      `Apagar ${lead.nome} do funil?

` +
      `O histórico vai junto: ${interacoes.length} ` +
      `${interacoes.length === 1 ? "interação" : "interações"} e ` +
      `${tarefas.length} ${tarefas.length === 1 ? "tarefa" : "tarefas"}. ` +
      `Não dá para desfazer.`;
    if (!confirm(aviso)) return;

    setApagando(true);
    const resposta = await apagarCliente(lead.id);

    if (!resposta.ok) {
      setApagando(false);
      alert(resposta.erro ?? "Não foi possível apagar este cliente.");
      return;
    }

    router.replace("/admin/clientes");
    router.refresh();
  }

  async function mudarEstagio(novo: EstagioLead) {
    const anterior = estagio;
    setEstagio(novo);
    const resposta = await moverEstagioLead(lead.id, novo);
    if (!resposta.ok) {
      setEstagio(anterior);
      alert(resposta.erro ?? "Não foi possível mudar o estágio.");
    }
  }

  async function aoRegistrarInteracao(evento: React.FormEvent) {
    evento.preventDefault();
    if (!notaNova.trim()) return;

    setSalvandoInteracao(true);
    setErroInteracao(null);
    const resposta = await registrarInteracao(lead.id, tipoNovo, notaNova.trim());
    setSalvandoInteracao(false);

    if (!resposta.ok) {
      setErroInteracao(resposta.erro ?? "Não foi possível salvar.");
      return;
    }

    // Otimista: entra na lista na hora, sem esperar recarregar a página.
    setInteracoes((atual) => [
      { id: crypto.randomUUID(), criado_em: new Date().toISOString(), tipo: tipoNovo, nota: notaNova.trim() },
      ...atual,
    ]);
    setNotaNova("");
    router.refresh();
  }

  async function aoCriarTarefa(evento: React.FormEvent) {
    evento.preventDefault();
    if (!tituloTarefa.trim() || !vencimentoTarefa) return;

    setSalvandoTarefa(true);
    setErroTarefa(null);
    const resposta = await criarTarefa(lead.id, tituloTarefa.trim(), vencimentoTarefa);
    setSalvandoTarefa(false);

    if (!resposta.ok) {
      setErroTarefa(resposta.erro ?? "Não foi possível salvar.");
      return;
    }

    setTarefas((atual) => [
      ...atual,
      {
        id: crypto.randomUUID(),
        lead_id: lead.id,
        titulo: tituloTarefa.trim(),
        vencimento: vencimentoTarefa,
        concluida: false,
      },
    ]);
    setTituloTarefa("");
    setVencimentoTarefa("");
    router.refresh();
  }

  async function alternarTarefa(tarefa: LinhaTarefa) {
    const concluida = !tarefa.concluida;
    setTarefas((atual) => atual.map((t) => (t.id === tarefa.id ? { ...t, concluida } : t)));
    const resposta = await concluirTarefa(tarefa.id, concluida, lead.id);
    if (!resposta.ok) {
      setTarefas((atual) =>
        atual.map((t) => (t.id === tarefa.id ? { ...t, concluida: !concluida } : t)),
      );
    }
  }

  async function removerTarefa(id: string) {
    const anterior = tarefas;
    setTarefas((atual) => atual.filter((t) => t.id !== id));
    const resposta = await apagarTarefa(id, lead.id);
    if (!resposta.ok) setTarefas(anterior);
  }

  // Mesmo cuidado do `dataBR`: `toISOString()` passa por UTC, e à noite
  // no fuso do Brasil isso já seria "amanhã" — uma tarefa de hoje
  // pareceria não vencida ainda. Monta a partir das partes locais.
  const agora = new Date();
  const hoje = [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="flex flex-col gap-6">
      <Painel titulo="Estágio no funil">
        <Selecao
          rotulo="Onde este cliente está"
          valor={estagio}
          aoMudar={(v) => mudarEstagio(v as EstagioLead)}
          opcoes={Object.entries(rotulosEstagio).map(([id, rotulo]) => ({ id, rotulo }))}
          className="max-w-xs"
        />
      </Painel>

      <Painel
        titulo="Histórico de interação"
        descricao="Toda ligação, WhatsApp ou visita registrada aqui, com data — não some quando alguém edita depois."
      >
        <form onSubmit={aoRegistrarInteracao} className="flex flex-col gap-4 border-b border-noite/12 pb-6 sm:flex-row sm:items-end">
          <Selecao
            rotulo="Tipo"
            valor={tipoNovo}
            aoMudar={(v) => setTipoNovo(v as TipoInteracao)}
            opcoes={Object.entries(rotulosTipo).map(([id, rotulo]) => ({ id, rotulo }))}
            className="sm:w-40"
          />
          <Texto
            rotulo="O que aconteceu"
            valor={notaNova}
            aoMudar={setNotaNova}
            linhas={2}
            className="flex-1"
          />
          <Botao type="submit" disabled={salvandoInteracao || !notaNova.trim()}>
            {salvandoInteracao ? "Salvando…" : "Registrar"}
          </Botao>
        </form>

        {erroInteracao ? <div className="mt-4"><Aviso>{erroInteracao}</Aviso></div> : null}

        {interacoes.length === 0 ? (
          <p className="mt-5 text-sm text-concreto">Nenhuma interação registrada ainda.</p>
        ) : (
          <ul className="mt-5 flex flex-col gap-4">
            {interacoes.map((i) => (
              <li key={i.id} className="border-l-2 border-marca pl-4 text-sm">
                <p className="etiqueta text-concreto">
                  {rotulosTipo[i.tipo]} · {dataHoraBR(i.criado_em)}
                </p>
                <p className="mt-1">{i.nota}</p>
              </li>
            ))}
          </ul>
        )}
      </Painel>

      <Painel
        titulo="Tarefas"
        descricao="Follow-ups com data. Aparecem no início do painel quando vencerem."
      >
        <form onSubmit={aoCriarTarefa} className="flex flex-col gap-4 border-b border-noite/12 pb-6 sm:flex-row sm:items-end">
          <Campo
            rotulo="O que precisa ser feito"
            valor={tituloTarefa}
            aoMudar={setTituloTarefa}
            className="flex-1"
          />
          <div>
            <label htmlFor="vencimento-tarefa" className="etiqueta block text-concreto">
              Até quando
            </label>
            <input
              id="vencimento-tarefa"
              type="date"
              value={vencimentoTarefa}
              onChange={(e) => setVencimentoTarefa(e.target.value)}
              className="mt-2 block min-h-11 border border-noite/20 bg-cal px-3 py-2.5 text-base text-noite focus:border-noite"
            />
          </div>
          <Botao type="submit" disabled={salvandoTarefa || !tituloTarefa.trim() || !vencimentoTarefa}>
            {salvandoTarefa ? "Salvando…" : "Adicionar"}
          </Botao>
        </form>

        {erroTarefa ? <div className="mt-4"><Aviso>{erroTarefa}</Aviso></div> : null}

        {tarefas.length === 0 ? (
          <p className="mt-5 text-sm text-concreto">Nenhuma tarefa criada ainda.</p>
        ) : (
          <ul className="mt-5 flex flex-col gap-2">
            {tarefas.map((t) => {
              const atrasada = !t.concluida && t.vencimento < hoje;
              return (
                <li
                  key={t.id}
                  className={`flex items-center gap-3 border px-3 py-2.5 text-sm ${
                    t.concluida
                      ? "border-noite/10 opacity-50"
                      : atrasada
                        ? "border-oxido/50"
                        : "border-noite/15"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={t.concluida}
                    onChange={() => alternarTarefa(t)}
                    aria-label={`Marcar "${t.titulo}" como concluída`}
                    className="size-4 accent-noite"
                  />
                  <span className={`flex-1 ${t.concluida ? "line-through" : ""}`}>
                    {t.titulo}
                  </span>
                  <span className={`tabular text-xs ${atrasada ? "text-oxido" : "text-concreto"}`}>
                    {dataBR(t.vencimento)}
                    {atrasada ? " · atrasada" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removerTarefa(t.id)}
                    className="etiqueta text-oxido"
                  >
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Apagar tarefa &ldquo;{t.titulo}&rdquo;</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Painel>

      {/* Fica no fim e fora dos painéis de trabalho, separado por um fio:
          é a única ação irreversível da tela e não deve dividir espaço
          com "salvar interação". */}
      <div className="border-t border-noite/12 pt-6">
        {/* A cor vai num <span> interno, não no `className` do botão:
            `variante="contorno"` já traz `text-noite`, e `cn` é um join
            simples — as duas utilitárias sobreviveriam juntas e o
            vencedor sairia da ordem do CSS gerado. Hoje `.text-oxido`
            vence por acaso; não é coisa para depender. Ver `lib/utils.ts`. */}
        <Botao
          type="button"
          variante="contorno"
          onClick={removerCliente}
          disabled={apagando}
        >
          <span className="text-oxido">
            {apagando ? "Apagando…" : "Apagar este cliente"}
          </span>
        </Botao>
        <p className="mt-3 text-sm text-concreto">
          Some do funil junto com todo o histórico. Use para limpar os
          clientes de exemplo depois da demonstração.
        </p>
      </div>
    </div>
  );
}
