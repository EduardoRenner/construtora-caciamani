import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renova a sessão do Supabase a cada navegação e barra o acesso ao
 * painel de quem não está autenticado.
 *
 * A verificação de verdade acontece no banco, via RLS — este middleware
 * é conveniência de navegação (mandar para o login em vez de mostrar uma
 * tela vazia), não a trava de segurança.
 */
export async function middleware(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem Supabase configurado o painel não tem como funcionar; a própria
  // página explica isso, então deixa passar.
  if (!url || !chave) return resposta;

  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (novos) => {
        novos.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        novos.forEach(({ name, value, options }) =>
          resposta.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ehPainel = request.nextUrl.pathname.startsWith("/admin");
  const ehLogin = request.nextUrl.pathname === "/admin/entrar";

  if (ehPainel && !ehLogin && !user) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin/entrar";
    destino.searchParams.set("de", request.nextUrl.pathname);
    return NextResponse.redirect(destino);
  }

  if (ehLogin && user) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return resposta;
}

export const config = {
  matcher: ["/admin/:path*"],
};
