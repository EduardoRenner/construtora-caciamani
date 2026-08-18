import type { Coeficientes } from "@/config/orcamento";
import { empresa, type Estatistica } from "./empresa";
import type { Depoimento, Obra } from "./tipos";

/**
 * ─────────────────────────────────────────────────────────────────────
 * CONTEÚDO DEMONSTRATIVO — TUDO NESTE ARQUIVO É FICTÍCIO
 * ─────────────────────────────────────────────────────────────────────
 *
 * Existe por um motivo só: permitir apresentar o site ao Carlinhos como um
 * produto pronto, sem seção vazia, antes de a empresa fornecer os dados
 * reais. Nada daqui vai ao ar como informação da empresa.
 *
 * COMO LIGAR E DESLIGAR
 *
 *   NEXT_PUBLIC_MODO_DEMO=true   → o site usa o que estiver aqui para
 *                                  preencher o que ainda é `null`.
 *   variável ausente/false       → comportamento original do projeto:
 *                                  o que falta aparece como ⟨PENDENTE⟩.
 *
 * O dado real SEMPRE vence: o banco vem primeiro, a semente
 * (`src/content/*.ts`) vem depois, e isto aqui só entra onde os dois
 * deixaram buraco. Quando o conteúdo real chegar, é só desligar a flag
 * — nenhum texto deste arquivo precisa ser caçado no meio do código.
 *
 * O QUE NUNCA ENTRA AQUI (regra dura, não preferência)
 *
 *   CNPJ · razão social · CREA · responsável técnico · endereço ·
 *   certificação · prêmio · registro · dado financeiro real ·
 *   depoimento assinado por pessoa real identificável ·
 *   fala em primeira pessoa atribuída ao Carlinhos Primo Caciamani
 *
 * Esses continuam pendentes mesmo em modo demo, porque errar aí não é
 * "demo malfeita", é problema jurídico. Em modo demo eles aparecem como
 * um "a confirmar" discreto, que numa apresentação lê como campo a
 * preencher — e é exatamente o que são.
 */

export const MODO_DEMO = process.env.NEXT_PUBLIC_MODO_DEMO === "true";

/** Sufixo usado nos textos que precisam se identificar como demo na tela. */
export const AVISO_DEMO =
  "Conteúdo demonstrativo, para apresentação. Números, obras e depoimentos serão substituídos pelos dados reais da Caciamani.";

// ---------------------------------------------------------------------
// Números da faixa de prova
// ---------------------------------------------------------------------

/** Fictícios. Trocar pelos reais em `src/content/empresa.ts` ou no painel. */
export const estatisticasDemo: Estatistica[] = [
  {
    valor: 120,
    rotulo: "Clientes atendidos",
    qualificador: "Número demonstrativo",
  },
  {
    valor: 85,
    rotulo: "Projetos realizados",
    qualificador: "Número demonstrativo",
  },
  {
    valor: 97,
    rotulo: "Satisfação",
    sufixo: "%",
    qualificador: "Número demonstrativo",
  },
  {
    valor: 18,
    rotulo: "Anos de mercado",
    qualificador: "Número demonstrativo",
  },
];

// ---------------------------------------------------------------------
// Área de atendimento
// ---------------------------------------------------------------------

/**
 * Municípios reais do extremo-oeste catarinense, usados só para a
 * demonstração. Prometer atendimento onde não há é problema comercial —
 * a lista definitiva tem que vir do Carlinhos.
 */
export const cidadesDemo: string[] = [
  "Maravilha",
  "Pinhalzinho",
  "São Miguel do Oeste",
  "Cunha Porã",
  "Palmitos",
  "Modelo",
  "Iraceminha",
  "Bom Jesus do Oeste",
];

// ---------------------------------------------------------------------
// Portfólio
// ---------------------------------------------------------------------

/**
 * Obras inventadas. As capas NÃO são fotografias: são desenhos de
 * elevação gerados para este projeto (`scripts/gerar-capas-demo.mjs`),
 * com a palavra "ILUSTRAÇÃO" impressa no próprio desenho. Nenhuma
 * imagem de terceiro entra no site, e ninguém confunde desenho com obra
 * entregue.
 *
 * Aparecem DEPOIS das obras reais na listagem.
 */
