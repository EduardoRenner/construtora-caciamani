import { BotaoLink } from "@/components/ui/Botao";
import { IconeSeta, IconeWhatsApp } from "@/components/ui/Icones";
import { RotuloSecao, Secao } from "@/components/ui/Secao";
import { linkWhatsApp, mensagemPadraoWhatsApp } from "@/lib/site";

/**
 * Conteúdo do 404, em componente próprio porque ele é usado por dois
 * arquivos: o `not-found` do grupo `(site)` (para `notFound()` chamado
 * dentro de uma página, como uma obra que não existe) e o da raiz do
 * `app/` (para endereços que não casam com rota nenhuma).
 */
export function PaginaNaoEncontrada() {
  return (
    <Secao cota="404" espacamento="solto" className="min-h-[70svh] pt-24">
      <RotuloSecao>Erro 404</RotuloSecao>
      <h1 className="titulo text-4xl md:text-6xl">Essa página não existe</h1>
      <p className="prosa mt-6 text-concreto md:text-lg">
        O endereço pode ter mudado, ou a obra que você procurava ainda não foi
        publicada. As obras entregues estão todas na página de obras.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <BotaoLink href="/obras" tamanho="lg">
          Ver as obras
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
