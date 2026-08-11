"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Coeficientes } from "@/config/orcamento";
import type { Estatistica } from "@/content/empresa";
import { clienteSupabaseServidor, usuarioAtual } from "@/lib/supabase/servidor";

export interface Resposta {
  ok: boolean;
  erro?: string;
}

/**
 * Toda ação passa por aqui antes de tocar no banco.
 *
 * Não é a única trava: as políticas de RLS no Postgres barram escrita de
 * quem não está autenticado mesmo que esta função falhe. Isto aqui é a
 * primeira porta, para dar erro claro em vez de erro do banco.
 */
async function exigirSessao() {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/admin/entrar");

  const supabase = await clienteSupabaseServidor();
  if (!supabase) throw new Error("Supabase não configurado.");

  return supabase;
}

/**
 * Recalcula as páginas públicas afetadas.
 * Sem isto, o Carlos salva e continua vendo o site velho por até 5
 * minutos — e conclui que o painel não funciona.
 */
function recalcularSite(caminhos: string[] = []) {
  ["/", "/obras", ...caminhos].forEach((caminho) => revalidatePath(caminho));
}

export async function sair() {
  const supabase = await clienteSupabaseServidor();
  await supabase?.auth.signOut();
  redirect("/admin/entrar");
}

// ---------------------------------------------------------------------
// Obras
// ---------------------------------------------------------------------

export interface DadosObra {
  id?: string;
  slug: string;
  titulo: string;
  tipo: string;
  cidade: string;
  uf: string;
  ano: number | null;
  areaM2: number | null;
  prazoMeses: number | null;
  resumo: string | null;
  descricao: string | null;
  capaUrl: string | null;
  capaAlt: string | null;
  destaque: boolean;
  publicada: boolean;
  ordem: number;
  fotos: Array<{ url: string; alt: string }>;
  antesDepois: Array<{
    antesUrl: string;
    antesAlt: string;
    depoisUrl: string;
    depoisAlt: string;
    legenda: string | null;
    prazo: string | null;
    ano: number | null;
  }>;
}

export async function salvarObra(dados: DadosObra): Promise<Resposta> {
  const supabase = await exigirSessao();

  const linha = {
    slug: dados.slug,
    titulo: dados.titulo,
    tipo: dados.tipo,
    cidade: dados.cidade,
    uf: dados.uf,
    ano: dados.ano,
    area_m2: dados.areaM2,
    prazo_meses: dados.prazoMeses,
    resumo: dados.resumo,
    descricao: dados.descricao,
    capa_url: dados.capaUrl,
    capa_alt: dados.capaAlt,
    destaque: dados.destaque,
    publicada: dados.publicada,
    ordem: dados.ordem,
  };

  const { data, error } = dados.id
    ? await supabase.from("obras").update(linha).eq("id", dados.id).select("id").single()
    : await supabase.from("obras").insert(linha).select("id").single();

  if (error) {
    // 23505 = violação de índice único. O único aqui é o endereço da página.
    if (error.code === "23505") {
      return {
        ok: false,
        erro: "Já existe uma obra com esse endereço de página. Mude o endereço.",
      };
    }
    return { ok: false, erro: error.message };
  }

  const obraId = data.id as string;

  // Fotos e pares são reescritos por completo: é mais simples e mais
  // seguro que tentar casar item a item, e o volume é pequeno.
  await supabase.from("obra_fotos").delete().eq("obra_id", obraId);
  if (dados.fotos.length > 0) {
    await supabase.from("obra_fotos").insert(
      dados.fotos.map((foto, ordem) => ({
        obra_id: obraId,
        url: foto.url,
        alt: foto.alt,
        ordem,
      })),
    );
  }

  await supabase.from("obra_antes_depois").delete().eq("obra_id", obraId);
  if (dados.antesDepois.length > 0) {
    await supabase.from("obra_antes_depois").insert(
      dados.antesDepois.map((par, ordem) => ({
        obra_id: obraId,
        antes_url: par.antesUrl,
        antes_alt: par.antesAlt,
        depois_url: par.depoisUrl,
        depois_alt: par.depoisAlt,
        legenda: par.legenda,
        prazo: par.prazo,
        ano: par.ano,
        ordem,
      })),
    );
  }

  recalcularSite([`/obras/${dados.slug}`]);
  return { ok: true };
}

