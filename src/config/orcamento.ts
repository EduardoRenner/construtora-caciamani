/**
 * SIMULADOR DE ORÇAMENTO — textos e coeficientes
 *
 * ─────────────────────────────────────────────────────────────────────
 * NENHUM NÚMERO AQUI FOI INVENTADO.
 *
 * Todo coeficiente que o cliente ainda não forneceu é `null`, e o
 * simulador diz na tela exatamente o que falta em vez de exibir um valor
 * plausível. Preço de obra chutado vira expectativa no cliente e
 * discussão no fechamento.
 * ─────────────────────────────────────────────────────────────────────
 *
 * MÉTODO — âncora no CUB/SC
 *
 * O CUB (Custo Unitário Básico) é publicado mensalmente pelo Sinduscon e
 * é a referência que o mercado já usa. Ancorar nele significa que:
 *   1. a estimativa é defensável se o cliente perguntar de onde saiu;
 *   2. a inflação do setor se corrige sozinha — o Carlos atualiza UM
 *      número e todo o simulador acompanha;
 *   3. os fatores viram multiplicadores pequenos, fáceis de calibrar.
 *
 *   custo = CUB × área × fatorDoTipo × fatorDoPadrão
 *   faixa = custo ± amplitude
 *
 * CALIBRAGEM: pegar 3 ou 4 obras entregues, dividir o custo final pela
 * área e comparar com o CUB do mês em que cada uma rodou. A razão é o
 * fator.
 *
 * Os números vivem em `Coeficientes`, separados dos textos, e são
 * passados como parâmetro — nunca lidos de estado global. É isso que
 * permite ao painel admin sobrescrevê-los por requisição sem que o valor
 * de um visitante vaze para outro.
 */

export type TipoConstrucao =
  | "casa-terrea"
  | "sobrado"
  | "germinada"
  | "predio"
  | "reforma"
  | "projeto";

export type PadraoAcabamento = "simples" | "medio" | "alto";

// ---------------------------------------------------------------------
// Textos da interface (não são dados de cálculo)
// ---------------------------------------------------------------------

export const tiposConstrucao: Array<{
  id: TipoConstrucao;
  rotulo: string;
  descricao: string;
}> = [
  {
    id: "casa-terrea",
    rotulo: "Casa térrea",
    descricao: "Tudo em um pavimento, sem escada.",
  },
  {
    id: "sobrado",
    rotulo: "Sobrado",
    descricao: "Dois pavimentos. Exige laje e escada, e o custo por m² sobe.",
  },
  {
    id: "germinada",
    rotulo: "Casas geminadas",
    descricao:
      "Duas ou mais unidades com parede compartilhada. Custa menos por unidade.",
  },
  {
    id: "predio",
    rotulo: "Prédio / multifamiliar",
    descricao: "Vários apartamentos. Entra elevador, área comum e incorporação.",
  },
  {
    id: "reforma",
    rotulo: "Reforma ou ampliação",
    descricao: "Mexer no que já existe. Varia muito com o estado do que está de pé.",
  },
  {
    id: "projeto",
    rotulo: "Só o projeto",
    descricao: "Você quer o projeto pronto e executa com outra equipe.",
  },
];

/**
 * ATENÇÃO: rascunho concreto, para o Carlos corrigir. Estes itens
 * definem expectativa de acabamento e viram discussão na obra se
 * estiverem errados. Ver PENDENCIAS.md → 4.6.
 */
export const padroesConfirmadosPeloCliente = false;

export const padroesAcabamento: Array<{
  id: PadraoAcabamento;
  rotulo: string;
  itens: string[];
}> = [
  {
    id: "simples",
    rotulo: "Simples",
    itens: [
      "Piso cerâmico",
      "Forro de PVC ou laje pintada",
      "Esquadria de alumínio branco",
      "Louças e metais de linha básica",
    ],
  },
  {
    id: "medio",
    rotulo: "Médio",
    itens: [
      "Porcelanato nas áreas sociais",
      "Forro de gesso com sanca",
      "Esquadria de alumínio anodizado",
      "Bancada em granito, box de vidro temperado",
    ],
  },
  {
    id: "alto",
    rotulo: "Alto",
    itens: [
      "Porcelanato de grande formato",
      "Marcenaria planejada e iluminação embutida",
      "Esquadria com vidro duplo ou pele de vidro",
      "Automação, aquecimento e acabamentos importados",
    ],
  },
];

export const faixaArea = { minimo: 40, maximo: 600, passo: 5 };

export type SituacaoTerreno = "tenho" | "vou-comprar";
export type PrazoInicio = "imediato" | "3-meses" | "6-meses" | "sem-data";

export const situacoesTerreno: Array<{ id: SituacaoTerreno; rotulo: string }> = [
  { id: "tenho", rotulo: "Já tenho o terreno" },
  { id: "vou-comprar", rotulo: "Ainda vou comprar" },
];

export const prazosInicio: Array<{ id: PrazoInicio; rotulo: string }> = [
  { id: "imediato", rotulo: "O quanto antes" },
  { id: "3-meses", rotulo: "Em até 3 meses" },
  { id: "6-meses", rotulo: "Em até 6 meses" },
  { id: "sem-data", rotulo: "Ainda sem data" },
];

