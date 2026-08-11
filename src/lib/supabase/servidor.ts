import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente com sessão, lendo e gravando os cookies do Next.
 * É o que o painel admin usa: as políticas de RLS para `authenticated`
 * só valem quando a sessão viaja junto do pedido.
 */
export async function clienteSupabaseServidor(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;

  const cookieStore = await cookies();

  return createServerClient(url, chave, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (novos) => {
        try {
          novos.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component não pode escrever cookie. Sem problema: o
          // middleware já renova a sessão em toda navegação.
        }
      },
    },
  });
}

/** Usuário autenticado do painel, ou `null`. */
export async function usuarioAtual() {
  const supabase = await clienteSupabaseServidor();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
