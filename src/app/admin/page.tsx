import Link from "next/link";
import { listarLeads, listarObrasAdmin, listarTarefasPendentes } from "@/lib/dadosAdmin";

/** Hoje, em "AAAA-MM-DD" local — mesmo cuidado do PainelCliente: nada de UTC. */
function hojeLocal(): string {
  const agora = new Date();
  return [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0"),
  ].join("-");
}

export default async function PainelInicio() {
  const [obras, leads, tarefas] = await Promise.all([
    listarObrasAdmin(),
    listarLeads(),
    listarTarefasPendentes(),
  ]);

  const publicadas = obras.filter((o) => o.publicada).length;
  const naoAtendidos = leads.filter((l) => !l.atendido).length;
  const seteDias = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentes = leads.filter((l) => new Date(l.criado_em).getTime() > seteDias).length;

  const hoje = hojeLocal();
  const vencidas = tarefas.filter((t) => t.vencimento <= hoje);

  const atalhos = [
    { href: "/admin/clientes", rotulo: "Ver o funil de clientes" },
    { href: "/admin/obras/nova", rotulo: "Cadastrar uma obra" },
    { href: "/admin/leads", rotulo: "Ver os contatos recebidos" },
    { href: "/admin/numeros", rotulo: "Editar os números da empresa" },
    { href: "/admin/orcamento", rotulo: "Ajustar os valores do orçamento" },
  ];

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">Painel da Caciamani</h1>
      <p className="prosa mt-3 text-concreto">
        Tudo o que você mudar aqui aparece no site em poucos segundos.
      </p>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Numero rotulo="Obras no site" valor={publicadas} />
        <Numero rotulo="Obras em rascunho" valor={obras.length - publicadas} />
        <Numero rotulo="Contatos nos últimos 7 dias" valor={recentes} />
        <Numero
          rotulo="Contatos ainda não atendidos"
          valor={naoAtendidos}
          alerta={naoAtendidos > 0}
        />
        <Numero
          rotulo="Tarefas vencidas ou de hoje"
          valor={vencidas.length}
          alerta={vencidas.length > 0}
        />
      </dl>

      {vencidas.length > 0 ? (
        <div className="mt-8 border border-oxido/40 bg-oxido/6 p-5">
          <h2 className="etiqueta text-oxido">Follow-up pendente</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {vencidas.slice(0, 6).map((t) => (
              <li key={t.id} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                <Link
                  href={`/admin/clientes/${t.lead_id}`}
                  className="underline decoration-oxido/60 decoration-2 underline-offset-2"
                >
                  {t.lead_nome}
                </Link>
                <span className="text-concreto">— {t.titulo}</span>
                <span className="tabular text-xs text-oxido">
                  {t.vencimento < hoje ? "atrasada" : "hoje"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <h2 className="titulo mt-14 text-xl">Atalhos</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {atalhos.map((atalho) => (
          <li key={atalho.href}>
            <Link
              href={atalho.href}
              className="flex min-h-14 items-center border border-noite/15 bg-cal px-5 transition-colors hover:border-noite"
            >
              {atalho.rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Numero({
  rotulo,
  valor,
  alerta,
}: {
  rotulo: string;
  valor: number;
  alerta?: boolean;
}) {
  return (
    <div className="border border-noite/15 bg-cal p-5">
      <dt className="etiqueta text-concreto">{rotulo}</dt>
      <dd
        className={`tabular mt-3 text-4xl ${alerta ? "text-oxido" : "text-noite"}`}
      >
        {valor}
      </dd>
    </div>
  );
}
