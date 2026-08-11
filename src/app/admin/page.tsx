import Link from "next/link";
import { listarLeads, listarObrasAdmin } from "@/lib/dadosAdmin";

export default async function PainelInicio() {
  const [obras, leads] = await Promise.all([listarObrasAdmin(), listarLeads()]);

  const publicadas = obras.filter((o) => o.publicada).length;
  const naoAtendidos = leads.filter((l) => !l.atendido).length;
  const seteDias = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentes = leads.filter((l) => new Date(l.criado_em).getTime() > seteDias).length;

  const atalhos = [
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

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Numero rotulo="Obras no site" valor={publicadas} />
        <Numero rotulo="Obras em rascunho" valor={obras.length - publicadas} />
        <Numero rotulo="Contatos nos últimos 7 dias" valor={recentes} />
        <Numero
          rotulo="Contatos ainda não atendidos"
          valor={naoAtendidos}
          alerta={naoAtendidos > 0}
        />
      </dl>

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
