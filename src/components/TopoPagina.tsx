import { RotuloSecao, Secao } from "@/components/ui/Secao";

/**
 * Abertura padrão das páginas internas. O header é fixo, então o topo
 * reserva o espaço dele — sem isso o título nasce debaixo da barra.
 */
export function TopoPagina({
  rotulo,
  titulo,
  descricao,
  cota,
  children,
}: {
  rotulo: string;
  titulo: string;
  descricao?: string;
  cota?: string;
  children?: React.ReactNode;
}) {
  return (
    <Secao cota={cota} className="pt-20 md:pt-24">
      <RotuloSecao>{rotulo}</RotuloSecao>
      <h1 className="titulo text-4xl md:text-6xl">{titulo}</h1>
      {descricao ? (
        <p className="prosa mt-6 text-base text-concreto md:text-lg">{descricao}</p>
      ) : null}
      {children}
    </Secao>
  );
}
