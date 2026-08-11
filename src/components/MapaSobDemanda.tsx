"use client";

import { useState } from "react";
import { Botao } from "@/components/ui/Botao";

/**
 * Mapa que só carrega quando o usuário pede.
 *
 * Um iframe do Google Maps traz centenas de kB e várias requisições de
 * terceiros. Carregar isso no load derrubaria o LCP da página de contato
 * por causa de um elemento que a maioria das visitas nem usa — no
 * celular, quase todo mundo quer o botão do WhatsApp, não o mapa.
 */
export function MapaSobDemanda({ consulta }: { consulta: string }) {
  const [carregar, setCarregar] = useState(false);

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden bg-vidro/40 sm:aspect-video">
      {carregar ? (
        <iframe
          title={`Mapa da localização: ${consulta}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)] p-6 text-center"
        >
          <p className="prosa text-sm text-concreto">
            O mapa é carregado do Google e pesa. Ele só entra se você pedir.
          </p>
          <Botao variante="contorno" onClick={() => setCarregar(true)}>
            Carregar o mapa
          </Botao>
        </div>
      )}
    </div>
  );
}
