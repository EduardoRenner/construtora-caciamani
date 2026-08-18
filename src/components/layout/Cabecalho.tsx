"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Marca } from "./Marca";
import { AlternarTema } from "./AlternarTema";
import { BotaoLink } from "@/components/ui/Botao";
import { IconeFechar, IconeMenu, IconeWhatsApp } from "@/components/ui/Icones";
import { linkWhatsApp, mensagemPadraoWhatsApp, navegacao } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const caminho = usePathname();
  const botaoMenu = useRef<HTMLButtonElement>(null);

  // O header nasce transparente sobre o hero e ganha superfície depois
  // que a página rola — assim a foto da obra abre sem faixa por cima.
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Fecha o menu ao trocar de página.
  useEffect(() => setAberto(false), [caminho]);

  // O cabeçalho nasce transparente SOBRE A FOTO DO HERO, que é escura e
  // não muda com o tema — o hero inteiro é `superficie-escura` por isso.
  // O cabeçalho ficava de fora dessa regra: no tema claro a tinta era
  // `noite` sobre foto escura, e a marca caía para 2,77:1 e os links
  // para 1,08:1 (medido). Só a home tem hero; as internas abrem em
  // superfície clara e precisam da tinta normal do tema.
  const sobreHero = caminho === "/" && !aberto && !rolou;

  // Esc fecha e devolve o foco para o botão que abriu.
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-obra",
        rolou || aberto
          ? "border-b border-noite/10 bg-cal/95 backdrop-blur-sm"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
        {/* O nome acessível precisa CONTER o texto visível (WCAG 2.5.3,
            Label in Name). Sem isso, quem usa comando de voz diz
            "clicar em Caciamani" e o navegador não encontra o link. */}
        <Link
          href="/"
          className="shrink-0"
          aria-label="Caciamani Construtora Incorporadora — página inicial"
        >
          <Marca claro={sobreHero} />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navegacao.map((item) => {
              const ativo = caminho === item.href || caminho.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    // `sublinha` cresce da esquerda no hover e fica fixa
                    // na página atual — a mesma gramática do tick da cota.
                    className={cn(
                      "etiqueta sublinha relative py-2 transition-colors duration-300",
                      // Sobre o hero a tinta é cheia para todos: `vidro`
                      // dava 3,74:1 e a etiqueta tem 12px, que é texto
                      // normal para o AA (4,5:1), não texto grande. Não
                      // se perde a marcação da página atual porque
                      // `sobreHero` só é verdadeiro em `/`, e a home não
                      // está na navegação.
                      sobreHero
                        ? "text-sobre-contraste"
                        : ativo
                          ? "text-noite"
                          : "text-concreto hover:text-noite",
                    )}
                  >
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <AlternarTema claro={sobreHero} />

          {/* O `hidden` mora num elemento PRÓPRIO, e não no `className`
              do botão. `cn` é um join simples: passada por className, a
              classe `hidden` conviveria com o `inline-flex` da base do
              BotaoLink, e quem decide o vencedor é a ordem do CSS
              gerado — onde `.inline-flex` vem DEPOIS de `.hidden`. O
              resultado era o botão aparecer no celular e empurrar o
              menu hambúrguer para fora da tela (x=459 numa tela de
              375px), deixando o site sem navegação no telefone. */}
          <span className="hidden sm:block">
            <BotaoLink
              href={linkWhatsApp(mensagemPadraoWhatsApp)}
              externo
              variante="escuro"
            >
              <IconeWhatsApp className="size-4" />
              Falar no WhatsApp
            </BotaoLink>
          </span>

          <button
            ref={botaoMenu}
            type="button"
            onClick={() => setAberto((estado) => !estado)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            className={cn(
              "-mr-2 flex size-11 shrink-0 items-center justify-center transition-colors duration-300 lg:hidden",
              sobreHero ? "text-sobre-contraste" : "text-noite",
            )}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            {aberto ? <IconeFechar className="size-6" /> : <IconeMenu className="size-6" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!aberto}
        className="border-t border-noite/10 bg-cal lg:hidden"
      >
        <nav aria-label="Principal (mobile)" className="px-4 py-4">
          <ul className="flex flex-col">
            {navegacao.map((item) => (
              <li key={item.href} className="border-b border-noite/8 last:border-0">
                <Link
                  href={item.href}
                  className="titulo flex items-center justify-between py-4 text-2xl"
                >
                  {item.rotulo}
                  <span className="etiqueta text-concreto">
                    {String(navegacao.indexOf(item) + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <BotaoLink
            href={linkWhatsApp(mensagemPadraoWhatsApp)}
            externo
            tamanho="lg"
            className="mt-5 w-full"
          >
            <IconeWhatsApp className="size-5" />
            Falar no WhatsApp
          </BotaoLink>
        </nav>
      </div>
    </header>
  );
}
