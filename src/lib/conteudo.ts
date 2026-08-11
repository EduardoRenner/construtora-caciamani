import { coeficientesPadrao, type Coeficientes } from "@/config/orcamento";
import {
  cidadesAtendidas as cidadesSemente,
  estatisticas as estatisticasSemente,
  type Estatistica,
} from "@/content/empresa";
import { depoimentosPublicaveis as depoimentosSemente } from "@/content/depoimentos";
import { obrasPublicadas as obrasSemente } from "@/content/obras";
import type { Depoimento, Obra, TipoObra } from "@/content/tipos";
import { clienteSupabase } from "@/lib/supabase/publico";

/**
 * Acesso ao conteúdo do site.
 *
 * Cada função tenta o Supabase e, se ele não estiver configurado ou a
 * consulta falhar, cai no conteúdo de `src/content/*.ts`. O site nunca
 * fica no ar sem conteúdo por causa de banco fora do ar — no pior caso
 * ele mostra a semente, que é exatamente o que mostra hoje.
 */

interface LinhaObra {
  id: string;
  slug: string;
  titulo: string;
  tipo: TipoObra;
  cidade: string;
  uf: string;
  ano: number | null;
  area_m2: number | null;
  prazo_meses: number | null;
  resumo: string | null;
  descricao: string | null;
  capa_url: string | null;
  capa_alt: string | null;
  destaque: boolean;
  publicada: boolean;
  obra_fotos?: Array<{ url: string; alt: string; ordem: number }>;
  obra_antes_depois?: Array<{
    antes_url: string;
    antes_alt: string;
    depois_url: string;
    depois_alt: string;
    legenda: string | null;
    prazo: string | null;
    ano: number | null;
    ordem: number;
  }>;
}

function paraObra(linha: LinhaObra): Obra {
  return {
    slug: linha.slug,
    titulo: linha.titulo,
    tipo: linha.tipo,
    cidade: linha.cidade,
    uf: linha.uf,
    ano: linha.ano,
    areaM2: linha.area_m2,
    prazoMeses: linha.prazo_meses,
    resumo: linha.resumo,
    descricao: linha.descricao,
    capa: {
      src: linha.capa_url,
      alt: linha.capa_alt ?? `Foto da obra ${linha.titulo}`,
    },
    galeria: (linha.obra_fotos ?? [])
      .sort((a, b) => a.ordem - b.ordem)
      .map((foto) => ({ src: foto.url, alt: foto.alt })),
    antesDepois: (linha.obra_antes_depois ?? [])
      .sort((a, b) => a.ordem - b.ordem)
      .map((par) => ({
        antes: { src: par.antes_url, alt: par.antes_alt },
        depois: { src: par.depois_url, alt: par.depois_alt },
        legenda: par.legenda,
        prazo: par.prazo,
        ano: par.ano,
      })),
    destaque: linha.destaque,
    publicada: linha.publicada,
  };
}

const SELECAO_OBRA =
  "*, obra_fotos(url, alt, ordem), obra_antes_depois(antes_url, antes_alt, depois_url, depois_alt, legenda, prazo, ano, ordem)";

export async function obterObras(): Promise<Obra[]> {
  const supabase = clienteSupabase();
  if (!supabase) return obrasSemente;

  const { data, error } = await supabase
    .from("obras")
    .select(SELECAO_OBRA)
    .eq("publicada", true)
    .order("ordem", { ascending: true });

  if (error || !data) {
    console.error("[conteudo] Falha ao ler obras:", error?.message);
    return obrasSemente;
  }

  // Banco vazio (ainda não migraram o conteúdo): mostra a semente em vez
  // de uma página de obras em branco.
  if (data.length === 0) return obrasSemente;

  return (data as unknown as LinhaObra[]).map(paraObra);
}

export async function obterObrasDestaque(): Promise<Obra[]> {
  return (await obterObras()).filter((obra) => obra.destaque);
}

export async function obterObra(slug: string): Promise<Obra | undefined> {
  return (await obterObras()).find((obra) => obra.slug === slug);
}

export async function obterEstatisticas(): Promise<Estatistica[]> {
  const valor = await obterConfiguracao<Estatistica[]>("estatisticas");
  return valor ?? estatisticasSemente;
}

export async function obterCidades(): Promise<string[]> {
  const valor = await obterConfiguracao<string[]>("cidades");
  return valor && valor.length > 0 ? valor : cidadesSemente;
}

export async function obterDepoimentos(): Promise<Depoimento[]> {
  const supabase = clienteSupabase();
  if (!supabase) return depoimentosSemente;

  const { data, error } = await supabase
    .from("depoimentos")
    .select("nome, cidade, bairro, texto, foto_url, foto_alt, autorizado")
    .eq("publicado", true)
    .eq("autorizado", true)
    .order("ordem", { ascending: true });

  if (error || !data) return depoimentosSemente;

  return data.map((linha) => ({
    nome: linha.nome,
    cidade: linha.cidade,
    bairro: linha.bairro,
    texto: linha.texto,
    foto: linha.foto_url
      ? { src: linha.foto_url, alt: linha.foto_alt ?? `Obra de ${linha.nome}` }
      : null,
    autorizado: linha.autorizado,
  }));
}

export async function obterCoeficientes(): Promise<Coeficientes> {
  const valor = await obterConfiguracao<Coeficientes>("orcamento");
  if (!valor) return coeficientesPadrao;

  // Mescla com o padrão para que uma chave nova no código não quebre um
  // registro salvo antes de ela existir.
  return {
    ...coeficientesPadrao,
    ...valor,
    fatoresTipo: { ...coeficientesPadrao.fatoresTipo, ...valor.fatoresTipo },
    fatoresPadrao: { ...coeficientesPadrao.fatoresPadrao, ...valor.fatoresPadrao },
    prazos: { ...coeficientesPadrao.prazos, ...valor.prazos },
  };
}

export async function obterConfiguracao<T>(chave: string): Promise<T | null> {
  const supabase = clienteSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("configuracoes")
    .select("valor")
    .eq("chave", chave)
    .maybeSingle();

  if (error || !data) return null;
  return data.valor as T;
}
