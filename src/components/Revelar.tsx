"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela o conteúdo quando ele entra na viewport: sobe 14px e aparece,
 * uma vez só.
 *
 * Justificativa: a home é longa e quase toda em blocos de texto e dados.
 * A revelação escalonada dá ordem de leitura sem precisar de seta, linha
 * ou "role para baixo". É o único movimento que se repete no site.
 *
 * O estado escondido mora no CSS, atrás de `html.js` — se o script não
 * rodar, nada fica invisível. Ver `globals.css`.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
  como: Como = "div",
}: {
  children: React.ReactNode;
  /** Atraso em ms, para escalonar irmãos. */
  atraso?: number;
  className?: string;
  como?: "div" | "li" | "section" | "article";
}) {
  const referencia = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = referencia.current;
    if (!alvo) return;

    // Se já está na tela no primeiro quadro (acima da dobra), revela sem
    // esperar rolagem nenhuma.
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        setVisivel(true);
        observador.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <Como
      ref={referencia as React.Ref<never>}
      className={cn("revelar", className)}
      data-visivel={visivel ? "sim" : undefined}
      style={atraso ? ({ "--atraso": `${atraso}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Como>
  );
}

