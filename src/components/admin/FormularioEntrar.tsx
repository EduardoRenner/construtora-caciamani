"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { clienteSupabaseNavegador } from "@/lib/supabase/navegador";

export function FormularioEntrar() {
  const router = useRouter();
  const parametros = useSearchParams();
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEntrando(true);
    setErro(null);

    const dados = new FormData(evento.currentTarget);

    const { error } = await clienteSupabaseNavegador().auth.signInWithPassword({
      email: String(dados.get("email")),
      password: String(dados.get("senha")),
    });

    if (error) {
      setEntrando(false);
      // Mensagem genérica de propósito: dizer "esse e-mail não existe"
      // entregaria a quem tenta adivinhar quais contas são válidas.
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.replace(parametros.get("de") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={aoEnviar} className="mt-8 flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="etiqueta block text-concreto">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2.5 block min-h-12 w-full border border-noite/20 bg-cal px-4 py-3 text-base text-noite focus:border-noite"
        />
      </div>

      <div>
        <label htmlFor="senha" className="etiqueta block text-concreto">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2.5 block min-h-12 w-full border border-noite/20 bg-cal px-4 py-3 text-base text-noite focus:border-noite"
        />
      </div>

      {erro ? (
        <p role="alert" className="border border-oxido/50 px-4 py-3 text-sm text-oxido">
          {erro}
        </p>
      ) : null}

      <Botao type="submit" tamanho="lg" disabled={entrando}>
        {entrando ? "Entrando…" : "Entrar"}
      </Botao>
    </form>
  );
}
