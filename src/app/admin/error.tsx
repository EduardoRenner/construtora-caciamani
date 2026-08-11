"use client";

import { useEffect } from "react";
import { Botao, BotaoLink } from "@/components/ui/Botao";

/**
 * Erro dentro do painel. Sem molde do site público — o painel não usa
 * `CromoSite` — então esta tela precisa se sustentar sozinha, com a
 * mesma superfície das telas de login/"não configurado" do admin.
 */
export default function ErroDoPainel({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[erro-admin]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cal-2 px-4 py-16">
      <div className="w-full max-w-md">
        <h1 className="titulo text-3xl">Essa tela travou</h1>
        <p className="prosa mt-4 text-concreto">
          Aconteceu um erro inesperado aqui no painel. Não deveria ter
          perdido nada do que você já salvou antes disso.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Botao onClick={reset}>Tentar de novo</Botao>
          <BotaoLink href="/admin" variante="contorno">
            Voltar ao início do painel
          </BotaoLink>
        </div>
      </div>
    </div>
  );
}
