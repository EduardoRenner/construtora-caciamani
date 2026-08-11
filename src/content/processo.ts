/**
 * Como funciona uma obra com a Caciamani.
 *
 * Aqui a numeração 01/02/03 é legítima: é sequência de verdade, não
 * enfeite de layout.
 *
 * MESMA RESSALVA dos serviços — estas etapas descrevem um processo real
 * de obra, mas o Carlos precisa confirmar que é assim que ELE trabalha.
 * Ver PENDENCIAS.md.
 */
export const processoConfirmadoPeloCliente = false;

export interface Etapa {
  titulo: string;
  descricao: string;
  /** O que o cliente recebe ao fim da etapa. */
  entrega: string;
}

export const etapas: Etapa[] = [
  {
    titulo: "Conversa e visita ao terreno",
    descricao:
      "A gente vai até o terreno antes de falar em preço. Declividade, acesso, o que o solo aguenta e o que a prefeitura permite ali mudam o orçamento inteiro.",
    entrega: "Leitura do terreno e faixa de investimento",
  },
  {
    titulo: "Anteprojeto e orçamento",
    descricao:
      "Planta em cima do jeito que você quer morar, e o orçamento em cima da planta — não o contrário.",
    entrega: "Anteprojeto e orçamento detalhado",
  },
  {
    titulo: "Contrato e cronograma",
    descricao:
      "Prazo, forma de pagamento e o que está e o que não está incluído, tudo por escrito antes de a obra começar.",
    entrega: "Contrato assinado e cronograma por etapa",
  },
  {
    titulo: "Fundação e estrutura",
    descricao:
      "A parte que ninguém vê depois de pronta e que define se a casa vai ter problema em dez anos.",
    entrega: "Estrutura executada e conferida",
  },
  {
    titulo: "Alvenaria, instalações e cobertura",
    descricao:
      "Paredes, elétrica, hidráulica e telhado. É a etapa em que dá para visitar a obra e entender o tamanho real dos ambientes.",
    entrega: "Obra fechada, pronta para acabamento",
  },
  {
    titulo: "Acabamento e entrega das chaves",
    descricao:
      "Revestimento, louça, metais, pintura e a vistoria final item por item, com você junto.",
    entrega: "Chaves e manual da casa",
  },
];