export async function apagarObra(id: string, slug: string): Promise<Resposta> {
  const supabase = await exigirSessao();
  const { error } = await supabase.from("obras").delete().eq("id", id);
  if (error) return { ok: false, erro: error.message };

  recalcularSite([`/obras/${slug}`]);
  return { ok: true };
}

export async function reordenarObras(ordens: Array<{ id: string; ordem: number }>) {
  const supabase = await exigirSessao();

  await Promise.all(
    ordens.map(({ id, ordem }) =>
      supabase.from("obras").update({ ordem }).eq("id", id),
    ),
  );

  recalcularSite();
  return { ok: true };
}

// ---------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------

export async function marcarLeadAtendido(
  id: string,
  atendido: boolean,
  anotacoes?: string,
): Promise<Resposta> {
  const supabase = await exigirSessao();

  const { error } = await supabase
    .from("leads")
    .update({ atendido, ...(anotacoes !== undefined ? { anotacoes } : {}) })
    .eq("id", id);

  if (error) return { ok: false, erro: error.message };

  revalidatePath("/admin/leads");
  return { ok: true };
}

// ---------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------

async function salvarConfiguracao(chave: string, valor: unknown): Promise<Resposta> {
  const supabase = await exigirSessao();

  const { error } = await supabase
    .from("configuracoes")
    .upsert({ chave, valor, atualizado_em: new Date().toISOString() });

  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}

export async function salvarEstatisticas(valor: Estatistica[]): Promise<Resposta> {
  const resposta = await salvarConfiguracao("estatisticas", valor);
  recalcularSite();
  return resposta;
}

export async function salvarCidades(valor: string[]): Promise<Resposta> {
  const resposta = await salvarConfiguracao("cidades", valor);
  recalcularSite(["/contato", "/sobre"]);
  return resposta;
}

export async function salvarCoeficientes(valor: Coeficientes): Promise<Resposta> {
  const resposta = await salvarConfiguracao("orcamento", valor);
  recalcularSite(["/orcamento"]);
  return resposta;
}

// ---------------------------------------------------------------------
// Depoimentos
// ---------------------------------------------------------------------

export interface DadosDepoimento {
  id?: string;
  nome: string;
  cidade: string;
  bairro: string | null;
  texto: string;
  autorizado: boolean;
  publicado: boolean;
  ordem: number;
}

export async function salvarDepoimento(dados: DadosDepoimento): Promise<Resposta> {
  const supabase = await exigirSessao();

  const linha = {
    nome: dados.nome,
    cidade: dados.cidade,
    bairro: dados.bairro,
    texto: dados.texto,
    autorizado: dados.autorizado,
    // Trava de segurança: sem autorização do cliente não vai para o ar,
    // mesmo que alguém marque "publicado" por engano.
    publicado: dados.publicado && dados.autorizado,
    ordem: dados.ordem,
  };

  const { error } = dados.id
    ? await supabase.from("depoimentos").update(linha).eq("id", dados.id)
    : await supabase.from("depoimentos").insert(linha);

  if (error) return { ok: false, erro: error.message };

  recalcularSite();
  revalidatePath("/admin/depoimentos");
  return { ok: true };
}

export async function apagarDepoimento(id: string): Promise<Resposta> {
  const supabase = await exigirSessao();
  const { error } = await supabase.from("depoimentos").delete().eq("id", id);
  if (error) return { ok: false, erro: error.message };

  recalcularSite();
  revalidatePath("/admin/depoimentos");
  return { ok: true };
}
