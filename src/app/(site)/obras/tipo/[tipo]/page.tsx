import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListaObrasFiltrada } from "@/components/ListaObrasFiltrada";
import { TopoPagina } from "@/components/TopoPagina";
import { empresa } from "@/content/empresa";
import { rotulosTipoObra, type TipoObra } from "@/content/tipos";
import { obterObras } from "@/lib/conteudo";

export const revalidate = 300;

/**
 * Um recorte do portfólio por tipo de obra.
 *
 * Existe como rota própria, e não como `?tipo=`, porque assim é estática,
 * indexável e compartilhável — "casas geminadas em Maravilha" vira uma
 * página de verdade, que é exatamente o tipo de busca que traz cliente
 * para uma construtora regional.
 */
export async function generateStaticParams() {
  const obras = await obterObras();
  return [...new Set(obras.map((obra) => obra.tipo))].map((tipo) => ({ tipo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string }>;
}): Promise<Metadata> {
  const { tipo } = await params;
  const rotulo = rotulosTipoObra[tipo as TipoObra];
  if (!rotulo) return {};

  return {
    title: `${rotulo} em ${empresa.cidadeSede}`,
    description: `${rotulo} construídas pela Construtora Caciamani em ${empresa.cidadeSede}/${empresa.uf} e região.`,
    alternates: { canonical: `/obras/tipo/${tipo}` },
  };
}

export default async function ObrasPorTipo({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  const obras = await obterObras();
  const tiposPresentes = [...new Set(obras.map((obra) => obra.tipo))] as TipoObra[];

  if (!tiposPresentes.includes(tipo as TipoObra)) notFound();

  const tipoAtivo = tipo as TipoObra;
  const quantidade = obras.filter((obra) => obra.tipo === tipoAtivo).length;

  return (
    <>
      <TopoPagina
        rotulo="Portfólio"
        titulo={`${rotulosTipoObra[tipoAtivo]} em ${empresa.cidadeSede}`}
        descricao={`O que a Caciamani já construiu neste formato, em ${empresa.cidadeSede} e região.`}
        cota={`${quantidade} ${quantidade === 1 ? "obra" : "obras"}`}
      />

      <ListaObrasFiltrada
        obras={obras}
        tiposPresentes={tiposPresentes}
        tipoAtivo={tipoAtivo}
      />
    </>
  );
}
