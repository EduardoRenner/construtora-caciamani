/**
 * O que a Caciamani faz.
 *
 * ATENÇÃO — os textos abaixo foram escritos no tom certo (concreto, sem
 * adjetivo vazio), mas descrevem o MODO DE TRABALHAR da empresa, e isso
 * é fato, não estilo. O Carlos precisa confirmar ou corrigir cada linha
 * antes de o site ir ao ar: se a Caciamani não cuida da aprovação na
 * prefeitura, por exemplo, a frase precisa mudar.
 *
 * Ver PENDENCIAS.md → "Confirmar descrição dos serviços".
 */
export const servicosConfirmadosPeloCliente = false;

export interface Servico {
  slug: string;
  titulo: string;
  /** Uma frase que diga algo verdadeiro e específico. */
  descricao: string;
  /** O que está incluído, em itens concretos. */
  inclui: string[];
}

export const servicos: Servico[] = [
  {
    slug: "casas",
    titulo: "Casas",
    descricao:
      "Você chega com o terreno e o jeito que quer morar. A gente devolve projeto, prazo e preço antes de a primeira máquina entrar.",
    inclui: [
      "Projeto arquitetônico e complementares",
      "Execução completa, da fundação ao acabamento",
      "Cronograma por etapa, com prazo por escrito",
    ],
  },
  {
    slug: "germinadas",
    titulo: "Casas germinadas",
    descricao:
      "Duas ou três unidades no mesmo terreno. A parede compartilhada derruba o custo por unidade — é por isso que investidor da região constrói germinada para vender ou alugar.",
    inclui: [
      "Estudo de aproveitamento do terreno",
      "Unidades espelhadas ou independentes",
      "Execução das unidades em paralelo",
    ],
  },
  {
    slug: "predios",
    titulo: "Prédios e incorporação",
    descricao:
      "Do estudo de viabilidade do terreno até a entrega das unidades, com a documentação da incorporação em ordem.",
    inclui: [
      "Viabilidade do terreno",
      "Projeto legal e registro da incorporação",
      "Execução e entrega das unidades",
    ],
  },
  {
    slug: "reformas",
    titulo: "Reformas e ampliações",
    descricao:
      "Levantar um pavimento, ampliar os fundos, refazer o que ficou mal executado. Obra em casa habitada exige sequência pensada — e é isso que muda o resultado.",
    inclui: [
      "Avaliação do que já está construído",
      "Reforço estrutural quando o caso pede",
      "Obra faseada, para a casa seguir habitável",
    ],
  },
  {
    slug: "projetos",
    titulo: "Só o projeto",
    descricao:
      "Quando você já tem quem execute, mas quer o projeto bem resolvido e o quantitativo de material fechado antes de começar.",
    inclui: [
      "Arquitetônico, estrutural e complementares",
      "Quantitativo de material",
      "Documentação para aprovação",
    ],
  },
];
