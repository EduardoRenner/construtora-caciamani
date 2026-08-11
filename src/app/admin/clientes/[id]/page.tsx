import Link from "next/link";
import { notFound } from "next/navigation";
import { PainelCliente } from "@/components/admin/PainelCliente";
import { IconeSeta, IconeWhatsApp } from "@/components/ui/Icones";
import { obterLeadComHistorico } from "@/lib/dadosAdmin";
import { apenasDigitos, reaisBR } from "@/lib/utils";

export default async function ClienteAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dados = await obterLeadComHistorico(id);
  if (!dados) notFound();

  const { lead, interacoes, tarefas } = dados;

  return (
    <div>
      <Link
        href="/admin/clientes"
        className="etiqueta inline-flex items-center gap-2 py-1 text-concreto transition-colors hover:text-noite"
      >
        <IconeSeta className="size-3.5 rotate-180" />
        Todos os clientes
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="titulo text-3xl md:text-4xl">{lead.nome}</h1>
          <p className="etiqueta mt-2 text-concreto">
            {lead.origem === "orcamento"
              ? "Veio pelo simulador de orçamento"
              : lead.origem === "obra"
                ? "Veio de uma página de obra"
                : "Veio pelo formulário de contato"}
          </p>
        </div>

        <a
          href={`https://wa.me/55${apenasDigitos(lead.telefone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="etiqueta inline-flex min-h-11 items-center gap-2 bg-contraste px-4 text-sobre-contraste"
        >
          <IconeWhatsApp className="size-4 text-marca" />
          Responder no WhatsApp
        </a>
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-3 border-t border-noite/12 pt-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
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
            valor={`${reaisBR(lead.estimativa_minima)} – ${reaisBR(lead.estimativa_maxima)}`}
          />
        ) : null}
        {lead.obra_slug ? <Par rotulo="Obra de referência" valor={lead.obra_slug} /> : null}
      </dl>

      {lead.mensagem ? (
        <p className="prosa mt-6 border-l-2 border-marca pl-4 text-sm">{lead.mensagem}</p>
      ) : null}

      <div className="mt-10">
        <PainelCliente lead={lead} interacoes={interacoes} tarefas={tarefas} />
      </div>
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
