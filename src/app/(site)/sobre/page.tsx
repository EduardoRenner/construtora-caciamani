import type { Metadata } from "next";
import { Pendente } from "@/components/Pendente";
import { RetratoProprietario } from "@/components/RetratoProprietario";
import { TopoPagina } from "@/components/TopoPagina";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";
import { institucional } from "@/content/demo";
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
  const temRegistro = Boolean(cadastro.cnpj || cadastro.crea);

  return (
    <>
      <TopoPagina
        rotulo="A construtora"
        titulo="Quem constrói"
        descricao={`Construção e incorporação em ${empresa.cidadeSede}/${empresa.uf}. Casas, casas geminadas, prédios e obras sob demanda.`}
        cota="a empresa"
      />

      <Secao tom="claro" cota="história">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <RetratoProprietario prioridade />
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

            {/* A história é a única pendência desta página que o conteúdo
                demonstrativo consegue cobrir — quando ele entra, o
                marcador sai. A fala do Carlos, logo acima, não: frase em
                primeira pessoa atribuída a pessoa real não se inventa. */}
            <div className="prosa mt-8 text-concreto">
              {institucional.historia ? (
                <p>{institucional.historia}</p>
              ) : (
                <Pendente bloco>
                  história da empresa — em que ano começou, quantas obras já
                  entregou, como a equipe se formou, se houve mudança de porte
                  (de casa para prédio, por exemplo)
                </Pendente>
              )}
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-noite/15 pt-6">
              <div>
                <dt className="etiqueta text-concreto">No mercado desde</dt>
                <dd className="tabular mt-2 text-2xl">
                  {institucional.desdeAno ?? <Pendente>ano</Pendente>}
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
                {/* Acima de três, o nome de cada uma não cabe na mesma
                    linha dos outros indicadores — vira contagem em cima
                    e a lista embaixo, em corpo de texto. */}
                {cidadesAtendidas.length > 3 ? (
                  <dd className="mt-2">
                    <span className="tabular text-2xl">
                      {cidadesAtendidas.length} cidades
                    </span>
                    <span className="prosa mt-1 block text-sm text-concreto">
                      {cidadesAtendidas.join(" · ")}
                    </span>
                  </dd>
                ) : (
                  <dd className="tabular mt-2 text-2xl">
                    {cidadesAtendidas.join(", ")}
                    {cidadesAtendidas.length <= 1 ? (
                      <Pendente className="ml-2">demais cidades</Pendente>
                    ) : null}
                  </dd>
                )}
              </div>
            </dl>
          </div>
        </div>
      </Secao>

      <Secao cota="registro">
        <RotuloSecao>Dados da empresa</RotuloSecao>
        <TituloSecao>Registro e responsabilidade técnica</TituloSecao>
        <p className="prosa mt-5 text-concreto">
          Obra de engenharia tem responsável técnico com registro.{" "}
          {temRegistro
            ? "Estes são os dados da Caciamani."
            : "Razão social, CNPJ, CREA e o nome do responsável técnico entram aqui assim que a Caciamani informar — não é o tipo de dado que se preenche por estimativa."}
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
