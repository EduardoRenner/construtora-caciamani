import type { Metadata } from "next";
import { FormularioContato } from "@/components/FormularioContato";
import { MapaSobDemanda } from "@/components/MapaSobDemanda";
import { Pendente } from "@/components/Pendente";
import { TopoPagina } from "@/components/TopoPagina";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeInstagram, IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";
import { MODO_DEMO, institucional } from "@/content/demo";
import { empresa } from "@/content/empresa";
import { obterCidades } from "@/lib/conteudo";
import { linkWhatsApp } from "@/lib/site";
import { apenasDigitos } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato",
  description: `WhatsApp, endereço e área de atendimento da Construtora Caciamani em ${empresa.cidadeSede}/${empresa.uf}.`,
  alternates: { canonical: "/contato" },
};

export const revalidate = 300;

export default async function ContatoPage() {
  const { telefones, endereco, redes } = empresa;
  const cidadesAtendidas = await obterCidades();

  /** Só monta a consulta do mapa quando existir endereço de verdade. */
  const consultaMapa = endereco.logradouro
    ? `${endereco.logradouro}, ${endereco.bairro ?? ""}, ${endereco.cidade} - ${endereco.uf}`
    : null;

  return (
    <>
      <TopoPagina
        rotulo="Contato"
        titulo="Falar com a Caciamani"
        descricao="O caminho mais rápido é o WhatsApp — é por onde o Carlinhos responde."
        cota="contato"
      />

      <Secao espacamento="justo">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <dl className="flex flex-col gap-8">
              <div>
                <dt className="etiqueta text-concreto">WhatsApp</dt>
                <dd className="mt-2.5">
                  <a
                    href={linkWhatsApp(
                      "Olá! Vim pelo site da Construtora Caciamani.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tabular inline-block py-1 text-2xl transition-colors hover:text-oxido"
                  >
                    {telefones.principal.exibicao}
                  </a>
                </dd>
              </div>

              {/* "Se houver" — não é pendência de verdade, então em demo
                  a linha some em vez de virar marcador. */}
              {telefones.fixo || !MODO_DEMO ? (
                <div>
                  <dt className="etiqueta text-concreto">Telefone fixo</dt>
                  <dd className="mt-2.5">
                    {telefones.fixo ? (
                      <a
                        href={`tel:+${apenasDigitos(telefones.fixo.internacional)}`}
                        className="tabular inline-block py-1 text-lg transition-colors hover:text-oxido"
                      >
                        {telefones.fixo.exibicao}
                      </a>
                    ) : (
                      <Pendente>telefone fixo, se houver</Pendente>
                    )}
                  </dd>
                </div>
              ) : null}

              <div>
                <dt className="etiqueta text-concreto">E-mail</dt>
                <dd className="mt-2.5">
                  {empresa.email ? (
                    <a
                      href={`mailto:${empresa.email}`}
                      className="inline-block py-1 text-lg transition-colors hover:text-oxido"
                    >
                      {empresa.email}
                    </a>
                  ) : (
                    <Pendente>e-mail de contato</Pendente>
                  )}
                </dd>
              </div>

              <div>
                <dt className="etiqueta text-concreto">Instagram</dt>
                <dd className="mt-2.5">
                  <a
                    href={redes.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-1 text-lg transition-colors hover:text-oxido"
                  >
                    <IconeInstagram className="size-5" />@
                    {redes.instagram.usuario}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="etiqueta text-concreto">Escritório</dt>
                <dd className="mt-2.5 text-lg">
                  {endereco.logradouro ? (
                    <>
                      {endereco.logradouro}
                      {endereco.bairro ? ` — ${endereco.bairro}` : ""}
                      <br />
                      {endereco.cidade}/{endereco.uf}
                      {endereco.cep ? ` · ${endereco.cep}` : ""}
                    </>
                  ) : (
                    <Pendente bloco>
                      endereço do escritório — rua, número, bairro e CEP
                    </Pendente>
                  )}
                </dd>
              </div>

              <div>
                <dt className="etiqueta text-concreto">Horário de atendimento</dt>
                <dd className="mt-2.5 text-lg">
                  {institucional.horarioAtendimento ?? (
                    <Pendente>horário de atendimento</Pendente>
                  )}
                </dd>
              </div>
            </dl>

            <BotaoLink
              href={linkWhatsApp("Olá! Vim pelo site da Construtora Caciamani.")}
              externo
              tamanho="lg"
              className="mt-10 w-full sm:w-auto"
            >
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </BotaoLink>

          </div>

          <div>
            <h2 className="titulo mb-6 text-2xl">Ou escreva por aqui</h2>
            <FormularioContato />

            <h2 className="etiqueta mb-4 mt-14 text-concreto">Onde fica</h2>
            {consultaMapa ? (
              <MapaSobDemanda consulta={consultaMapa} />
            ) : (
              <div className="relative flex aspect-4/3 w-full flex-col items-center justify-center gap-3 bg-vidro/40 bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)] p-6 text-center sm:aspect-video">
                <p className="prosa text-sm text-concreto">
                  O mapa entra aqui assim que o endereço do escritório for
                  informado. Enquanto isso, o caminho é o WhatsApp.
                </p>
                <Pendente bloco>
                  o mapa só pode ser montado depois que o endereço do
                  escritório for informado
                </Pendente>
              </div>
            )}
          </div>
        </div>
      </Secao>

      <Secao tom="claro" cota={`${cidadesAtendidas.length} cidade${cidadesAtendidas.length > 1 ? "s" : ""}`}>
        <RotuloSecao tom="claro">Área de atendimento</RotuloSecao>
        <TituloSecao>Onde a gente constrói</TituloSecao>
        <p className="prosa mt-5 text-concreto">
          A obra é acompanhada de perto, então o raio tem limite. Fora dessa
          área, vale conversar antes.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {cidadesAtendidas.map((cidade) => (
            <li
              key={cidade}
              className="etiqueta border border-noite/20 px-3 py-2.5"
            >
              {cidade}/{empresa.uf}
            </li>
          ))}
        </ul>

        {cidadesAtendidas.length <= 1 ? (
          <div className="mt-5 max-w-lg">
            <Pendente bloco>
              lista nomeada das demais cidades atendidas no {empresa.regiao}
            </Pendente>
          </div>
        ) : null}
      </Secao>
    </>
  );
}
