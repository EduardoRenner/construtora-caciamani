import Image from "next/image";
import { AntesDepois } from "@/components/AntesDepois";
import { CardObra } from "@/components/CardObra";
import { ElevacaoTraco } from "@/components/ElevacaoTraco";
import { FaixaEstatisticas } from "@/components/FaixaEstatisticas";
import { Pendente } from "@/components/Pendente";
import { RetratoProprietario } from "@/components/RetratoProprietario";
import { Entrada, TituloEntrada } from "@/components/Entrada";
import { Revelar } from "@/components/Revelar";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeSeta, IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";
import { MODO_DEMO, institucional } from "@/content/demo";
import { empresa } from "@/content/empresa";
import { antesDepoisDestaque } from "@/content/obras";
import { etapas } from "@/content/processo";
import { servicos } from "@/content/servicos";
import type { Depoimento as TipoDepoimento, Obra } from "@/content/tipos";
import {
  obterCidades,
  obterDepoimentos,
  obterEstatisticas,
  obterObrasDestaque,
} from "@/lib/conteudo";
import { linkWhatsApp, mensagemPadraoWhatsApp } from "@/lib/site";

/** Recalcula a cada 5 min para pegar o que for editado no painel. */
export const revalidate = 300;

export default async function Home() {
  const [estatisticas, obrasDestaque, depoimentos, cidades] = await Promise.all([
    obterEstatisticas(),
    obterObrasDestaque(),
    obterDepoimentos(),
    obterCidades(),
  ]);

  const temParAntesDepois = Boolean(
    antesDepoisDestaque.antes.src && antesDepoisDestaque.depois.src,
  );

  return (
    <>
      <Hero />
      <FaixaEstatisticas estatisticas={estatisticas} />
      <ObrasEmDestaque obras={obrasDestaque} />
      {/* Um par antes/depois exige duas fotos do MESMO enquadramento —
          não dá para improvisar, nem em demo. Sem par real, a seção
          inteira sai do ar em vez de virar um comparador vazio. */}
      {temParAntesDepois || !MODO_DEMO ? <AntesEDepois /> : null}
      <OQueFazemos />
      <ComoFunciona />
      <OConstrutor />
      <Depoimentos depoimentos={depoimentos} />
      <AreaDeAtendimento cidades={cidades} />
      <ChamadaFinal />
    </>
  );
}

/**
 * Hero "do traço à obra": a foto real da obra pronta com a elevação em
 * linha se desenhando por cima, uma vez só. Sem carrossel, sem
 * "número gigante + gradiente".
 */
function Hero() {
  return (
    // A foto é escura e não muda com o tema, então o hero inteiro se
    // comporta como superfície de contraste: texto claro nos DOIS temas.
    // Sem isso, no tema claro o texto ficaria escuro sobre foto escura.
    <section className="superficie-escura relative overflow-hidden bg-contraste">
      <Image
        src="/obras/predio-residencial.webp"
        // Decorativa: o h1 por cima já diz o que precisa ser dito, e a
        // mesma obra aparece descrita na seção de obras logo abaixo.
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Véu escuro. Mais dele embaixo, que é onde o texto assenta —
          o gradiente garante o contraste independentemente do que
          apareça na foto quando ela for trocada por uma de maior
          resolução. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40"
      />

      <ElevacaoTraco className="absolute -right-16 top-16 h-[70%] text-sobre-contraste/25 sm:right-0 md:right-12 md:h-[78%] md:text-sobre-contraste/30" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[86rem] flex-col justify-end px-4 pb-16 pt-32 md:px-8 md:pb-24">
        <Entrada>
          <p className="etiqueta mb-6 flex items-center gap-3 text-vidro">
            <span className="h-px w-8 bg-marca" />
            {empresa.cidadeSede}/{empresa.uf} · {empresa.regiao}
          </p>
        </Entrada>

        {/* Palavra a palavra — é o único lugar do site com esse grau de
            ousadia. Largura em `em` e não em `ch`: `em` acompanha o
            tamanho da fonte, que não muda na troca; `ch` acompanha a
            largura do glifo, que muda, e faz o hero inteiro pular. */}
        <TituloEntrada
          texto={`Do traço à obra, em ${empresa.cidadeSede}.`}
          className="titulo max-w-[8.5em] text-[clamp(2.5rem,8.5vw,6rem)] text-sobre-contraste"
        />

        <Entrada atraso={340}>
          <p className="prosa mt-6 text-base text-vidro md:text-lg">
            Projeto e execução de casas, casas geminadas e prédios. A mesma
            equipe do primeiro desenho até a entrega das chaves.
          </p>
        </Entrada>

        <Entrada atraso={440}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotaoLink href={linkWhatsApp(mensagemPadraoWhatsApp)} externo tamanho="lg">
              <IconeWhatsApp className="size-5" />
              Falar no WhatsApp
            </BotaoLink>
            <BotaoLink href="/obras" variante="contornoClaro" tamanho="lg">
              Ver as obras
              <IconeSeta className="size-4" />
            </BotaoLink>
          </div>
        </Entrada>

        <Entrada atraso={540}>
          <p className="etiqueta mt-10 text-vidro/80">
            Prédio residencial · {empresa.cidadeSede}/{empresa.uf}
          </p>
        </Entrada>
      </div>
    </section>
  );
}

