import Image from "next/image";
import Link from "next/link";
import { Pendente } from "@/components/Pendente";
import { IconeSeta } from "@/components/ui/Icones";
import { rotulosTipoObra, type Obra } from "@/content/tipos";
import { numeroBR } from "@/lib/utils";

/**
 * Card de obra. Cada um carrega um dado concreto — m², prazo ou tipo —
 * porque é o número que sustenta a foto, não o contrário.
 */
export function CardObra({
  obra,
  prioridade = false,
  nivel = 3,
}: {
  obra: Obra;
  prioridade?: boolean;
  /**
   * Nível do título do card. Na home os cards vêm depois de um h2 de
   * seção, então são h3. Na listagem `/obras` eles vêm direto sob o h1
   * da página — se ficassem h3, a hierarquia pularia um nível.
   */
  nivel?: 2 | 3;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";

  return (
    <article className="group">
      <Link href={`/obras/${obra.slug}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-vidro/50">
          {obra.capa.src ? (
            <Image
              src={obra.capa.src}
              alt={obra.capa.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={prioridade}
              className="object-cover transition-transform duration-500 ease-obra group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)]">
              <span className="sr-only">{obra.capa.alt}</span>
              <div className="absolute inset-x-3 bottom-3">
                <Pendente bloco>foto de capa — {obra.titulo.toLowerCase()}</Pendente>
              </div>
            </div>
          )}

          <span className="etiqueta absolute left-0 top-0 bg-contraste px-2.5 py-2 text-sobre-contraste">
            {rotulosTipoObra[obra.tipo]}
          </span>
        </div>

        <Titulo className="titulo mt-5 text-xl transition-colors group-hover:text-oxido md:text-2xl">
          {obra.titulo}
        </Titulo>
      </Link>

      {/* A linha de dados é a "cota" do card: sempre número real ou pendência. */}
      <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Cidade</dt>
          <dd className="tabular text-concreto">
            {obra.cidade}/{obra.uf}
          </dd>
        </div>

        <span aria-hidden="true" className="text-concreto-claro">
          ·
        </span>

        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Área construída</dt>
          <dd className="tabular text-concreto">
            {obra.areaM2 ? `${numeroBR(obra.areaM2)} m²` : <Pendente>m²</Pendente>}
          </dd>
        </div>

        <span aria-hidden="true" className="text-concreto-claro">
          ·
        </span>

        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Prazo de execução</dt>
          <dd className="tabular text-concreto">
            {obra.prazoMeses ? (
              `${obra.prazoMeses} meses`
            ) : (
              <Pendente>prazo</Pendente>
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-sm text-concreto">
        {obra.resumo ?? <Pendente>uma linha sobre esta obra</Pendente>}
      </p>

      <Link
        href={`/obras/${obra.slug}`}
        className="etiqueta mt-4 inline-flex items-center gap-2 py-1 text-noite"
        tabIndex={-1}
        aria-hidden="true"
      >
        Ver a obra
        <IconeSeta className="size-3.5 transition-transform duration-300 ease-obra group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