export const etapasDoPanorama = [
  "Projeto, aprovação e documentação",
  "Terraplanagem e fundação",
  "Estrutura e alvenaria",
  "Cobertura e impermeabilização",
  "Instalações elétricas e hidráulicas",
  "Revestimentos, louças e metais",
  "Esquadrias, vidros e pintura",
  "Limpeza final e vistoria de entrega",
];

export const avisoLegal =
  "Esta é uma estimativa preliminar, calculada a partir de valores médios de referência. Não constitui proposta comercial. O valor final depende do projeto, do terreno, da sondagem do solo e das escolhas de acabamento.";

// ---------------------------------------------------------------------
// Coeficientes de cálculo
// ---------------------------------------------------------------------

export interface Coeficientes {
  /** CUB/SC em R$ por m². */
  cubValorM2: number | null;
  /** Qual projeto-padrão do CUB, ex.: "R-8 Normal". Só informativo. */
  cubProjetoPadrao: string | null;
  /** Mês de referência do CUB, ex.: "2026-07". Só informativo. */
  cubReferencia: string | null;
  /** Fração para a faixa: 0.15 = de −15% a +15%. */
  amplitude: number | null;
  fatoresTipo: Record<TipoConstrucao, number | null>;
  fatoresPadrao: Record<PadraoAcabamento, number | null>;
  /** Meses de base e meses adicionais a cada 100 m², por tipo. */
  prazos: Record<TipoConstrucao, { base: number | null; porCemM2: number | null }>;
}

const semPrazo = { base: null, porCemM2: null };

/** Estado inicial: tudo pendente. O painel sobrescreve com o que o Carlos salvar. */
export const coeficientesPadrao: Coeficientes = {
  cubValorM2: null,
  cubProjetoPadrao: null,
  cubReferencia: null,
  amplitude: null,
  fatoresTipo: {
    "casa-terrea": null,
    sobrado: null,
    germinada: null,
    predio: null,
    reforma: null,
    projeto: null,
  },
  fatoresPadrao: { simples: null, medio: null, alto: null },
  prazos: {
    "casa-terrea": { ...semPrazo },
    sobrado: { ...semPrazo },
    germinada: { ...semPrazo },
    predio: { ...semPrazo },
    reforma: { ...semPrazo },
    projeto: { ...semPrazo },
  },
};

export interface EntradaCalculo {
  tipo: TipoConstrucao;
  areaM2: number;
  padrao: PadraoAcabamento;
}

export type ResultadoOrcamento =
  | {
      calculavel: true;
      minimo: number;
      maximo: number;
      prazoMinimoMeses: number;
      prazoMaximoMeses: number;
    }
  | { calculavel: false; faltando: string[] };

/**
 * Arredonda ao milhar mais próximo.
 *
 * O `toFixed(2)` antes da divisão não é enfeite: em ponto flutuante,
 * 450000 × 1.15 dá 517499.99999999994, e o arredondamento direto cairia
 * para 517.000 em vez de 518.000. Normalizar aos centavos primeiro
 * elimina o resíduo binário antes que ele vire mil reais na tela.
 */
function arredondarAoMilhar(valor: number): number {
  return Math.round(Number(valor.toFixed(2)) / 1000) * 1000;
}

const rotuloTipo = (id: TipoConstrucao) =>
  tiposConstrucao.find((t) => t.id === id)?.rotulo ?? id;
const rotuloPadrao = (id: PadraoAcabamento) =>
  padroesAcabamento.find((p) => p.id === id)?.rotulo ?? id;

/**
 * Calcula a faixa estimada. Se qualquer coeficiente estiver faltando,
 * NÃO estima: devolve a lista do que falta, e a interface mostra isso.
 */
export function calcularOrcamento(
  entrada: EntradaCalculo,
  coeficientes: Coeficientes = coeficientesPadrao,
): ResultadoOrcamento {
  const fatorTipo = coeficientes.fatoresTipo[entrada.tipo] ?? null;
  const fatorPadrao = coeficientes.fatoresPadrao[entrada.padrao] ?? null;
  const prazo = coeficientes.prazos[entrada.tipo] ?? semPrazo;

  const faltando: string[] = [];
  if (coeficientes.cubValorM2 === null) faltando.push("o valor do CUB/SC por m²");
  if (coeficientes.amplitude === null) faltando.push("a amplitude da faixa de preço");
  if (fatorTipo === null) {
    faltando.push(`o fator de custo para “${rotuloTipo(entrada.tipo)}”`);
  }
  if (fatorPadrao === null) {
    faltando.push(`o fator de custo do padrão “${rotuloPadrao(entrada.padrao)}”`);
  }
  if (prazo.base === null || prazo.porCemM2 === null) {
    faltando.push(`o prazo de obra para “${rotuloTipo(entrada.tipo)}”`);
  }

  if (faltando.length > 0) return { calculavel: false, faltando };

  const central =
    coeficientes.cubValorM2! * entrada.areaM2 * fatorTipo! * fatorPadrao!;
  const meses = prazo.base! + (entrada.areaM2 / 100) * prazo.porCemM2!;

  return {
    calculavel: true,
    minimo: arredondarAoMilhar(central * (1 - coeficientes.amplitude!)),
    maximo: arredondarAoMilhar(central * (1 + coeficientes.amplitude!)),
    prazoMinimoMeses: Math.floor(meses),
    prazoMaximoMeses: Math.ceil(meses * 1.25),
  };
}
