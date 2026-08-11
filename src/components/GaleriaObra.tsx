import Image from "next/image";
import { Pendente } from "@/components/Pendente";
import type { ImagemObra } from "@/content/tipos";

/**
 * Galeria da página da obra.
 *
 * Grade simples, renderizada no servidor: sem lightbox e sem JavaScript.
 * A primeira foto ocupa duas colunas porque numa obra sempre existe uma
 * foto que vale mais que as outras — em geral a fachada pronta.
 */
export function GaleriaObra({
  fotos,
  titulo,
}: {
  fotos: ImagemObra[];
  titulo: string;
}) {
  if (fotos.length === 0) {
    return (
      <div className="max-w-xl">
        <Pendente bloco>
          fotos da obra “{titulo}” — fachada, ambientes internos e detalhes de
          acabamento, em alta resolução
        </Pendente>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {fotos.map((foto, indice) => (
        <li
          key={foto.src ?? indice}
          className={indice === 0 ? "col-span-2 row-span-2" : undefined}
        >
          <div className="relative aspect-4/3 w-full overflow-hidden bg-vidro/50">
            {foto.src ? (
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes={
                  indice === 0
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 50vw, 33vw"
                }
                priority={indice === 0}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_11px,rgba(90,96,103,0.13)_11px_12px)]">
                <span className="sr-only">{foto.alt}</span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
