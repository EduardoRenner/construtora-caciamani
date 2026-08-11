import type { Obra } from "./tipos";

/**
 * Obras da Caciamani.
 *
 * As três entradas abaixo vêm do material público da própria empresa
 * (destaques e posts do Instagram): o prédio, as duas casas germinadas
 * em Maravilha e as três germinadas. Título, tipo e cidade são reais.
 *
 * Metragem, prazo, ano, descrição e fotos ficam `null` porque o cliente
 * ainda não forneceu — e número de obra inventado é passivo comercial.
 * Enquanto forem `null`, a interface mostra ⟨PENDENTE⟩.
 */
export const obras: Obra[] = [
  {
    slug: "predio-residencial",
    titulo: "Prédio residencial",
    tipo: "predio",
    cidade: "Maravilha",
    uf: "SC",
    ano: null,
    areaM2: null,
    prazoMeses: null,
    resumo: null,
    descricao: null,
    capa: {
      src: "/obras/predio-residencial.webp",
      alt: "Render do prédio residencial da Caciamani ao anoitecer: cinco pavimentos, sacadas iluminadas na fachada frontal e acesso à garagem no nível da rua",
    },
    galeria: [
      {
        src: "/obras/predio-residencial.webp",
        alt: "Render do prédio residencial visto da esquina, com as sacadas iluminadas e o céu no fim da tarde",
      },
    ],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
  {
    slug: "duas-casas-geminadas-maravilha",
    titulo: "Duas casas germinadas",
    tipo: "germinada",
    cidade: "Maravilha",
    uf: "SC",
    ano: null,
    areaM2: null,
    prazoMeses: null,
    resumo: null,
    descricao: null,
    capa: {
      src: "/obras/duas-casas-geminadas.webp",
      alt: "Render das duas casas germinadas em Maravilha: fachada simétrica, coluna central em pedra natural e iluminação embutida sob a marquise",
    },
    galeria: [
      {
        src: "/obras/duas-casas-geminadas.webp",
        alt: "Fachada das duas casas germinadas ao anoitecer, com a coluna de pedra separando as duas entradas",
      },
    ],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
  {
    slug: "tres-casas-geminadas",
    titulo: "Três casas germinadas",
    tipo: "germinada",
    cidade: "Maravilha",
    uf: "SC",
    ano: null,
    areaM2: null,
    prazoMeses: null,
    resumo: null,
    descricao: null,
    capa: {
      src: null,
      alt: "Conjunto de três casas germinadas construídas pela Caciamani",
    },
    galeria: [],
    antesDepois: [],
    destaque: true,
    publicada: true,
  },
];

export const obrasPublicadas = obras.filter((obra) => obra.publicada);
export const obrasDestaque = obrasPublicadas.filter((obra) => obra.destaque);

export function obraPorSlug(slug: string): Obra | undefined {
  return obrasPublicadas.find((obra) => obra.slug === slug);
}

/**
 * Pares antes/depois da home. Ainda não temos nenhum par real — as duas
 * fotos precisam ter o mesmo enquadramento, e isso tem que ser
 * fotografado de propósito. O componente funciona sem as fotos, com
 * placeholder, para que o comportamento possa ser avaliado agora.
 */
export const antesDepoisDestaque = {
  antes: {
    src: null,
    alt: "Terreno antes do início da obra, visto da rua",
  },
  depois: {
    src: null,
    alt: "A mesma vista com a casa pronta, no mesmo enquadramento",
  },
  legenda: null,
  prazo: null,
  ano: null,
};
