import type { Metadata } from "next";
import { Simulador } from "@/components/orcamento/Simulador";
import { TopoPagina } from "@/components/TopoPagina";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsApp } from "@/components/ui/Icones";
import { Secao } from "@/components/ui/Secao";
import { empresa } from "@/content/empresa";
import { obterCoeficientes } from "@/lib/conteudo";
import { linkWhatsApp } from "@/lib/site";

export const metadata: Metadata = {
  title: "Simulador de orçamento",
  description: `Estimativa preliminar de investimento e prazo para construir em ${empresa.cidadeSede} e região. Em seis passos, sem cadastro.`,
  alternates: { canonical: "/orcamento" },
};

/** Recalcula a página a cada 5 min para pegar recalibragem feita no painel. */
export const revalidate = 300;

export default async function OrcamentoPage() {
  const coeficientes = await obterCoeficientes();

  return (
    <>
      <TopoPagina
        rotulo="Orçamento"
        titulo="Quanto custa a sua obra"
        descricao="Seis perguntas rápidas para chegar a uma faixa de investimento e a um prazo estimado. Não é proposta fechada — é o ponto de partida da conversa."
        cota="6 passos"
      />

      <Secao espacamento="justo">
        <div className="max-w-4xl">
          {/* O simulador é renderizado no servidor, então sem JavaScript ele
              apareceria na tela e simplesmente não avançaria de passo. O
              <style> dentro do <noscript> o esconde nesse caso, deixando só
              o caminho que funciona. */}
          <noscript>
            <style>{`.requer-js { display: none !important; }`}</style>
          </noscript>

          <div className="requer-js">
            <Simulador coeficientes={coeficientes} />
          </div>

          <noscript>
            <div className="border border-noite/20 bg-cal-2 p-6">
              <h2 className="titulo text-xl">O simulador precisa de JavaScript</h2>
              <p className="prosa mt-3 text-sm text-concreto">
                Ele funciona em etapas, e isso não roda sem JavaScript. Mas você
                não precisa dele para falar com a gente: manda uma mensagem
                dizendo o que quer construir, o tamanho aproximado e a cidade.
              </p>
              <BotaoLink
                href={linkWhatsApp(
                  "Olá! Quero um orçamento com a Construtora Caciamani. Vou construir:",
                )}
                externo
                className="mt-6"
              >
                <IconeWhatsApp className="size-5" />
                Falar no WhatsApp
              </BotaoLink>
            </div>
          </noscript>
        </div>
      </Secao>
    </>
  );
}
