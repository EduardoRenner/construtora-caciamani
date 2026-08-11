import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente sem sessão, para leitura pública e para gravar leads.
 *
 * Usa a chave ANÔNIMA de propósito: a gravação de lead é protegida por
 * Row Level Security (INSERT liberado, SELECT bloqueado). A chave de
 * serviço ignora RLS por completo e não entra em rota pública.
 *
 * Devolve `null` quando o ambiente não está configurado, para o site
 * continuar funcionando sem Supabase — caindo no conteúdo dos arquivos
 * em `src/content/`.
 */
export function clienteSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chaveAnonima = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !chaveAnonima) return null;

  return createClient(url, chaveAnonima, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
