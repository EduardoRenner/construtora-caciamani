import { Revelar } from "@/components/Revelar";
import { cn } from "@/lib/utils";

export type Tom = "cal" | "claro" | "noite";

/**
 * Cada tom traz o pacote completo de cores da superfície, para que o
 * fio da cota, o texto secundário e o anel de foco continuem legíveis
 * quando a seção inverte.
 */
const tons: Record<Tom, { secao: string; fio: string; texto: string }> = {
  cal: { secao: "bg-cal text-noite", fio: "bg-noite/15", texto: "text-concreto" },
  claro: { secao: "bg-cal-2 text-noite", fio: "bg-noite/15", texto: "text-concreto" },
  noite: {
    secao: "superficie-escura bg-contraste text-sobre-contraste",
    fio: "bg-sobre-contraste/20",
    texto: "text-vidro/75",
  },
};

/**
 * A COTA — elemento assinatura do site.
 *
 * É a linha de dimensão de um desenho técnico: fio contínuo na margem,
 * um tick amarelo marcando o início da seção e o número real daquela
 * seção em fonte mono. Rolar a página vira ler uma elevação de cima a
 * baixo. É decorativa (`aria-hidden`) — todo número que aparece aqui
 * também está no texto da seção.
 *
 * No mobile colapsa para o fio e o tick, sem o texto rotacionado.
 */
function Cota({ valor, tom }: { valor?: string; tom: Tom }) {
  const { fio, texto } = tons[tom];

  return (
    <div aria-hidden="true" className="relative select-none">
      <span className={cn("absolute inset-y-0 left-0 w-px", fio)} />
      <div className="sticky top-24 pt-16 md:pt-24">
        <span className="block h-px w-2 bg-marca md:w-4" />
        {valor ? (
          <span
            className={cn(
              "etiqueta mt-4 hidden [writing-mode:vertical-rl] md:block",
              texto,
            )}
          >
            {valor}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function Secao({
  id,
  tom = "cal",
  cota,
  children,
  className,
  espacamento = "padrao",
}: {
  id?: string;
  tom?: Tom;
  /** Número real que marca a seção na cota, ex.: "180 m²", "11 meses". */
  cota?: string;
  children: React.ReactNode;
  className?: string;
  espacamento?: "padrao" | "solto" | "justo";
}) {
  const espacamentos = {
    justo: "py-12 md:py-16",
    padrao: "py-16 md:py-24",
    solto: "py-20 md:py-32",
  } as const;

  return (
    <section id={id} className={cn("relative", tons[tom].secao, className)}>
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="grid grid-cols-[var(--espaco-cota-mobile)_1fr] md:grid-cols-[var(--espaco-cota)_1fr]">
          <Cota valor={cota} tom={tom} />
          <div className={espacamentos[espacamento]}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Etiqueta técnica que abre uma seção, no lugar do "sobretítulo" genérico. */
export function RotuloSecao({
  children,
  tom = "cal",
  className,
}: {
  children: React.ReactNode;
  tom?: Tom;
  className?: string;
}) {
  return (
    <Revelar>
      <p className={cn("etiqueta mb-5 flex items-center gap-3", tons[tom].texto, className)}>
        {/* O tick cresce da esquerda junto com a revelação — é a cota da
            seção se desenhando, não um enfeite entrando. */}
        <span className="h-px w-6 origin-left bg-marca" />
        {children}
      </p>
    </Revelar>
  );
}

export function TituloSecao({
  children,
  className,
  nivel = 2,
}: {
  children: React.ReactNode;
  className?: string;
  nivel?: 2 | 3;
}) {
  const Tag = nivel === 2 ? "h2" : "h3";
  return (
    // Atraso curto em relação ao rótulo: rótulo e título entram como uma
    // coisa só, mas em ordem de leitura.
    <Revelar atraso={80}>
      <Tag
        className={cn(
          "titulo",
          nivel === 2 ? "text-3xl md:text-5xl" : "text-xl md:text-2xl",
          className,
        )}
      >
        {children}
      </Tag>
    </Revelar>
  );
}
