import Image from "next/image";
import Link from "next/link";
import { BotaoLink } from "@/components/ui/Botao";
import { rotulosTipoObra, type TipoObra } from "@/content/tipos";
import { listarObrasAdmin } from "@/lib/dadosAdmin";

export default async function ObrasAdmin() {
  const obras = await listarObrasAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="titulo text-3xl md:text-4xl">Obras</h1>
        <BotaoLink href="/admin/obras/nova">Cadastrar obra</BotaoLink>
      </div>

      {obras.length === 0 ? (
        <p className="mt-10 border border-dashed border-noite/25 bg-cal p-8 text-center text-concreto">
          Nenhuma obra cadastrada ainda. Comece pela que tem as melhores fotos.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {obras.map((obra) => (
            <li key={obra.id}>
              <Link
                href={`/admin/obras/${obra.id}`}
                className="flex items-center gap-4 border border-noite/15 bg-cal p-3 transition-colors hover:border-noite"
              >
                <div className="relative size-16 shrink-0 overflow-hidden bg-vidro/40">
                  {obra.capa_url ? (
                    <Image
                      src={obra.capa_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="titulo text-lg">{obra.titulo}</p>
                  <p className="etiqueta mt-1.5 text-concreto">
                    {rotulosTipoObra[obra.tipo as TipoObra] ?? obra.tipo} ·{" "}
                    {obra.cidade}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`etiqueta px-2 py-1 ${
                      obra.publicada
                        ? "bg-contraste text-sobre-contraste"
                        : "border border-oxido/40 text-oxido"
                    }`}
                  >
                    {obra.publicada ? "No site" : "Rascunho"}
                  </span>
                  {obra.destaque ? (
                    <span className="etiqueta text-marca-escura">Destaque</span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
