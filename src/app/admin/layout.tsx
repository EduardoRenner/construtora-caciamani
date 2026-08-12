import type { Metadata } from "next";
import Link from "next/link";
import { sair } from "@/acoes/admin";
import { Marca } from "@/components/layout/Marca";
import { MODO_DEMO } from "@/content/demo";
import { supabaseConfigurado } from "@/lib/supabase/publico";
import { usuarioAtual } from "@/lib/supabase/servidor";

export const metadata: Metadata = {
  title: "Painel",
  // O painel nunca deve aparecer em busca.
  robots: { index: false, follow: false },
};

const menu = [
  { href: "/admin", rotulo: "Início" },
  { href: "/admin/clientes", rotulo: "Clientes" },
  { href: "/admin/obras", rotulo: "Obras" },
  { href: "/admin/leads", rotulo: "Contatos recebidos" },
  { href: "/admin/depoimentos", rotulo: "Depoimentos" },
  { href: "/admin/numeros", rotulo: "Números da empresa" },
  { href: "/admin/orcamento", rotulo: "Valores do orçamento" },
];

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sem Supabase o painel não tem como existir. Sem este desvio, o
  // middleware deixa passar (não há como autenticar) e o Carlos veria um
  // painel vazio, achando que está quebrado.
  if (!supabaseConfigurado()) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cal-2 px-4 py-16">
        <div className="w-full max-w-md">
          <Marca />
          <h1 className="titulo mt-10 text-3xl">O painel ainda não está ligado</h1>
          <div className="mt-5 border border-dashed border-oxido/60 bg-oxido/6 p-5 text-sm text-oxido">
            <p>Faltam três passos, nesta ordem:</p>
            <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5">
              <li>Criar o projeto no Supabase</li>
              <li>
                Rodar os arquivos de <code>supabase/migracoes/</code> no SQL
                Editor
              </li>
              <li>
                Preencher <code>.env.local</code> a partir do{" "}
                <code>.env.example</code>
              </li>
            </ol>
            <p className="mt-3">Está no PENDENCIAS.md, item 1.4.</p>
          </div>
          <Link
            href="/"
            className="etiqueta mt-8 inline-block py-2 text-concreto underline decoration-marca decoration-2 underline-offset-4"
          >
            Voltar para o site
          </Link>
        </div>
      </div>
    );
  }

  const usuario = await usuarioAtual();

  // A tela de entrada não usa a moldura do painel.
  if (!usuario) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-cal-2">
      <header className="border-b border-noite/12 bg-cal">
        <div className="mx-auto flex max-w-[80rem] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Marca />
            <span className="etiqueta border border-noite/20 px-2 py-1 text-concreto">
              Painel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="etiqueta py-2 text-concreto underline decoration-marca decoration-2 underline-offset-4"
            >
              Ver o site
            </Link>
            <form action={sair}>
              <button
                type="submit"
                className="etiqueta min-h-11 px-3 py-2 text-concreto transition-colors hover:text-noite"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Painel" className="mx-auto max-w-[80rem] px-4 md:px-8">
          <ul className="-mb-px flex gap-1 overflow-x-auto">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="etiqueta inline-flex min-h-11 items-center whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-concreto transition-colors hover:border-marca hover:text-noite"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Sem este aviso o painel parece quebrado durante a demonstração:
          o site mostra 8 obras e 3 depoimentos, e as telas daqui abrem
          quase vazias. Não é bug — é o conteúdo demonstrativo vindo do
          código, não do banco. Melhor dizer isso do que deixar o Carlos
          descobrir sozinho no meio da apresentação. */}
      {MODO_DEMO ? (
        <div className="border-b border-marca/40 bg-marca/10">
          <p className="mx-auto max-w-[80rem] px-4 py-3 text-sm text-noite md:px-8">
            <strong className="font-semibold">Site em modo demonstração.</strong>{" "}
            Parte do que aparece no site público — números, obras,
            depoimentos e valores do orçamento — é conteúdo demonstrativo
            que vem do código, não deste painel. Estas telas mostram só o
            que está realmente gravado no banco. Ao desligar o modo demo,
            o site passa a mostrar exatamente o que estiver aqui.
          </p>
        </div>
      ) : null}

      <main className="mx-auto max-w-[80rem] px-4 py-10 md:px-8">{children}</main>
    </div>
  );
}
