import type { Metadata } from "next";
import { ListaObrasFiltrada } from "@/components/ListaObrasFiltrada";
import { TopoPagina } from "@/components/TopoPagina";
import { empresa } from "@/content/empresa";
import type { TipoObra } from "@/content/tipos";
import { obterObras } from "@/lib/conteudo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Obras",
  description: `Casas, casas germinadas e prédios construídos pela Construtora Caciamani em ${empresa.cidadeSede} e região.`,
  alternates: { canonical: "/obras" },
};

export default async function ObrasPage() {
  const obras = await obterObras();
  const tiposPresentes = [...new Set(obras.map((obra) => obra.tipo))] as TipoObra[];

  return (
    <>
      <TopoPagina
        rotulo="Portfólio"
        titulo="Obras"
        descricao={`O que a Caciamani já construiu em ${empresa.cidadeSede} e região. Cada obra tem página própria, com ficha técnica e fotos.`}
        cota={`${obras.length} obras`}
      />

      <ListaObrasFiltrada
        obras={obras}
        tiposPresentes={tiposPresentes}
        tipoAtivo={null}
      />
    </>
  );
}
