import { IconeWhatsApp } from "@/components/ui/Icones";
import { linkWhatsApp, mensagemPadraoWhatsApp } from "@/lib/site";

/**
 * Botão flutuante discreto. Fica no canto, respeita a safe area do iOS
 * e não cobre conteúdo: as páginas reservam espaço no fim com
 * `pb-24 md:pb-0`, e no mobile ele encolhe para só o ícone.
 */
export function BotaoWhatsAppFlutuante() {
  return (
    <a
      href={linkWhatsApp(mensagemPadraoWhatsApp)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 z-40 flex items-center gap-2.5 rounded-xs bg-contraste px-4 py-3 text-sobre-contraste shadow-lg shadow-noite/20 transition-colors duration-200 ease-obra hover:bg-contraste-2 md:right-8"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <IconeWhatsApp className="size-5 text-marca" />
      <span className="etiqueta hidden sm:inline">WhatsApp</span>
      <span className="sr-only sm:hidden">Falar no WhatsApp</span>
    </a>
  );
}
