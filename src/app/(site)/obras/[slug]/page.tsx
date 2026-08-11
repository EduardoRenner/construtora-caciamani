import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AntesDepois } from "@/components/AntesDepois";
import { FormularioContato } from "@/components/FormularioContato";
import { GaleriaObra } from "@/components/GaleriaObra";
import { Pendente } from "@/components/Pendente";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeSeta, IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";
import { empresa } from "@/content/empresa";
import { rotulosTipoObra, type Obra } from "@/content/tipos";
import { obterObra, obterObras } from "@/lib/conteudo";
import { linkWhatsApp } from "@/lib/site";
import { numeroBR } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await obterObras()).map((obra) => ({ slug: obra.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const obra = await obterObra(slug);
  if (!obra) return {};

  const descricao =
    obra.resumo ??
    `${rotulosTipoObra[obra.tipo]} construída pela Construtora Caciamani em ${obra.cidade}/${obra.uf}.`;

  return {
    title: obra.titulo,
    description: descricao,
    alternates: { canonical: `/obras/${obra.slug}` },
    openGraph: { title: obra.titulo, description: descricao, type: "article" },
  };
}

export default async function ObraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const obra = await obterObra(slug);
  if (!obra) notFound();

  const mensagem = `Olá! Vi a obra “${obra.titulo}” no site da Construtora Caciamani e gostaria de conversar sobre algo parecido.`;

  return (
    <>
      <Secao cota={rotulosTipoObra[obra.tipo]} className="pt-20 md:pt-24">
        <Link
          href="/obras"
          className="etiqueta inline-flex items-center gap-2 py-1 text-concreto transition-colors hover:text-noite"
        >
          <IconeSeta className="size-3.5 rotate-180" />
          Todas as obras
        </Link>

        <RotuloSecao className="mt-8">
          {rotulosTipoObra[obra.tipo]} · {obra.cidade}/{obra.uf}
        </RotuloSecao>
        <h1 className="titulo text-4xl md:text-6xl">{obra.titulo}</h1>

        <div className="prosa mt-6 text-base text-concreto md:text-lg">
          {obra.descricao ? (
            <p>{obra.descricao}</p>
          ) : (
            <Pendente bloco>
              descrição da obra — o que o cliente pediu, o que o terreno impôs
              e o que foi resolvido
            </Pendente>
          )}
        </div>

        <FichaTecnica obra={obra} />
      </Secao>

      <Secao tom="claro" cota="galeria">
        <RotuloSecao>Galeria</RotuloSecao>
        <TituloSecao className="mb-10">Como ficou</TituloSecao>
        <GaleriaObra fotos={obra.galeria} titulo={obra.titulo} />
      </Secao>

      {obra.antesDepois.length > 0 ? (
        <Secao cota="antes / depois">
          <RotuloSecao>Antes e depois</RotuloSecao>
          <TituloSecao className="mb-10">O ponto de partida</TituloSecao>
          <div className="grid gap-10 lg:grid-cols-2">
            {obra.antesDepois.map((par, indice) => (
              <AntesDepois
                key={par.antes.src ?? indice}
                par={par}
                prioridade={indice === 0}
              />
            ))}
          </div>
        </Secao>
      ) : null}

      <Secao tom="noite" cota="orçamento" espacamento="solto">
        <div className="max-w-2xl">
          <h2 className="titulo text-3xl md:text-5xl">Quero algo parecido</h2>
          <p className="prosa mt-5 text-vidro/80">
            Conte o que você tem em mente e a gente parte desta referência.
            Em {empresa.cidadeSede} e região.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotaoLink href={linkWhatsApp(mensagem)} externo tamanho="lg">
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </BotaoLink>
            <BotaoLink href="/orcamento" variante="contornoClaro" tamanho="lg">
              Simular orçamento
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
        </div>

        <div className="mt-14 max-w-3xl border-t border-sobre-contraste/15 pt-10">
          <h3 className="titulo text-xl text-sobre-contraste">Ou deixe seu contato aqui</h3>
          <p className="prosa mt-3 text-sm text-vidro/75">
            A referência desta obra vai junto na mensagem.
          </p>
          <div className="mt-8">
            <FormularioContato
              obraSlug={obra.slug}
              tituloObra={obra.titulo}
              mensagemInicial={`Quero algo parecido com a obra “${obra.titulo}”.`}
            />
          </div>
        </div>
      </Secao>
    </>
  );
}

function FichaTecnica({ obra }: { obra: Obra }) {
  const itens: Array<{ rotulo: string; valor: React.ReactNode }> = [
    { rotulo: "Tipo", valor: rotulosTipoObra[obra.tipo] },
    { rotulo: "Cidade", valor: `${obra.cidade}/${obra.uf}` },
    {
      rotulo: "Área construída",
      valor: obra.areaM2 ? `${numeroBR(obra.areaM2)} m²` : <Pendente>m²</Pendente>,
    },
    {
      rotulo: "Prazo de execução",
      valor: obra.prazoMeses ? `${obra.prazoMeses} meses` : <Pendente>prazo</Pendente>,
    },
    {
      rotulo: "Entrega",
      valor: obra.ano ? String(obra.ano) : <Pendente>ano</Pendente>,
    },
  ];

  return (
    <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-noite/15 pt-8 md:grid-cols-5">
      {itens.map((item) => (
        <div key={item.rotulo}>
          <dt className="etiqueta text-concreto">{item.rotulo}</dt>
          <dd className="tabular mt-2.5 text-lg">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
