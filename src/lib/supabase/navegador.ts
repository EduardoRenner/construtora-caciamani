import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente do navegador. Usado só no painel: login, logout e envio de
 * fotos direto para o Storage (que evita passar arquivo de 6 MB pelo
 * servidor da aplicação).
 */
export function clienteSupabaseNavegador() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !chave) {
    throw new Error(
      "Supabase não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.",
    );
  }

  return createBrowserClient(url, chave);
}
