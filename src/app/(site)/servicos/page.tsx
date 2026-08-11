import type { Metadata } from "next";
import { TopoPagina } from "@/components/TopoPagina";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeSeta, IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";
import { empresa } from "@/content/empresa";
import { etapas } from "@/content/processo";
import { servicos } from "@/content/servicos";
import { linkWhatsApp } from "@/lib/site";

export const metadata: Metadata = {
  title: "Serviços",
  description: `Construção de casas, casas germinadas, prédios, reformas e projetos em ${empresa.cidadeSede}/${empresa.uf} e região.`,
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
  return (
    <>
      <TopoPagina
        rotulo="Serviços"
        titulo="O que a Caciamani faz"
        descricao="Cinco frentes, todas com a mesma equipe do projeto à entrega. O que muda é o porte e a sequência."
        cota={`${servicos.length} frentes`}
      />

      <Secao espacamento="justo">
        <ul className="flex flex-col">
          {servicos.map((servico, indice) => (
            <li
              key={servico.slug}
              id={servico.slug}
              className="grid scroll-mt-28 gap-6 border-t border-noite/15 py-10 md:grid-cols-[auto_minmax(0,20rem)_minmax(0,1fr)] md:gap-10"
            >
              {/* Em `noite`, não em amarelo: o amarelo sobre `cal` dá
                  2.25:1. A regra da paleta vale aqui também — amarelo é
                  marcação, nunca cor de texto sobre fundo claro. */}
              <span className="tabular text-sm text-noite">
                {String(indice + 1).padStart(2, "0")}
              </span>

              <h2 className="titulo text-2xl md:text-3xl">{servico.titulo}</h2>

              <div>
                <p className="prosa text-concreto">{servico.descricao}</p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {servico.inclui.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-4 shrink-0 bg-marca"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao tom="noite" cota={`${etapas.length} etapas`}>
        <RotuloSecao tom="noite">Em qualquer uma delas</RotuloSecao>
        <TituloSecao className="max-w-[20ch]">
          A obra segue sempre a mesma sequência
        </TituloSecao>

        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {etapas.map((etapa, indice) => (
            <li key={etapa.titulo} className="border-t border-sobre-contraste/20 pt-5">
              <span className="tabular text-sm text-marca">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <h3 className="titulo mt-3 text-xl text-sobre-contraste">{etapa.titulo}</h3>
              <p className="prosa mt-3 text-sm text-vidro/75">{etapa.descricao}</p>
              <p className="etiqueta mt-4 text-vidro/70">{etapa.entrega}</p>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao cota="orçamento" espacamento="solto">
        <div className="max-w-2xl">
          <TituloSecao>Qual dessas é a sua?</TituloSecao>
          <p className="prosa mt-5 text-concreto">
            Se não souber ainda, tudo bem — é justamente a primeira conversa que
            resolve isso.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotaoLink href="/orcamento" tamanho="lg">
              Simular orçamento
              <IconeSeta className="size-4" />
            </BotaoLink>
            <BotaoLink
              href={linkWhatsApp(
                "Olá! Vi os serviços no site da Construtora Caciamani e gostaria de conversar.",
              )}
              externo
              variante="contorno"
              tamanho="lg"
            >
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </BotaoLink>
          </div>
        </div>
      </Secao>
    </>
  );
}
