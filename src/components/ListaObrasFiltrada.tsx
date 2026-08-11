import Link from "next/link";
import { CardObra } from "@/components/CardObra";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsApp } from "@/components/ui/Icones";
import { Secao } from "@/components/ui/Secao";
import { rotulosTipoObra, type Obra, type TipoObra } from "@/content/tipos";
import { linkWhatsApp } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Listagem de obras, com os filtros como LINKS para páginas próprias.
 *
 * Cada recorte é uma rota estática (`/obras/tipo/germinada`), não uma
 * query string. Isso resolve três coisas de uma vez:
 *   - funciona sem JavaScript;
 *   - cada recorte é uma página indexável — "casas germinadas em
 *     Maravilha" vira uma página de verdade, o que é ouro para SEO local;
 *   - a página volta a ser estática, e a meta description vai no
 *     `<head>` desde o primeiro byte. Em rota dinâmica o Next emite os
 *     metadados depois do `<body>`, e a prévia do link no WhatsApp sai
 *     sem descrição.
 */
export function ListaObrasFiltrada({
  obras,
  tiposPresentes,
  tipoAtivo,
}: {
  obras: Obra[];
  tiposPresentes: TipoObra[];
  tipoAtivo: TipoObra | null;
}) {
  const listadas = tipoAtivo
    ? obras.filter((obra) => obra.tipo === tipoAtivo)
    : obras;

  return (
    <>
      <Secao espacamento="justo">
        <nav aria-label="Filtrar obras por tipo">
          <ul className="flex flex-wrap gap-2">
            <li>
              <FiltroLink href="/obras" ativo={tipoAtivo === null}>
                Todas
              </FiltroLink>
            </li>
            {tiposPresentes.map((tipo) => (
              <li key={tipo}>
                <FiltroLink href={`/obras/tipo/${tipo}`} ativo={tipoAtivo === tipo}>
                  {rotulosTipoObra[tipo]}
                </FiltroLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className="etiqueta mt-6 text-concreto">
          {listadas.length}{" "}
          {listadas.length === 1 ? "obra encontrada" : "obras encontradas"}
        </p>

        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {listadas.map((obra, indice) => (
            <CardObra
              key={obra.slug}
              obra={obra}
              prioridade={indice < 2}
              nivel={2}
            />
          ))}
        </div>
      </Secao>

      <Secao tom="noite" cota="orçamento" espacamento="solto">
        <div className="max-w-2xl">
          <h2 className="titulo text-3xl md:text-5xl">
            Quer algo parecido com alguma dessas?
          </h2>
          <p className="prosa mt-5 text-vidro/80">
            Manda o link da obra que te interessou. É mais rápido conversar
            olhando para uma referência concreta.
          </p>
          <BotaoLink
            href={linkWhatsApp(
              "Olá! Vi as obras no site da Construtora Caciamani e gostaria de conversar sobre uma parecida.",
            )}
            externo
            tamanho="lg"
            className="mt-8"
          >
            <IconeWhatsApp className="size-5" />
            Falar no WhatsApp
          </BotaoLink>
        </div>
      </Secao>
    </>
  );
}

function FiltroLink({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "true" : undefined}
      className={cn(
        "etiqueta inline-flex min-h-11 items-center border px-4 transition-colors",
        ativo
          ? "border-noite bg-contraste text-sobre-contraste"
          : "border-noite/20 text-concreto hover:border-noite hover:text-noite",
      )}
    >
      {children}
    </Link>
  );
}
