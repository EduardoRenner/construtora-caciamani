/**
 * Conteúdo institucional da Construtora Caciamani.
 *
 * Fase atual: TypeScript tipado. Quando o painel admin entrar no ar
 * (fase 7), estes dados migram para o Supabase e este arquivo passa a
 * ser apenas o fallback de seed.
 *
 * REGRA DURA: nada aqui pode ser inventado. Estatística, ano, metragem,
 * CNPJ, CREA e endereço que o cliente ainda não forneceu ficam `null`,
 * e a interface renderiza <Pendente>. Número plausível inventado em site
 * de construtora é passivo legal e comercial.
 */

export interface Estatistica {
  /** `null` enquanto o cliente não fornecer o número real. */
  valor: number | null;
  rotulo: string;
  /** Frase curta que qualifica o número. `null` = pendente. */
  qualificador: string | null;
  sufixo?: string;
  prefixo?: string;
}

export interface Contato {
  /** Número no formato de exibição, ex.: "(49) 99192-7673". */
  exibicao: string;
  /** Só dígitos com DDI, para wa.me — ex.: "5549991927673". */
  internacional: string;
  rotulo: string;
  /** `false` enquanto o cliente não confirmar qual número é o oficial. */
  confirmado: boolean;
}

export const empresa = {
  nome: "Construtora Caciamani",
  nomeCurto: "Caciamani",
  /** Como a própria empresa se assina no material atual. */
  assinatura: "Construtora Incorporadora",
  proprietario: {
    nome: "Carlos Primo Caciamani",
    cargo: null as string | null,
    /** Fala em primeira pessoa — é o que fecha negócio em cidade pequena. */
    depoimento: null as string | null,
    desdeAno: null as number | null,
  },
  cidadeSede: "Maravilha",
  uf: "SC",
  regiao: "extremo-oeste catarinense",

  /**
   * Dados cadastrais. Não preencher por conta própria em hipótese
   * nenhuma — CNPJ e CREA errados no rodapé são problema jurídico.
   */
  cadastro: {
    razaoSocial: null as string | null,
    cnpj: null as string | null,
    crea: null as string | null,
    responsavelTecnico: null as string | null,
  },

  endereco: {
    logradouro: null as string | null,
    bairro: null as string | null,
    cidade: "Maravilha",
    uf: "SC",
    cep: null as string | null,
    /** Coordenadas para o JSON-LD LocalBusiness. */
    latitude: null as number | null,
    longitude: null as number | null,
  },

  horarioAtendimento: null as string | null,

  /**
   * O cliente confirmou: o WhatsApp do site é o (49) 99192-7673.
   * O (11) 99654-7673, que também aparecia no material público, NÃO
   * entra no site.
   */
  telefones: {
    principal: {
      exibicao: "(49) 99192-7673",
      internacional: "5549991927673",
      rotulo: "WhatsApp",
      confirmado: true,
    } satisfies Contato,
    fixo: null as Contato | null,
  },

  email: null as string | null,

  redes: {
    instagram: {
      usuario: "construtoracaciamani",
      url: "https://www.instagram.com/construtoracaciamani/",
    },
    facebook: {
      nome: "Construtora Caciamani",
      url: null as string | null,
    },
  },

  /**
   * Parceiro comercial que aparece no material da empresa. Só entra no
   * site se o cliente confirmar que quer.
   */
  corretorParceiro: {
    nome: "Marcos Aléssio",
    creci: "CRECI/SC 20.692",
    telefone: "(49) 98862-0341",
    incluirNoSite: false,
  },
} as const;

/**
 * Os quatro indicadores da faixa de prova da home.
 * Todos `null` até o cliente informar. Nunca preencher por estimativa.
 */
export const estatisticas: Estatistica[] = [
  {
    valor: null,
    rotulo: "Clientes atendidos",
    qualificador: null,
  },
  {
    valor: null,
    rotulo: "Projetos realizados",
    qualificador: null,
  },
  {
    valor: null,
    rotulo: "Satisfação",
    sufixo: "%",
    qualificador: null,
  },
  {
    valor: null,
    rotulo: "Anos de mercado",
    qualificador: null,
  },
];

/**
 * Cidades atendidas — entram no `areaServed` do JSON-LD e na seção de
 * área de atendimento. Só Maravilha está confirmada; a lista da região
 * precisa vir do cliente, porque "extremo-oeste" cobre dezenas de
 * municípios e prometer atendimento onde não há é problema comercial.
 */
export const cidadesAtendidas: string[] = ["Maravilha"];
export const cidadesAtendidasPendente = true;
