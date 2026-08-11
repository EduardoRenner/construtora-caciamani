"use client";

import { useEffect } from "react";
import { Botao, BotaoLink } from "@/components/ui/Botao";
import { IconeSeta, IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao } from "@/components/ui/Secao";
import { linkWhatsApp, mensagemPadraoWhatsApp } from "@/lib/site";

/**
 * Erro dentro de uma página pública — o `<CromoSite>` do layout do grupo
 * `(site)` continua renderizando por cima (cabeçalho, rodapé, botão de
 * WhatsApp), só o conteúdo da página é trocado por isto.
 *
 * Sem este arquivo, qualquer exceção não tratada num Server Component
 * (ex.: uma consulta ao Supabase que falha de um jeito inesperado)
 * mostrava a tela genérica do Next — sem a cara do site, sem caminho de
 * volta.
 */
export default function ErroDoSite({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[erro-site]", error);
  }, [error]);

  return (
    <Secao cota="erro" espacamento="solto" className="min-h-[70svh] pt-24">
      <RotuloSecao>Algo deu errado</RotuloSecao>
      <h1 className="titulo text-4xl md:text-6xl">Essa página travou</h1>
      <p className="prosa mt-6 text-concreto md:text-lg">
        Não foi nada que você fez — é um erro do lado daqui. Tenta de novo, ou
        fala direto com a gente pelo WhatsApp.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Botao onClick={reset} tamanho="lg">
          Tentar de novo
        </Botao>
        <BotaoLink href="/" variante="contorno" tamanho="lg">
          Voltar para a home
          <IconeSeta className="size-4" />
        </BotaoLink>
        <BotaoLink
          href={linkWhatsApp(mensagemPadraoWhatsApp)}
          externo
          variante="contorno"
          tamanho="lg"
        >
          <IconeWhatsApp className="size-5" />
          Falar no WhatsApp
        </BotaoLink>
      </div>
    </Secao>
  );
}
