"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pendente } from "@/components/Pendente";
import type { ImagemObra, ParAntesDepois } from "@/content/tipos";
import { animarQuadros, prefereMenosMovimento } from "@/lib/animacao";
import { cn } from "@/lib/utils";

const PASSO_TECLADO = 5;
const POSICAO_INICIAL = 55;
/** Distância da borda em que o rótulo some, para não brigar com a alça. */
const MARGEM_ROTULO = 12;

/**
 * Comparador antes/depois.
 *
 * A posição é a fração da largura ocupada pelo "antes", contada da
 * esquerda. Alça toda à esquerda (0%) = 100% do DEPOIS; toda à direita
 * (100%) = 100% do ANTES.
 *
 * Sem biblioteca externa: o recorte é `clip-path: inset()` e os eventos
 * de ponteiro são coalescidos em um update por quadro via
 * requestAnimationFrame.
 *
 * Toque: o arrasto só assume o gesto depois de decidir que ele é
 * horizontal (|dx| > |dy|). Enquanto não decidir, o dedo continua
 * rolando a página normalmente — é o que impede o componente de
 * sequestrar o scroll vertical no celular.
 */
export function AntesDepois({
  par,
  prioridade = false,
  className,
}: {
  par: ParAntesDepois;
  /** `true` na primeira dobra: carrega a foto "depois" com prioridade. */
  prioridade?: boolean;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const quadro = useRef<number | null>(null);
  const arrastando = useRef(false);
  const inicioToque = useRef<{ x: number; y: number } | null>(null);
  const jaEnsinou = useRef(false);
  const cancelarEnsino = useRef<(() => void) | null>(null);

  const [posicao, setPosicao] = useState(POSICAO_INICIAL);

  const aplicar = useCallback((clientX: number) => {
    // Um update por quadro, mesmo que o navegador dispare vários
    // pointermove no intervalo.
    if (quadro.current !== null) return;

    quadro.current = requestAnimationFrame(() => {
      quadro.current = null;
      const caixa = container.current?.getBoundingClientRect();
      if (!caixa || caixa.width === 0) return;

      const bruto = ((clientX - caixa.left) / caixa.width) * 100;
      setPosicao(Math.min(100, Math.max(0, bruto)));
    });
  }, []);

  /** Qualquer interação do usuário interrompe o micro-movimento de ensino. */
  const interromperEnsino = useCallback(() => {
    cancelarEnsino.current?.();
    cancelarEnsino.current = null;
    jaEnsinou.current = true;
  }, []);

  // Micro-movimento na primeira vez que entra na viewport: ensina que a
  // alça é arrastável sem precisar de texto "arraste aqui".
  useEffect(() => {
    const alvo = container.current;
    if (!alvo || jaEnsinou.current || prefereMenosMovimento()) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas[0]?.isIntersecting;
        if (!visivel || jaEnsinou.current) return;

        jaEnsinou.current = true;
        observador.disconnect();
        cancelarEnsino.current = animarQuadros({
          quadros: [POSICAO_INICIAL, 42, 66, POSICAO_INICIAL],
          duracao: 1700,
          aoAtualizar: setPosicao,
        });
      },
      { threshold: 0.55 },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (quadro.current !== null) cancelAnimationFrame(quadro.current);
      cancelarEnsino.current?.();
    };
  }, []);

  const aoPressionar = (evento: React.PointerEvent<HTMLDivElement>) => {
    interromperEnsino();

    if (evento.pointerType === "touch") {
      // Ainda não sabemos se o gesto é arrasto ou rolagem — espera o move.
      inicioToque.current = { x: evento.clientX, y: evento.clientY };
      return;
    }

    arrastando.current = true;
    container.current?.setPointerCapture(evento.pointerId);
    aplicar(evento.clientX);
  };

  const aoMover = (evento: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastando.current) {
      const inicio = inicioToque.current;
      if (!inicio) return;

      const dx = Math.abs(evento.clientX - inicio.x);
      const dy = Math.abs(evento.clientY - inicio.y);

      // Gesto vertical: é rolagem da página. Sai da frente.
      if (dy > dx) {
        inicioToque.current = null;
        return;
      }
      // Ainda indefinido.
      if (dx < 8) return;

      arrastando.current = true;
      container.current?.setPointerCapture(evento.pointerId);
    }

    aplicar(evento.clientX);
  };

  const aoSoltar = (evento: React.PointerEvent<HTMLDivElement>) => {
    arrastando.current = false;
    inicioToque.current = null;
    if (container.current?.hasPointerCapture(evento.pointerId)) {
      container.current.releasePointerCapture(evento.pointerId);
    }
  };

  const aoTeclar = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    let destino: number | null = null;

    if (evento.key === "ArrowLeft") destino = posicao - PASSO_TECLADO;
    if (evento.key === "ArrowRight") destino = posicao + PASSO_TECLADO;
    if (evento.key === "Home") destino = 0;
    if (evento.key === "End") destino = 100;
    if (destino === null) return;

    evento.preventDefault();
    interromperEnsino();
    setPosicao(Math.min(100, Math.max(0, destino)));
  };

  const arredondada = Math.round(posicao);

  return (
    <figure className={cn("m-0", className)}>
      <div
        ref={container}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        className="relative w-full touch-pan-y overflow-hidden bg-contraste select-none"
        style={{ aspectRatio: "4 / 3" }}
      >
        {/* DEPOIS — camada de baixo, ocupa tudo. Prioridade de carga. */}
        <Camada imagem={par.depois} variante="depois" prioridade={prioridade} />

        {/* ANTES — recortado da esquerda até a alça. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - posicao}% 0 0)` }}
        >
          <Camada imagem={par.antes} variante="antes" prioridade={false} />
        </div>

        {/* Rótulos: somem quando a alça chega perto deles. */}
        <span
          aria-hidden="true"
          className="etiqueta absolute left-3 top-3 bg-contraste/75 px-2 py-1.5 text-sobre-contraste transition-opacity duration-200"
          style={{ opacity: posicao < MARGEM_ROTULO ? 0 : 1 }}
        >
          Antes
        </span>
        <span
          aria-hidden="true"
          className="etiqueta absolute right-3 top-3 bg-contraste/75 px-2 py-1.5 text-sobre-contraste transition-opacity duration-200"
          style={{ opacity: posicao > 100 - MARGEM_ROTULO ? 0 : 1 }}
        >
          Depois
        </span>

        {/* Alça */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparar antes e depois da obra"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={arredondada}
          aria-valuetext={`${arredondada}% do antes visível`}
          aria-orientation="horizontal"
          onKeyDown={aoTeclar}
          className="absolute inset-y-0 z-10 w-11 -translate-x-1/2 cursor-ew-resize touch-none"
          style={{ left: `${posicao}%` }}
        >
          {/* A alça fica SOBRE a foto, então usa os tokens de contraste,
              que são claros nos dois temas. Com `bg-cal` ela sumiria no
              tema escuro, virando marinho sobre a imagem. */}
          <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-sobre-contraste" />
          <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sobre-contraste shadow-lg shadow-black/30">
            <SetasAlca />
          </span>
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-concreto">
        {par.legenda ? (
          <span>{par.legenda}</span>
        ) : (
          <Pendente>o que foi feito nesta obra</Pendente>
        )}
        {par.prazo ? <span className="tabular">{par.prazo}</span> : null}
        {par.ano ? <span className="tabular">{par.ano}</span> : null}
        <span className="etiqueta ml-auto hidden text-concreto sm:block">
          arraste ou use ← →
        </span>
      </figcaption>
    </figure>
  );
}