function ObrasEmDestaque({ obras }: { obras: Obra[] }) {
  return (
    <Secao
      id="obras"
      cota={`${obras.length} obra${obras.length === 1 ? "" : "s"}`}
      espacamento="solto"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <RotuloSecao>Obras</RotuloSecao>
          <TituloSecao>O que já está de pé</TituloSecao>
        </div>
        <BotaoLink href="/obras" variante="contorno">
          Ver todas
          <IconeSeta className="size-4" />
        </BotaoLink>
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {obras.map((obra, indice) => (
          // Cascata curta: 90ms entre cards. Mais que isso e a última
          // obra parece estar carregando devagar.
          <Revelar key={obra.slug} atraso={indice * 90}>
            <CardObra obra={obra} prioridade={indice === 0} />
          </Revelar>
        ))}
      </div>
    </Secao>
  );
}

function AntesEDepois() {
  return (
    <Secao tom="claro" cota="antes / depois">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <RotuloSecao>Antes e depois</RotuloSecao>
          <TituloSecao>O terreno era esse</TituloSecao>
          <p className="prosa mt-5 text-concreto">
            É a parte que foto pronta não conta. Arraste para ver o mesmo
            enquadramento antes de a obra começar e depois da entrega.
          </p>
        </div>

        <AntesDepois par={antesDepoisDestaque} />
      </div>
    </Secao>
  );
}

