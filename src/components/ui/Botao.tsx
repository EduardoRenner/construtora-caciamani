import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "primario" | "escuro" | "contorno" | "contornoClaro" | "texto";
type Tamanho = "md" | "lg";

/**
 * O hover dos botões de contorno é um preenchimento que SOBE de baixo,
 * não uma troca de cor. O bloco é retangular de propósito: é a mesma
 * marcação da cota subindo até a altura da peça, não um brilho.
 * A mecânica está em `.preenche`, no globals.css.
 */
const variantes: Record<Variante, string> = {
  // O amarelo da marca só aparece assim: preenchendo uma marca pequena,
  // com texto escuro por cima. Um por tela, no máximo.
  primario:
    "bg-marca text-[#16212e] hover:bg-marca-escura active:translate-y-px",
  escuro:
    "preenche bg-contraste text-sobre-contraste [--cor-preenche:var(--color-contraste-2)] active:translate-y-px",
  contorno:
    "preenche border border-noite/25 text-noite hover:border-noite [--cor-preenche:color-mix(in_srgb,var(--color-noite)_8%,transparent)] active:translate-y-px",
  contornoClaro:
    "preenche border border-sobre-contraste/30 text-sobre-contraste hover:border-sobre-contraste [--cor-preenche:color-mix(in_srgb,var(--color-sobre-contraste)_14%,transparent)] active:translate-y-px",
  texto:
    "text-noite underline decoration-marca decoration-2 underline-offset-4 hover:decoration-noite",
};

const tamanhos: Record<Tamanho, string> = {
  // 44px de alvo mínimo no mobile.
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-13 px-7 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-xs font-medium transition-colors duration-300 ease-expo";

type ComumProps = {
  variante?: Variante;
  tamanho?: Tamanho;
  className?: string;
  children: React.ReactNode;
};

export function Botao({
  variante = "primario",
  tamanho = "md",
  className,
  children,
  ...props
}: ComumProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variantes[variante], tamanhos[tamanho], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function BotaoLink({
  href,
  variante = "primario",
  tamanho = "md",
  className,
  children,
  externo = false,
  ...props
}: ComumProps & {
  href: string;
  externo?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const classes = cn(base, variantes[variante], tamanhos[tamanho], className);

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
