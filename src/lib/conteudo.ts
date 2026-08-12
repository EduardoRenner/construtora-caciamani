import { coeficientesPadrao, type Coeficientes } from "@/config/orcamento";
import {
  cidadesAtendidas as cidadesSemente,
  estatisticas as estatisticasSemente,
  type Estatistica,
} from "@/content/empresa";
import { depoimentosPublicaveis as depoimentosSemente } from "@/content/depoimentos";
import {
  MODO_DEMO,
  cidadesDemo,
  coeficientesDemo,
  depoimentosDemo,
  estatisticasDemo,
  obrasDemo,
} from "@/content/demo";
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
 *
 * Com `NEXT_PUBLIC_MODO_DEMO=true` entra um terceiro nível, sempre por
 * último: o conteúdo demonstrativo de `src/content/demo.ts`. Ele nunca
 * substitui dado real — só preenche o buraco que banco e semente
 * deixaram. Desligar a flag devolve o site ao comportamento original.
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

async function obrasDoBanco(): Promise<Obra[]> {
  const supabase = clienteSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("obras")
    .select(SELECAO_OBRA)
    .eq("publicada", true)
    .order("ordem", { ascending: true });

  if (error || !data) {
    console.error("[conteudo] Falha ao ler obras:", error?.message);
    return [];
  }

  return (data as unknown as LinhaObra[]).map(paraObra);
}

/** Junta as listas na ordem dada; o primeiro slug que aparece vence. */
function mesclarPorSlug(...listas: Obra[][]): Obra[] {
  const vistos = new Set<string>();
  const saida: Obra[] = [];

  for (const lista of listas) {
    for (const obra of lista) {
      if (vistos.has(obra.slug)) continue;
      vistos.add(obra.slug);
      saida.push(obra);
    }
  }

  return saida;
}

export async function obterObras(): Promise<Obra[]> {
  const doBanco = await obrasDoBanco();

  // Comportamento original: o banco manda; a semente só cobre banco
  // vazio (ou fora do ar), para a página de obras nunca ficar em branco.
  if (!MODO_DEMO) return doBanco.length > 0 ? doBanco : obrasSemente;

  // Em demo o portfólio é a soma dos três, sem repetir slug: primeiro o
  // que o Carlos cadastrou, depois as obras reais da semente, e só então
  // as demonstrativas. Obra sem foto vai para o fim — a listagem tem que
  // abrir com imagem.
  const todas = mesclarPorSlug(doBanco, obrasSemente, obrasDemo);
  return [
    ...todas.filter((obra) => obra.capa.src),
    ...todas.filter((obra) => !obra.capa.src),
  ];
}

/**
 * Destaques da home. No máximo 6 — duas fileiras cheias, sem card órfão
 * na terceira. Em demo, obra sem foto fica de fora: na home a grade de
 * obras é a prova visual, e um retângulo hachurado no meio dela derruba
 * o efeito. A obra continua aparecendo em `/obras`, com a pendência.
 */
export async function obterObrasDestaque(): Promise<Obra[]> {
  const destaques = (await obterObras()).filter((obra) => obra.destaque);
  const visiveis = MODO_DEMO
    ? destaques.filter((obra) => obra.capa.src)
    : destaques;

  return visiveis.slice(0, 6);
}

export async function obterObra(slug: string): Promise<Obra | undefined> {
  return (await obterObras()).find((obra) => obra.slug === slug);
}

export async function obterEstatisticas(): Promise<Estatistica[]> {
  const valor = await obterConfiguracao<Estatistica[]>("estatisticas");
  const atuais = valor ?? estatisticasSemente;

  // Demo preenche indicador por indicador: se o Carlos já salvou dois
  // números no painel, esses dois continuam valendo.
  if (!MODO_DEMO) return atuais;

  return atuais.map((estatistica) => {
    if (estatistica.valor !== null) return estatistica;
    const demo = estatisticasDemo.find((d) => d.rotulo === estatistica.rotulo);
    return demo ?? estatistica;
  });
}

export async function obterCidades(): Promise<string[]> {
  const valor = await obterConfiguracao<string[]>("cidades");
  if (valor && valor.length > 0) return valor;
  // A semente tem só Maravilha, que é a única cidade confirmada — em
  // demo isso deixaria a seção de atendimento com uma etiqueta só.
  if (MODO_DEMO && cidadesSemente.length <= 1) return cidadesDemo;
  return cidadesSemente;
}

/** Depoimento real publicado sempre vence; o demo só cobre lista vazia. */
function comDepoimentosDemo(depoimentos: Depoimento[]): Depoimento[] {
  if (depoimentos.length > 0) return depoimentos;
  return MODO_DEMO ? depoimentosDemo : depoimentos;
}

export async function obterDepoimentos(): Promise<Depoimento[]> {
  const supabase = clienteSupabase();
  if (!supabase) return comDepoimentosDemo(depoimentosSemente);

  const { data, error } = await supabase
    .from("depoimentos")
    .select("nome, cidade, bairro, texto, foto_url, foto_alt, autorizado")
    .eq("publicado", true)
    .eq("autorizado", true)
    .order("ordem", { ascending: true });

  if (error || !data || data.length === 0) {
    return comDepoimentosDemo(depoimentosSemente);
  }

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
  // Em demo a base é a tabela fictícia, para o simulador calcular durante
  // a apresentação em vez de listar o que falta. O que o Carlos salvar no
  // painel continua sobrescrevendo, chave por chave.
  const base = MODO_DEMO ? coeficientesDemo : coeficientesPadrao;

  const valor = await obterConfiguracao<Coeficientes>("orcamento");
  if (!valor) return base;

  // Mescla com o padrão para que uma chave nova no código não quebre um
  // registro salvo antes de ela existir.
  return {
    ...base,
    ...valor,
    fatoresTipo: { ...base.fatoresTipo, ...valor.fatoresTipo },
    fatoresPadrao: { ...base.fatoresPadrao, ...valor.fatoresPadrao },
    prazos: { ...base.prazos, ...valor.prazos },
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
