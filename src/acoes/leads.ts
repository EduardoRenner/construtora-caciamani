"use server";

import { headers } from "next/headers";
import { calcularOrcamento } from "@/config/orcamento";
import { dentroDoLimite } from "@/lib/limitePorIp";
import { avisarLeadNovo } from "@/lib/aviso";
import { obterCoeficientes } from "@/lib/conteudo";
import { clienteSupabase, supabaseConfigurado } from "@/lib/supabase/publico";
import { schemaContato, schemaOrcamento } from "@/lib/validacao";

export interface ResultadoEnvio {
  ok: boolean;
  /** `false` quando o Supabase ainda não está configurado no ambiente. */
  gravado: boolean;
  erro?: string;
}

async function ipDoPedido(): Promise<string> {
  const cabecalhos = await headers();
  const encaminhado = cabecalhos.get("x-forwarded-for");
  return encaminhado?.split(",")[0]?.trim() || cabecalhos.get("x-real-ip") || "desconhecido";
}

/**
 * Grava o lead do simulador ANTES de o usuário ir para o WhatsApp.
 *
 * Essa ordem é o ponto todo: se a pessoa desistir na tela do WhatsApp,
 * ou o app não abrir no celular dela, o contato já está salvo. Perder
 * lead qualificado por causa de um redirecionamento é caro.
 *
 * Falha de gravação NÃO bloqueia o usuário — ele segue para o WhatsApp
 * de qualquer forma, porque o pior resultado possível é a pessoa não
 * conseguir falar com a construtora.
 */
export async function registrarLeadOrcamento(
  entrada: unknown,
): Promise<ResultadoEnvio> {
  const analise = schemaOrcamento.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, gravado: false, erro: "Dados inválidos." };
  }

  const dados = analise.data;

  // Armadilha preenchida: robô. Responde como se tivesse dado certo,
  // para não ensinar o robô a contornar, mas não grava nada.
  if (dados.site) return { ok: true, gravado: false };

  if (!dentroDoLimite(await ipDoPedido())) {
    return {
      ok: false,
      gravado: false,
      erro: "Muitos envios seguidos. Tente de novo em alguns minutos.",
    };
  }

  if (!supabaseConfigurado()) {
    console.warn(
      "[leads] Supabase não configurado — lead do orçamento NÃO foi gravado.",
    );
    return { ok: true, gravado: false };
  }

  // Guarda a estimativa que o cliente viu, com os coeficientes vigentes
  // no momento — se o Carlinhos recalibrar depois, o histórico continua
  // dizendo o que foi mostrado na época.
  const estimativa = calcularOrcamento(
    {
      tipo: dados.tipo as never,
      areaM2: dados.areaM2,
      padrao: dados.padrao as never,
    },
    await obterCoeficientes(),
  );

  const supabase = clienteSupabase();
  const { error } = await supabase!.from("leads").insert({
    origem: "orcamento",
    nome: dados.nome,
    telefone: dados.telefone,
    email: dados.email || null,
    cidade: dados.cidade,
    tipo_construcao: dados.tipo,
    area_m2: dados.areaM2,
    padrao_acabamento: dados.padrao,
    situacao_terreno: dados.terreno,
    prazo_inicio: dados.prazoInicio,
    estimativa_minima: estimativa.calculavel ? estimativa.minimo : null,
    estimativa_maxima: estimativa.calculavel ? estimativa.maximo : null,
  });

  if (error) {
    console.error("[leads] Falha ao gravar lead do orçamento:", error.message);
    // Segue em frente: o WhatsApp é mais importante que o registro.
    return { ok: true, gravado: false };
  }

  await avisarLeadNovo({
    origem: "Simulador de orçamento",
    nome: dados.nome,
    telefone: dados.telefone,
    cidade: dados.cidade,
    detalhe: `Obra: ${dados.tipo}, ${dados.areaM2} m², padrão ${dados.padrao}.`,
  });

  return { ok: true, gravado: true };
}

export async function registrarLeadContato(
  entrada: unknown,
): Promise<ResultadoEnvio> {
  const analise = schemaContato.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, gravado: false, erro: "Dados inválidos." };
  }

  const dados = analise.data;
  if (dados.site) return { ok: true, gravado: false };

  if (!dentroDoLimite(await ipDoPedido())) {
    return {
      ok: false,
      gravado: false,
      erro: "Muitos envios seguidos. Tente de novo em alguns minutos.",
    };
  }

  if (!supabaseConfigurado()) {
    console.warn("[leads] Supabase não configurado — lead de contato NÃO foi gravado.");
    return { ok: true, gravado: false };
  }

  const supabase = clienteSupabase();
  const { error } = await supabase!.from("leads").insert({
    origem: dados.obraSlug ? "obra" : "contato",
    nome: dados.nome,
    telefone: dados.telefone,
    email: dados.email || null,
    cidade: dados.cidade || null,
    mensagem: dados.mensagem,
    obra_slug: dados.obraSlug || null,
  });

  if (error) {
    console.error("[leads] Falha ao gravar lead de contato:", error.message);
    return { ok: true, gravado: false };
  }

  await avisarLeadNovo({
    origem: dados.obraSlug ? `Página da obra (${dados.obraSlug})` : "Formulário de contato",
    nome: dados.nome,
    telefone: dados.telefone,
    cidade: dados.cidade,
    detalhe: dados.mensagem,
  });

  return { ok: true, gravado: true };
}
