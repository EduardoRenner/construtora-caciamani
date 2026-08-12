import { Pendente } from "@/components/Pendente";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsApp } from "@/components/ui/Icones";
import {
  avisoLegal,
  etapasDoPanorama,
  type ResultadoOrcamento,
} from "@/config/orcamento";
import { MODO_DEMO } from "@/content/demo";
import { linkWhatsApp } from "@/lib/site";
import { reaisBR } from "@/lib/utils";

/**
 * Tela de resultado. Nunca mostra valor único — obra tem variação, e
 * fingir precisão gera discussão no fechamento.
 *
 * Quando os coeficientes ainda não foram calibrados, ela diz exatamente
 * isso e o que falta, em vez de exibir um número plausível. O caminho
 * para o WhatsApp continua aberto nos dois casos: é ele que converte.
 */
export function Resultado({
  resultado,
  mensagem,
  gravado,
}: {
  resultado: ResultadoOrcamento;
  mensagem: string;
  gravado: boolean;
}) {
  return (
    <div>
      <p className="etiqueta flex items-center gap-3 text-concreto">
        <span className="h-px w-6 bg-marca" />
        Estimativa preliminar
      </p>

      {resultado.calculavel ? (
        <>
          <h2 className="titulo mt-5 text-3xl md:text-5xl">
            Entre {reaisBR(resultado.minimo)} e {reaisBR(resultado.maximo)}
          </h2>
          <p className="tabular mt-4 text-lg text-concreto">
            Prazo estimado de obra: {resultado.prazoMinimoMeses} a{" "}
            {resultado.prazoMaximoMeses} meses
          </p>
          {/* Número na tela sem dizer de onde veio é o que este projeto
              evita desde o começo. Em demo, a faixa sai de coeficientes
              fictícios — e isso fica escrito ao lado dela. */}
          {MODO_DEMO ? (
            <p className="prosa mt-4 border-l-2 border-marca/60 pl-4 text-sm text-concreto">
              Faixa calculada com coeficientes demonstrativos, para a
              apresentação. Não são os custos da Caciamani. A calibragem real
              usa o CUB/SC vigente e o histórico de obras entregues.
            </p>
          ) : null}
        </>
      ) : (
        <>
          <h2 className="titulo mt-5 text-3xl md:text-4xl">
            O simulador ainda não está calibrado
          </h2>
          <p className="prosa mt-4 text-concreto">
            Os dados da sua obra foram registrados e já dá para conversar. O
            cálculo automático depende destes valores, que ainda não foram
            informados pela construtora:
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {resultado.faltando.map((item) => (
              <li key={item}>
                <Pendente>{item}</Pendente>
              </li>
            ))}
          </ul>
        </>
      )}

      <section className="mt-12 border-t border-noite/15 pt-8">
        <h3 className="etiqueta text-concreto">O que entra numa obra dessas</h3>
        <ol className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {etapasDoPanorama.map((etapa, indice) => (
            <li key={etapa} className="flex gap-3 text-sm">
              {/* Amarelo sobre `cal` dá 2.25:1 — ver nota em /servicos. */}
              <span className="tabular text-noite">
                {String(indice + 1).padStart(2, "0")}
              </span>
              {etapa}
            </li>
          ))}
        </ol>
      </section>

      <p className="prosa mt-10 border-l-2 border-oxido/50 pl-4 text-sm text-concreto">
        {avisoLegal}
      </p>

      <BotaoLink
        href={linkWhatsApp(mensagem)}
        externo
        tamanho="lg"
        className="mt-8 w-full sm:w-auto"
      >
        <IconeWhatsApp className="size-5" />
        Enviar para o Carlos no WhatsApp
      </BotaoLink>

      {!gravado ? (
        <p className="mt-5 max-w-lg">
          <Pendente>
            Supabase não configurado neste ambiente — o lead não foi gravado.
            Só aparece em desenvolvimento.
          </Pendente>
        </p>
      ) : null}
    </div>
  );
}
