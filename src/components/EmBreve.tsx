import { Pendente } from "@/components/Pendente";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeSeta } from "@/components/ui/Icones";
import { RotuloSecao, Secao, TituloSecao } from "@/components/ui/Secao";

/**
 * Marcador de página ainda não construída.
 *
 * Existe só para que os links do menu não caiam em 404 durante a
 * revisão. Cada uma destas páginas é substituída pela versão real na
 * fase indicada.
 */
export function EmBreve({
  titulo,
  fase,
  descricao,
}: {
  titulo: string;
  fase: string;
  descricao: string;
}) {
  return (
    <Secao cota={fase} espacamento="solto" className="min-h-[70svh] pt-20">
      <RotuloSecao>{fase}</RotuloSecao>
      <TituloSecao>{titulo}</TituloSecao>
      <p className="prosa mt-5 text-concreto">{descricao}</p>

      <div className="mt-8 max-w-lg">
        <Pendente bloco>página ainda não construída — entra na {fase}</Pendente>
      </div>

      <BotaoLink href="/" variante="contorno" className="mt-8">
        Voltar para a home
        <IconeSeta className="size-4" />
      </BotaoLink>
    </Secao>
  );
}