function OQueFazemos() {
  return (
    <Secao id="servicos" cota={`${servicos.length} frentes`}>
      <RotuloSecao>O que a Caciamani faz</RotuloSecao>
      <TituloSecao className="max-w-[18ch]">
        Casa, geminada, prédio e projeto
      </TituloSecao>

      <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {servicos.map((servico) => (
          <li key={servico.slug} className="border-t border-noite/15 pt-5">
            <h3 className="titulo text-xl">{servico.titulo}</h3>
            <p className="prosa mt-3 text-base text-concreto">{servico.descricao}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {servico.inclui.map((item) => (
                <li key={item} className="flex gap-2.5 text-base text-concreto">
                  <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-marca" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Secao>
  );
}

function ComoFunciona() {
  return (
    <Secao tom="noite" cota={`${etapas.length} etapas`}>
      <RotuloSecao tom="noite">Como funciona uma obra com a gente</RotuloSecao>
      <TituloSecao className="max-w-[20ch]">
        Do primeiro contato à entrega das chaves
      </TituloSecao>

      <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {etapas.map((etapa, indice) => (
          <li key={etapa.titulo} className="border-t border-sobre-contraste/20 pt-5">
            <span className="tabular text-sm text-marca">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <h3 className="titulo mt-3 text-xl text-sobre-contraste">{etapa.titulo}</h3>
            <p className="prosa mt-3 text-base text-vidro/75">{etapa.descricao}</p>
            <p className="etiqueta mt-4 text-vidro/70">{etapa.entrega}</p>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

/**
 * Em cidade pequena é a pessoa que fecha o negócio, não a marca.
 * Por isso esta seção tem peso de seção, não de rodapé.
 */
function OConstrutor() {
  const { proprietario } = empresa;

  return (
    <Secao cota="o construtor" espacamento="solto">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <RetratoProprietario />
        </div>

        <div>
          <RotuloSecao>Quem constrói</RotuloSecao>
          <TituloSecao>{proprietario.nome}</TituloSecao>

          <div className="mt-6">
            {proprietario.depoimento ? (
              <blockquote className="prosa text-lg text-noite md:text-xl">
                <p>“{proprietario.depoimento}”</p>
              </blockquote>
            ) : (
              <>
                {/* Aspas aqui só com fala real. Em demo entra descrição da
                    empresa em terceira pessoa — inventar frase e assinar
                    com o nome de uma pessoa real é outra coisa. */}
                {institucional.historia ? (
                  <p className="prosa mb-4 text-lg text-noite md:text-xl">
                    {institucional.historia}
                  </p>
                ) : null}
                <Pendente bloco>
                  uma fala do Carlos em primeira pessoa — por que ele construiu
                  a primeira obra, e o que ele não abre mão numa obra hoje
                </Pendente>
              </>
            )}
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6 border-t border-noite/15 pt-6">
            <div>
              <dt className="etiqueta text-concreto">No mercado desde</dt>
              <dd className="tabular mt-2 text-2xl">
                {institucional.desdeAno ?? <Pendente>ano</Pendente>}
              </dd>
            </div>
            <div>
              <dt className="etiqueta text-concreto">Atuação</dt>
              <dd className="mt-2 text-2xl">
                {empresa.cidadeSede}/{empresa.uf}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Secao>
  );
}

function Depoimentos({ depoimentos }: { depoimentos: TipoDepoimento[] }) {
  return (
    <Secao tom="claro" cota="clientes">
      <RotuloSecao>Depoimentos</RotuloSecao>
      <TituloSecao>Quem já construiu com a Caciamani</TituloSecao>

      {depoimentos.length === 0 ? (
        <div className="mt-8 max-w-xl">
          <Pendente bloco>
            depoimentos de clientes — nome, bairro/cidade, o texto do próprio
            cliente e autorização de uso. De preferência com a foto da obra
            dele.
          </Pendente>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {depoimentos.map((depoimento) => (
            <li key={depoimento.nome} className="border-t border-noite/15 pt-5">
              <blockquote className="prosa text-base">
                <p>“{depoimento.texto}”</p>
              </blockquote>
              <p className="etiqueta mt-4 text-concreto">
                {depoimento.nome} · {depoimento.bairro ? `${depoimento.bairro}, ` : ""}
                {depoimento.cidade}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Secao>
  );
}

function AreaDeAtendimento({ cidades }: { cidades: string[] }) {
  return (
    <Secao
      cota={`${cidades.length} cidade${cidades.length > 1 ? "s" : ""}`}
      espacamento="justo"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <RotuloSecao>Área de atendimento</RotuloSecao>
          <TituloSecao>Onde a gente constrói</TituloSecao>
          <p className="prosa mt-5 text-concreto">
            A obra é acompanhada de perto, então o raio de atendimento tem
            limite. Fora dessa área, vale conversar antes.
          </p>
        </div>

        <div>
          <ul className="flex flex-wrap gap-2">
            {cidades.map((cidade) => (
              <li
                key={cidade}
                className="etiqueta border border-noite/20 px-3 py-2.5 text-noite"
              >
                {cidade}/{empresa.uf}
              </li>
            ))}
          </ul>

          {cidades.length <= 1 ? (
            <div className="mt-5 max-w-lg">
              <Pendente bloco>
                lista nomeada das demais cidades atendidas — “extremo-oeste”
                cobre dezenas de municípios, e prometer atendimento onde não há
                é problema comercial
              </Pendente>
            </div>
          ) : null}
        </div>
      </div>
    </Secao>
  );
}

function ChamadaFinal() {
  return (
    <Secao tom="noite" cota="orçamento" espacamento="solto">
      <div className="max-w-3xl">
        <TituloSecao className="text-4xl md:text-6xl">
          Conte o que você quer construir
        </TituloSecao>
        <p className="prosa mt-6 text-vidro/80 md:text-lg">
          Em dois minutos o simulador dá uma faixa de investimento e o tempo
          estimado de obra. Não é proposta fechada — é o ponto de partida da
          conversa.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <BotaoLink href="/orcamento" tamanho="lg">
            Simular meu orçamento
            <IconeSeta className="size-4" />
          </BotaoLink>
          <BotaoLink
            href={linkWhatsApp(mensagemPadraoWhatsApp)}
            externo
            variante="contornoClaro"
            tamanho="lg"
          >
            <IconeWhatsApp className="size-5" />
            Falar direto no WhatsApp
          </BotaoLink>
        </div>
      </div>
    </Secao>
  );
}
