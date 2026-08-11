import type { DadosObra, EstagioLead, TipoInteracao } from "@/acoes/admin";
import { clienteSupabaseServidor } from "@/lib/supabase/servidor";

/**
 * Leituras do painel. Diferente de `lib/conteudo.ts`, aqui o cliente
 * carrega a sessão — é o que permite ver também o que ainda não foi
 * publicado, sem afrouxar as políticas de RLS para o público.
 */

export interface LinhaLead {
  id: string;
  criado_em: string;
  origem: string;
  nome: string;
  telefone: string;
  email: string | null;
  cidade: string | null;
  mensagem: string | null;
  tipo_construcao: string | null;
  area_m2: number | null;
  padrao_acabamento: string | null;
  estimativa_minima: number | null;
  estimativa_maxima: number | null;
  obra_slug: string | null;
  atendido: boolean;
  anotacoes: string | null;
  estagio: EstagioLead;
}

export interface LinhaObraAdmin {
  id: string;
  slug: string;
  titulo: string;
  tipo: string;
  cidade: string;
  publicada: boolean;
  destaque: boolean;
  ordem: number;
  capa_url: string | null;
  atualizado_em: string;
}

export async function listarObrasAdmin(): Promise<LinhaObraAdmin[]> {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return [];

  const { data } = await supabase
    .from("obras")
    .select("id, slug, titulo, tipo, cidade, publicada, destaque, ordem, capa_url, atualizado_em")
    .order("ordem", { ascending: true });

  return (data as LinhaObraAdmin[]) ?? [];
}

export async function obterObraAdmin(
  id: string,
): Promise<(DadosObra & { id: string }) | null> {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return null;

  const { data } = await supabase
    .from("obras")
    .select(
      "*, obra_fotos(url, alt, ordem), obra_antes_depois(antes_url, antes_alt, depois_url, depois_alt, legenda, prazo, ano, ordem)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  type Foto = { url: string; alt: string; ordem: number };
  type Par = {
    antes_url: string;
    antes_alt: string;
    depois_url: string;
    depois_alt: string;
    legenda: string | null;
    prazo: string | null;
    ano: number | null;
    ordem: number;
  };

  return {
    id: data.id,
    slug: data.slug,
    titulo: data.titulo,
    tipo: data.tipo,
    cidade: data.cidade,
    uf: data.uf,
    ano: data.ano,
    areaM2: data.area_m2,
    prazoMeses: data.prazo_meses,
    resumo: data.resumo,
    descricao: data.descricao,
    capaUrl: data.capa_url,
    capaAlt: data.capa_alt,
    destaque: data.destaque,
    publicada: data.publicada,
    ordem: data.ordem,
    fotos: ((data.obra_fotos ?? []) as Foto[])
      .sort((a, b) => a.ordem - b.ordem)
      .map((f) => ({ url: f.url, alt: f.alt })),
    antesDepois: ((data.obra_antes_depois ?? []) as Par[])
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => ({
        antesUrl: p.antes_url,
        antesAlt: p.antes_alt,
        depoisUrl: p.depois_url,
        depoisAlt: p.depois_alt,
        legenda: p.legenda,
        prazo: p.prazo,
        ano: p.ano,
      })),
  };
}

export async function listarLeads(filtros?: {
  origem?: string;
  desde?: string;
}): Promise<LinhaLead[]> {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return [];

  let consulta = supabase
    .from("leads")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(500);

  if (filtros?.origem) consulta = consulta.eq("origem", filtros.origem);
  if (filtros?.desde) consulta = consulta.gte("criado_em", filtros.desde);

  const { data } = await consulta;
  return (data as LinhaLead[]) ?? [];
}

export interface LinhaInteracao {
  id: string;
  criado_em: string;
  tipo: TipoInteracao;
  nota: string;
}

export interface LinhaTarefa {
  id: string;
  lead_id: string;
  titulo: string;
  vencimento: string;
  concluida: boolean;
}

/** Um lead com o nome do card, para as tarefas aparecerem no dashboard sem outra consulta. */
export interface TarefaComLead extends LinhaTarefa {
  lead_nome: string;
}

export async function obterLeadComHistorico(id: string): Promise<{
  lead: LinhaLead;
  interacoes: LinhaInteracao[];
  tarefas: LinhaTarefa[];
} | null> {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return null;

  const [lead, interacoes, tarefas] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("lead_interacoes")
      .select("id, criado_em, tipo, nota")
      .eq("lead_id", id)
      .order("criado_em", { ascending: false }),
    supabase
      .from("lead_tarefas")
      .select("id, lead_id, titulo, vencimento, concluida")
      .eq("lead_id", id)
      .order("vencimento", { ascending: true }),
  ]);

  if (!lead.data) return null;

  return {
    lead: lead.data as LinhaLead,
    interacoes: (interacoes.data as LinhaInteracao[]) ?? [],
    tarefas: (tarefas.data as LinhaTarefa[]) ?? [],
  };
}

/**
 * Tarefas não concluídas, com o nome do lead, para o aviso de
 * "atrasadas / para hoje" no início do painel. Limitado a 50 — se
 * passar disso, o problema não é técnico, é o Carlos não estar
 * concluindo tarefa nenhuma.
 */
export async function listarTarefasPendentes(): Promise<TarefaComLead[]> {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return [];

  const { data } = await supabase
    .from("lead_tarefas")
    .select("id, lead_id, titulo, vencimento, concluida, leads(nome)")
    .eq("concluida", false)
    .order("vencimento", { ascending: true })
    .limit(50);

  return ((data ?? []) as unknown as Array<LinhaTarefa & { leads: { nome: string } | null }>).map(
    (t) => ({
      id: t.id,
      lead_id: t.lead_id,
      titulo: t.titulo,
      vencimento: t.vencimento,
      concluida: t.concluida,
      lead_nome: t.leads?.nome ?? "(contato removido)",
    }),
  );
}

export interface LinhaDepoimento {
  id: string;
  nome: string;
  cidade: string;
  bairro: string | null;
  texto: string;
  autorizado: boolean;
  publicado: boolean;
  ordem: number;
}

export async function listarDepoimentosAdmin(): Promise<LinhaDepoimento[]> {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return [];

  const { data } = await supabase
    .from("depoimentos")
    .select("id, nome, cidade, bairro, texto, autorizado, publicado, ordem")
    .order("ordem", { ascending: true });

  return (data as LinhaDepoimento[]) ?? [];
}
