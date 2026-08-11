/** Tipos do conteúdo do site. Espelham o que o admin vai editar na fase 7. */

export interface ImagemObra {
  /** Caminho da foto. `null` enquanto a foto real não chega do cliente. */
  src: string | null;
  /**
   * Texto alternativo descritivo de verdade — o que se vê na foto, não
   * "foto de obra". Obrigatório mesmo com `src` nulo, para que o texto
   * seja escrito junto com o conteúdo e não no fim, às pressas.
   */
  alt: string;
  largura?: number;
  altura?: number;
}

export interface ParAntesDepois {
  /** As duas fotos precisam ter o MESMO enquadramento e a MESMA proporção. */
  antes: ImagemObra;
  depois: ImagemObra;
  /** O que foi feito. */
  legenda: string | null;
  prazo: string | null;
  ano: number | null;
}

export type TipoObra = "casa" | "germinada" | "predio" | "reforma" | "projeto";

export const rotulosTipoObra: Record<TipoObra, string> = {
  casa: "Casa",
  germinada: "Casas germinadas",
  predio: "Prédio",
  reforma: "Reforma / ampliação",
  projeto: "Projeto",
};

export interface Obra {
  slug: string;
  titulo: string;
  tipo: TipoObra;
  cidade: string;
  uf: string;
  ano: number | null;
  areaM2: number | null;
  prazoMeses: number | null;
  /** Uma linha, para o card. */
  resumo: string | null;
  /** Texto da página da obra. */
  descricao: string | null;
  capa: ImagemObra;
  galeria: ImagemObra[];
  antesDepois: ParAntesDepois[];
  destaque: boolean;
  publicada: boolean;
}

export interface Depoimento {
  nome: string;
  cidade: string;
  bairro: string | null;
  texto: string;
  /** Foto da obra do próprio depoente, quando houver. */
  foto: ImagemObra | null;
  /** O cliente autorizou o uso do nome e do texto? Sem isso não publica. */
  autorizado: boolean;
}
