"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { clienteSupabaseNavegador } from "@/lib/supabase/navegador";
import { nomeUnico, prepararFoto } from "@/lib/imagem";
import { cn } from "@/lib/utils";

export interface FotoEnviada {
  url: string;
  alt: string;
}

/**
 * Envio e ordenação das fotos de uma obra.
 *
 * As fotos são reduzidas e convertidas para WebP no navegador antes de
 * subir (ver `lib/imagem.ts`) e vão direto do celular para o Storage,
 * sem passar pelo servidor da aplicação.
 *
 * A ordenação tem arrastar-e-soltar E botões de subir/descer. Os botões
 * não são redundância: arrastar não funciona por teclado, e a ordem das
 * fotos é informação — a primeira é a que aparece maior no site.
 */
export function EnvioDeFotos({
  fotos,
  aoMudar,
  rotulo = "Fotos da obra",
}: {
  fotos: FotoEnviada[];
  aoMudar: (novas: FotoEnviada[]) => void;
  rotulo?: string;
}) {
  const idCampo = useId();
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const arrastado = useRef<number | null>(null);

  async function aoSelecionar(evento: React.ChangeEvent<HTMLInputElement>) {
    const selecionados = Array.from(evento.target.files ?? []);
    if (selecionados.length === 0) return;

    setEnviando(true);
    setErro(null);

    const supabase = clienteSupabaseNavegador();
    const novas: FotoEnviada[] = [];

    for (const [indice, arquivo] of selecionados.entries()) {
      setProgresso(`Preparando foto ${indice + 1} de ${selecionados.length}…`);

      try {
        const { grande } = await prepararFoto(arquivo);
        const caminho = nomeUnico(arquivo.name, "g");

        const { error } = await supabase.storage
          .from("obras")
          .upload(caminho, grande.arquivo, {
            contentType: "image/webp",
            cacheControl: "31536000",
          });

        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from("obras").getPublicUrl(caminho);
        novas.push({ url: data.publicUrl, alt: "" });
      } catch (falha) {
        setErro(
          `Não deu para enviar "${arquivo.name}": ${
            falha instanceof Error ? falha.message : "erro desconhecido"
          }`,
        );
      }
    }

    aoMudar([...fotos, ...novas]);
    setEnviando(false);
    setProgresso(null);
    evento.target.value = "";
  }

  function mover(de: number, para: number) {
    if (para < 0 || para >= fotos.length) return;
    const copia = [...fotos];
    const [item] = copia.splice(de, 1);
    copia.splice(para, 0, item);
    aoMudar(copia);
  }

  const semDescricao = fotos.filter((foto) => !foto.alt.trim()).length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <label htmlFor={idCampo} className="etiqueta text-concreto">
          {rotulo}
        </label>
        <p className="text-xs text-concreto">
          As fotos são reduzidas automaticamente. Pode mandar direto do celular.
        </p>
      </div>

      <input
        id={idCampo}
        type="file"
        accept="image/*"
        multiple
        disabled={enviando}
        onChange={aoSelecionar}
        className="mt-2.5 block w-full border border-dashed border-noite/30 bg-cal p-4 text-sm file:mr-4 file:border-0 file:bg-contraste file:px-4 file:py-2.5 file:text-sobre-contraste"
      />

      {progresso ? (
        <p role="status" className="mt-3 text-sm text-concreto">
          {progresso}
        </p>
      ) : null}

      {erro ? (
        <p role="alert" className="mt-3 border border-oxido/50 px-4 py-3 text-sm text-oxido">
          {erro}
        </p>
      ) : null}

      {semDescricao > 0 ? (
        <p className="mt-3 border border-oxido/40 bg-oxido/6 px-4 py-3 text-sm text-oxido">
          {semDescricao === 1
            ? "1 foto está sem descrição."
            : `${semDescricao} fotos estão sem descrição.`}{" "}
          A descrição é lida em voz alta para quem não enxerga, e aparece se a
          foto não carregar.
        </p>
      ) : null}

      {fotos.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-3">
          {fotos.map((foto, indice) => (
            <li
              key={foto.url}
              draggable
              onDragStart={() => (arrastado.current = indice)}
              onDragOver={(evento) => evento.preventDefault()}
              onDrop={() => {
                if (arrastado.current !== null) mover(arrastado.current, indice);
                arrastado.current = null;
              }}
              className={cn(
                "flex items-start gap-4 border border-noite/15 bg-cal p-3",
                indice === 0 && "border-marca-escura",
              )}
            >
              <div className="relative size-20 shrink-0 overflow-hidden bg-vidro/40">
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0 flex-1">
                {indice === 0 ? (
                  <p className="etiqueta mb-2 text-noite">Foto principal</p>
                ) : null}
                <label className="sr-only" htmlFor={`${idCampo}-alt-${indice}`}>
                  Descrição da foto {indice + 1}
                </label>
                <input
                  id={`${idCampo}-alt-${indice}`}
                  type="text"
                  value={foto.alt}
                  placeholder="O que aparece na foto?"
                  onChange={(evento) => {
                    const copia = [...fotos];
                    copia[indice] = { ...foto, alt: evento.target.value };
                    aoMudar(copia);
                  }}
                  className="block min-h-11 w-full border border-noite/20 bg-cal-2 px-3 py-2 text-sm text-noite focus:border-noite"
                />
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => mover(indice, indice - 1)}
                  disabled={indice === 0}
                  className="min-h-9 border border-noite/20 px-2.5 text-sm disabled:opacity-30"
                >
                  <span aria-hidden="true">↑</span>
                  <span className="sr-only">Mover a foto {indice + 1} para cima</span>
                </button>
                <button
                  type="button"
                  onClick={() => mover(indice, indice + 1)}
                  disabled={indice === fotos.length - 1}
                  className="min-h-9 border border-noite/20 px-2.5 text-sm disabled:opacity-30"
                >
                  <span aria-hidden="true">↓</span>
                  <span className="sr-only">Mover a foto {indice + 1} para baixo</span>
                </button>
                <button
                  type="button"
                  onClick={() => aoMudar(fotos.filter((_, i) => i !== indice))}
                  className="min-h-9 border border-oxido/40 px-2.5 text-sm text-oxido"
                >
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Remover a foto {indice + 1}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