function Camada({
  imagem,
  variante,
  prioridade,
}: {
  imagem: ImagemObra;
  variante: "antes" | "depois";
  prioridade: boolean;
}) {
  if (imagem.src) {
    return (
      <Image
        src={imagem.src}
        alt={imagem.alt}
        fill
        // Ocupa a coluna de conteúdo: quase tela cheia no mobile,
        // metade da largura em telas grandes.
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
        priority={prioridade}
        loading={prioridade ? undefined : "lazy"}
        className="object-cover"
        draggable={false}
      />
    );
  }

  // Sem foto ainda. As duas camadas são deliberadamente diferentes para
  // que o arrasto seja avaliável mesmo sem imagem.
  //
  // Os tons vêm de `contraste`, não de `cal`/`vidro`: este bloco ocupa o
  // lugar de uma FOTO, e foto não muda com o tema. Com os tons da
  // superfície, o "antes" virava cinza-claro com texto claro por cima no
  // tema escuro — 1.53:1, ilegível.
  const primeira = variante === "antes";

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        primeira
          ? "bg-contraste bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgba(255,255,255,0.07)_14px_15px)]"
          : "bg-contraste-2 bg-[repeating-linear-gradient(45deg,transparent_0_14px,rgba(255,255,255,0.11)_14px_15px)]",
      )}
    >
      <span
        className={cn(
          "titulo text-4xl md:text-6xl",
          primeira ? "text-sobre-contraste/60" : "text-sobre-contraste/85",
        )}
      >
        {variante}
      </span>
      <span className="sr-only">{imagem.alt}</span>
    </div>
  );
}

function SetasAlca() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
      // Vai dentro da alça clara, então acompanha o contraste, não a tinta.
      className="size-5 text-contraste"
    >
      <path d="M10 8l-4 4 4 4M14 8l4 4-4 4" />
    </svg>
  );
}