export const obrasDemo: Obra[] = [
  {
    slug: "demo-residencia-jardim-das-araucarias",
    titulo: "Residência Jardim das Araucárias",
    tipo: "casa",
    cidade: "Maravilha",
    uf: "SC",
    ano: 2024,
    areaM2: 186,
    prazoMeses: 11,
    resumo:
      "Casa térrea em terreno de esquina, com suíte, escritório e área gourmet integrada ao pátio.",
    descricao:
      "Terreno de esquina com declive suave para os fundos. O programa pedia três dormitórios, escritório e uma área gourmet que fosse usada o ano inteiro — o que definiu a implantação foi justamente isso: a casa recuou da divisa mais alta para abrir o pátio a oeste, e a laje da varanda avançou o suficiente para o sol de verão não entrar na mesa. Estrutura em concreto armado, cobertura embutida em platibanda e esquadrias de alumínio anodizado.",
    capa: {
      src: "/obras/demo/casa-terrea.webp",
      alt: "Desenho de elevação de uma casa térrea com telhado embutido em platibanda, varanda avançada e pátio lateral",
    },
    galeria: [
      {
        src: "/obras/demo/casa-terrea.webp",
        alt: "Elevação frontal da casa térrea, com a varanda avançada sobre o pátio",
      },
    ],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
  {
    slug: "demo-residencia-alto-do-sol",
    titulo: "Residência Alto do Sol",
    tipo: "germinada",
    cidade: "Pinhalzinho",
    uf: "SC",
    ano: 2025,
    areaM2: 264,
    prazoMeses: 12,
    resumo:
      "Duas unidades espelhadas de 132 m², executadas em paralelo no mesmo terreno.",
    descricao:
      "Duas unidades espelhadas sobre uma parede compartilhada, cada uma com garagem coberta, três dormitórios e pátio próprio nos fundos. Executar as duas em paralelo é o que derruba o custo por unidade: a mesma fôrma, a mesma equipe de alvenaria e uma única mobilização de cobertura atendem as duas casas. A fachada disfarça a divisa com um volume central em pedra, para o conjunto não ler como “duas casas iguais”.",
    capa: {
      src: "/obras/demo/germinada.webp",
      alt: "Desenho de elevação de duas casas geminadas espelhadas, com volume central em pedra separando as entradas",
    },
    galeria: [
      {
        src: "/obras/demo/germinada.webp",
        alt: "Elevação das duas unidades espelhadas, com o volume central marcando a divisa",
      },
    ],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
  {
    slug: "demo-edificio-mirante-do-oeste",
    titulo: "Edifício Mirante do Oeste",
    tipo: "predio",
    cidade: "Maravilha",
    uf: "SC",
    ano: 2025,
    areaM2: 1240,
    prazoMeses: 26,
    resumo:
      "Doze apartamentos em quatro pavimentos, com garagem no térreo e salão de festas coberto.",
    descricao:
      "Doze apartamentos de dois e três dormitórios distribuídos em quatro pavimentos, com garagem no nível da rua e salão de festas na cobertura. O estudo de viabilidade veio antes do projeto: o que o terreno permitia em taxa de ocupação e recuo definiu o número de unidades, e só depois disso a planta foi desenhada. Incorporação registrada antes do início das vendas.",
    capa: {
      src: "/obras/demo/predio.webp",
      alt: "Desenho de elevação de um edifício residencial de quatro pavimentos, com sacadas alinhadas e acesso à garagem no térreo",
    },
    galeria: [
      {
        src: "/obras/demo/predio.webp",
        alt: "Elevação frontal do edifício, com as sacadas alinhadas em quatro pavimentos",
      },
    ],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
  {
    slug: "demo-reforma-casa-do-centro",
    titulo: "Reforma da casa do Centro",
    tipo: "reforma",
    cidade: "Maravilha",
    uf: "SC",
    ano: 2024,
    areaM2: 95,
    prazoMeses: 5,
    resumo:
      "Ampliação dos fundos e troca completa de instalações, com a família morando na casa.",
    descricao:
      "Casa dos anos 1990 que ganhou 42 m² nos fundos, cozinha integrada e instalações elétricas e hidráulicas refeitas do quadro ao ponto. O que muda o resultado numa obra assim é a sequência: a família continuou morando na casa, então a ampliação foi fechada e coberta antes de qualquer parede interna cair, e a área antiga só entrou em obra depois que a nova já era habitável.",
    capa: {
      src: "/obras/demo/reforma.webp",
      alt: "Desenho de elevação de uma casa reformada, com o volume da ampliação destacado nos fundos",
    },
    galeria: [
      {
        src: "/obras/demo/reforma.webp",
        alt: "Elevação da casa com o volume novo da ampliação marcado em traço cheio",
      },
    ],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
  {
    slug: "demo-projeto-casa-vale-verde",
    titulo: "Projeto Casa Vale Verde",
    tipo: "projeto",
    cidade: "Cunha Porã",
    uf: "SC",
    ano: 2025,
    areaM2: 248,
    prazoMeses: 3,
    resumo:
      "Projeto completo de sobrado, com quantitativo de material fechado para execução por terceiros.",
    descricao:
      "Sobrado de 248 m² em terreno com 4 metros de desnível: o pavimento inferior encaixa no talude e a sala se abre no nível de cima, sobre o vale. Entregue como projeto — arquitetônico, estrutural, elétrico e hidráulico, mais o quantitativo de material — para execução pela equipe do próprio cliente.",
    capa: {
      src: "/obras/demo/sobrado.webp",
      alt: "Desenho de elevação de um sobrado implantado em terreno com desnível, com o pavimento inferior encaixado no talude",
    },
    galeria: [
      {
        src: "/obras/demo/sobrado.webp",
        alt: "Elevação do sobrado, com o pavimento inferior encaixado no desnível do terreno",
      },
    ],
    antesDepois: [],
    destaque: false,
    publicada: true,
  },
];

// ---------------------------------------------------------------------
// Depoimentos
// ---------------------------------------------------------------------

/**
 * Fictícios e SEM nome de pessoa. Depoimento inventado com nome completo
 * é fácil de checar em cidade pequena, e quem descobre não volta — por
 * isso a assinatura descreve o tipo de cliente, nunca uma pessoa.
 */
export const depoimentosDemo: Depoimento[] = [
  {
    nome: "Cliente — casa térrea",
    cidade: "Maravilha",
    bairro: null,
    texto:
      "O que mais pesou foi saber o preço antes de a obra começar e ele não mudar no meio. Cada etapa tinha data, e quando atrasou uma semana por causa de chuva eles avisaram antes de eu perguntar. Depoimento demonstrativo.",
    foto: null,
    autorizado: true,
  },
  {
    nome: "Cliente — casas geminadas",
    cidade: "Pinhalzinho",
    bairro: null,
    texto:
      "Construí as duas unidades para alugar. A conta fechou porque foram executadas juntas, e a segunda ficou pronta duas semanas depois da primeira. Depoimento demonstrativo.",
    foto: null,
    autorizado: true,
  },
  {
    nome: "Cliente — reforma",
    cidade: "Maravilha",
    bairro: null,
    texto:
      "Moramos na casa durante a obra inteira, com duas crianças. Eles fecharam a parte nova antes de mexer na antiga, e a gente nunca ficou sem cozinha nem sem banheiro. Depoimento demonstrativo.",
    foto: null,
    autorizado: true,
  },
];

// ---------------------------------------------------------------------
// Institucional
// ---------------------------------------------------------------------

/**
 * Só o que não tem efeito jurídico. E-mail, endereço, CNPJ e CREA ficam
 * de fora de propósito — ver o cabeçalho deste arquivo.
 */
export const empresaDemo = {
  horarioAtendimento: "Segunda a sexta, das 8h às 18h · Sábado, das 8h às 12h",
  /** Ano de início. Demonstrativo; o real tem que vir do Carlinhos. */
  desdeAno: 2008,
  /** Texto sobre a empresa — não é fala de ninguém, é descrição. */
  historia:
    "Construtora com sede em Maravilha, no extremo-oeste catarinense, atuando em casas, casas geminadas, prédios residenciais e reformas. A mesma equipe acompanha a obra do primeiro desenho à entrega das chaves, com cronograma por etapa e preço fechado antes do início. Texto demonstrativo — a história real da empresa entra aqui.",
} as const;

/**
 * Institucional já resolvido: o dado real de `empresa.ts` quando existir,
 * o demonstrativo quando a flag estiver ligada, `null` fora do modo demo.
 * As páginas leem daqui e não precisam saber qual dos três está valendo.
 */
export const institucional = {
  horarioAtendimento:
    empresa.horarioAtendimento ??
    (MODO_DEMO ? empresaDemo.horarioAtendimento : null),
  desdeAno:
    empresa.proprietario.desdeAno ?? (MODO_DEMO ? empresaDemo.desdeAno : null),
  /**
   * Descrição da empresa em terceira pessoa. NÃO é — e não pode virar —
   * fala do Carlinhos: frase em primeira pessoa atribuída a pessoa real
   * continua pendente mesmo em modo demo.
   */
  historia: MODO_DEMO ? empresaDemo.historia : null,
};

// ---------------------------------------------------------------------
// Simulador de orçamento
// ---------------------------------------------------------------------

/**
 * Coeficientes FICTÍCIOS, só para o simulador calcular durante a
 * apresentação. Não são os custos da Caciamani e não servem para
 * orçar obra nenhuma.
 *
 * A calibragem real está descrita em `src/config/orcamento.ts`: pegar 3
 * ou 4 obras entregues, dividir o custo final pela área e comparar com o
 * CUB do mês em que cada uma rodou.
 */
export const coeficientesDemo: Coeficientes = {
  cubValorM2: 2850,
  cubProjetoPadrao: "R-8 Normal (valor demonstrativo)",
  cubReferencia: "demonstrativo",
  amplitude: 0.15,
  fatoresTipo: {
    "casa-terrea": 1.15,
    sobrado: 1.25,
    germinada: 1.05,
    predio: 1.35,
    reforma: 0.75,
    projeto: 0.12,
  },
  fatoresPadrao: { simples: 0.85, medio: 1, alto: 1.3 },
  prazos: {
    "casa-terrea": { base: 6, porCemM2: 2 },
    sobrado: { base: 7, porCemM2: 2.5 },
    germinada: { base: 7, porCemM2: 2 },
    predio: { base: 14, porCemM2: 3 },
    reforma: { base: 3, porCemM2: 1.5 },
    projeto: { base: 2, porCemM2: 0.5 },
  },
};
