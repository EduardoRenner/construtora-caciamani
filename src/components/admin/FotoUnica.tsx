"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { nomeUnico, prepararFoto, proporcao } from "@/lib/imagem";
import { clienteSupabaseNavegador } from "@/lib/supabase/navegador";

export interface FotoComProporcao {
  url: string;
  alt: string;
  /** Guardada para comparar enquadramento entre o antes e o depois. */
  proporcao: number | null;
}

export const fotoVazia: FotoComProporcao = { url: "", alt: "", proporcao: null };

export function FotoUnica({
  rotulo,
  foto,
  aoMudar,
}: {
  rotulo: string;
  foto: FotoComProporcao;
  aoMudar: (nova: FotoComProporcao) => void;
}) {
  const id = useId();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoSelecionar(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    setEnviando(true);
    setErro(null);

    try {
      const { grande } = await prepararFoto(arquivo);
      const caminho = nomeUnico(arquivo.name, "g");
      const supabase = clienteSupabaseNavegador();

      const { error } = await supabase.storage
        .from("obras")
        .upload(caminho, grande.arquivo, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from("obras").getPublicUrl(caminho);
      aoMudar({ ...foto, url: data.publicUrl, proporcao: proporcao(grande) });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Falha ao enviar a foto.");
    } finally {
      setEnviando(false);
      evento.target.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="etiqueta block text-concreto">
        {rotulo}
      </label>

      {foto.url ? (
        <div className="mt-2 flex gap-3">
          <div className="relative size-24 shrink-0 overflow-hidden bg-vidro/40">
            <Image src={foto.url} alt="" fill sizes="96px" className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => aoMudar(fotoVazia)}
            className="etiqueta h-fit border border-oxido/40 px-3 py-2 text-oxido"
          >
            Trocar
          </button>
        </div>
      ) : (
        <input
          id={id}
          type="file"
          accept="image/*"
          disabled={enviando}
          onChange={aoSelecionar}
          className="mt-2 block w-full border border-dashed border-noite/30 bg-cal p-3 text-sm file:mr-3 file:border-0 file:bg-contraste file:px-3 file:py-2 file:text-sobre-contraste"
        />
      )}

      {enviando ? (
        <p role="status" className="mt-2 text-sm text-concreto">
          Enviando…
        </p>
      ) : null}

      {foto.url ? (
        <input
          type="text"
          value={foto.alt}
          placeholder="O que aparece na foto?"
          onChange={(e) => aoMudar({ ...foto, alt: e.target.value })}
          aria-label={`Descrição da foto: ${rotulo}`}
          className="mt-2 block min-h-11 w-full border border-noite/20 bg-cal px-3 py-2 text-sm text-noite focus:border-noite"
        />
      ) : null}

      {erro ? (
        <p role="alert" className="mt-2 text-sm text-oxido">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
