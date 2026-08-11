import type { Metadata } from "next";
import { Pendente } from "@/components/Pendente";
import { TopoPagina } from "@/components/TopoPagina";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";
import { empresa } from "@/content/empresa";
import { obterCidades } from "@/lib/conteudo";
import { linkWhatsApp } from "@/lib/site";

export const metadata: Metadata = {
  title: "A construtora",
  description: `A Construtora Caciamani e ${empresa.proprietario.nome}: quem constrói em ${empresa.cidadeSede} e região.`,
  alternates: { canonical: "/sobre" },
};

export const revalidate = 300;

export default async function SobrePage() {
  const { proprietario, cadastro } = empresa;
  const cidadesAtendidas = await obterCidades();

  return (
    <>
      <TopoPagina
        rotulo="A construtora"
        titulo="Quem constrói"
        descricao={`Construção e incorporação em ${empresa.cidadeSede}/${empresa.uf}. Casas, casas germinadas, prédios e obras sob demanda.`}
        cota="a empresa"
      />

      <Secao tom="claro" cota="história">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div
              aria-hidden="true"
              className="relative aspect-3/4 w-full bg-vidro/50 bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)]"
            >
              <div className="absolute inset-x-3 bottom-3">
                <Pendente bloco>retrato do Carlos, na obra</Pendente>
              </div>
            </div>
          </div>

          <div>
            <RotuloSecao tom="claro">O construtor</RotuloSecao>
            <TituloSecao>{proprietario.nome}</TituloSecao>

            <div className="mt-6">
              {proprietario.depoimento ? (
                <blockquote className="prosa text-lg md:text-xl">
                  <p>“{proprietario.depoimento}”</p>
                </blockquote>
              ) : (
                <Pendente bloco>
                  a fala do Carlos em primeira pessoa — como começou, por que
                  ficou em {empresa.cidadeSede}, e o que ele não abre mão numa
                  obra
                </Pendente>
              )}
            </div>

            <div className="prosa mt-8 text-concreto">
              <Pendente bloco>
                história da empresa — em que ano começou, quantas obras já
                entregou, como a equipe se formou, se houve mudança de porte
                (de casa para prédio, por exemplo)
              </Pendente>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-noite/15 pt-6">
              <div>
                <dt className="etiqueta text-concreto">No mercado desde</dt>
                <dd className="tabular mt-2 text-2xl">
                  {proprietario.desdeAno ?? <Pendente>ano</Pendente>}
                </dd>
              </div>
              <div>
                <dt className="etiqueta text-concreto">Base</dt>
                <dd className="mt-2 text-2xl">
                  {empresa.cidadeSede}/{empresa.uf}
                </dd>
              </div>
              <div>
                <dt className="etiqueta text-concreto">Cidades atendidas</dt>
                <dd className="tabular mt-2 text-2xl">
                  {cidadesAtendidas.join(", ")}
                  {cidadesAtendidas.length <= 1 ? (
                    <Pendente className="ml-2">demais cidades</Pendente>
                  ) : null}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Secao>

      <Secao cota="registro">
        <RotuloSecao>Dados da empresa</RotuloSecao>
        <TituloSecao>Registro e responsabilidade técnica</TituloSecao>
        <p className="prosa mt-5 text-concreto">
          Obra de engenharia tem responsável técnico com registro. Estes são os
          dados da Caciamani.
        </p>

        <dl className="mt-10 grid gap-x-10 gap-y-8 border-t border-noite/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="etiqueta text-concreto">Razão social</dt>
            <dd className="mt-2.5">
              {cadastro.razaoSocial ?? <Pendente>razão social</Pendente>}
            </dd>
          </div>
          <div>
            <dt className="etiqueta text-concreto">CNPJ</dt>
            <dd className="tabular mt-2.5">
              {cadastro.cnpj ?? <Pendente>CNPJ</Pendente>}
            </dd>
          </div>
          <div>
            <dt className="etiqueta text-concreto">CREA</dt>
            <dd className="tabular mt-2.5">
              {cadastro.crea ?? <Pendente>CREA</Pendente>}
            </dd>
          </div>
          <div>
            <dt className="etiqueta text-concreto">Responsável técnico</dt>
            <dd className="mt-2.5">
              {cadastro.responsavelTecnico ?? (
                <Pendente>responsável técnico</Pendente>
              )}
            </dd>
          </div>
        </dl>
      </Secao>

      <Secao tom="noite" cota="contato" espacamento="solto">
        <div className="max-w-2xl">
          <TituloSecao>Vamos conversar sobre a sua obra</TituloSecao>
          <p className="prosa mt-5 text-vidro/80">
            A primeira conversa é sobre o terreno e o que você quer. Preço vem
            depois disso, não antes.
          </p>
          <BotaoLink
            href={linkWhatsApp(
              "Olá! Vim pelo site da Construtora Caciamani e gostaria de conversar sobre uma obra.",
            )}
            externo
            tamanho="lg"
            className="mt-8"
          >
            <IconeWhatsApp className="size-5" />
            Falar no WhatsApp
          </BotaoLink>
        </div>
      </Secao>
    </>
  );
}
