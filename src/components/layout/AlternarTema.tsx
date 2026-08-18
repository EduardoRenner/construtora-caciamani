"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Tema = "escuro" | "claro";

/** Roda antes da primeira pintura, no `<head>`. Ver `layout.tsx`. */
export const scriptDoTema = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('tema');if(t==='claro'||t==='escuro'){d.dataset.tema=t;}}catch(e){}})();`;

/**
 * Alterna entre o tema escuro (padrão) e o claro.
 *
 * O escuro é o padrão porque é ele que carrega as cores da logo:
 * marinho, o ciano do desenho dos prédios e o âmbar do logotipo.
 *
 * O estado de verdade é o atributo `data-tema` no `<html>`, escrito pelo
 * script inline antes da primeira pintura. Este componente só lê o que
 * já está lá e troca — por isso não há piscada nem divergência de
 * hidratação: o servidor sempre manda "escuro", e a correção para quem
 * escolheu "claro" acontece antes de qualquer pixel aparecer.
 */
export function AlternarTema({
  className,
  claro = false,
}: {
  className?: string;
  /**
   * `true` quando o botão está sobre a foto escura do hero. A tinta do
   * tema não serve ali: no tema claro `noite` sobre a foto dá 2,77:1.
   * As classes são TROCADAS, não somadas — `cn` é um join simples, e
   * duas utilitárias de cor no mesmo elemento deixam a ordem do CSS
   * decidir o vencedor, não a ordem no atributo.
   */
  claro?: boolean;
}) {
  const [tema, setTema] = useState<Tema>("escuro");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    const atual = document.documentElement.dataset.tema;
    setTema(atual === "claro" ? "claro" : "escuro");
    setMontado(true);
  }, []);

  function trocar() {
    const novo: Tema = tema === "escuro" ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    setTema(novo);
    try {
      localStorage.setItem("tema", novo);
    } catch {
      // Navegação privada pode bloquear o storage. A troca vale para
      // esta visita; não recusar por causa disso.
    }
  }

  const vaiPara = tema === "escuro" ? "claro" : "escuro";

  return (
    <button
      type="button"
      onClick={trocar}
      // Antes de montar não sabemos o tema real, e anunciar o errado é
      // pior que não anunciar. O botão só entra na ordem de foco depois.
      aria-label={montado ? `Mudar para o tema ${vaiPara}` : "Mudar o tema"}
      title={montado ? `Mudar para o tema ${vaiPara}` : undefined}
      className={cn(
        "relative grid size-11 shrink-0 place-items-center border transition-colors duration-300",
        claro
          ? "border-sobre-contraste/30 text-sobre-contraste hover:border-sobre-contraste"
          : "border-noite/20 text-noite hover:border-noite",
        className,
      )}
    >
      <IconeSol ativo={montado && tema === "claro"} />
      <IconeLua ativo={!montado || tema === "escuro"} />
    </button>
  );
}

/**
 * Os dois ícones ficam sobrepostos e trocam por escala e rotação — sem
 * remontar nada. É a mesma curva `expo` do resto do site.
 */
function IconeSol({ ativo }: { ativo: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className={cn(
        "absolute size-[1.15rem] transition-all duration-500 ease-expo",
        ativo ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
      )}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
    </svg>
  );
}

function IconeLua({ ativo }: { ativo: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "absolute size-[1.15rem] transition-all duration-500 ease-expo",
        ativo ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
      )}
    >
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
    </svg>
  );
}
