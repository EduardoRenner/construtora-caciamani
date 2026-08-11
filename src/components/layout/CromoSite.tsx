import { BotaoWhatsAppFlutuante } from "@/components/layout/BotaoWhatsAppFlutuante";
import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";

/**
 * Moldura do site público: link de pular, cabeçalho, rodapé e botão
 * flutuante.
 *
 * Existe como componente, e não só como layout do grupo `(site)`, porque
 * a página de 404 precisa morar na raiz do `app/` para pegar endereços
 * que não casam com nenhuma rota — e mesmo assim tem que aparecer com a
 * mesma moldura.
 */
export function CromoSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-contraste focus:px-4 focus:py-3 focus:text-sobre-contraste"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Rodape />
      <BotaoWhatsAppFlutuante />
    </>
  );
}
