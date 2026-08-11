import Link from "next/link";
import { Marca } from "./Marca";
import { Pendente } from "@/components/Pendente";
import { IconeInstagram, IconeWhatsApp } from "@/components/ui/Icones";
import { empresa } from "@/content/empresa";
import { linkWhatsApp, mensagemPadraoWhatsApp, navegacao } from "@/lib/site";

export function Rodape() {
  const { cadastro, endereco, telefones, redes } = empresa;

  return (
    <footer className="superficie-escura bg-contraste text-sobre-contraste">
      <div className="mx-auto max-w-[86rem] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Marca claro />
            <p className="prosa mt-5 text-sm text-vidro/75">
              Construção e incorporação em {empresa.cidadeSede}/{empresa.uf} e
              região.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={linkWhatsApp(mensagemPadraoWhatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center border border-sobre-contraste/20 text-sobre-contraste transition-colors hover:border-marca hover:text-marca"
              >
                <IconeWhatsApp className="size-5" />
                <span className="sr-only">WhatsApp da Construtora Caciamani</span>
              </a>
              <a
                href={redes.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center border border-sobre-contraste/20 text-sobre-contraste transition-colors hover:border-marca hover:text-marca"
              >
                <IconeInstagram className="size-5" />
                <span className="sr-only">
                  Instagram @{redes.instagram.usuario}
                </span>
              </a>
            </div>
          </div>

          <nav aria-label="Rodapé">
            <h2 className="etiqueta text-vidro/75">Navegar</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm text-sobre-contraste/90 transition-colors hover:text-marca"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="etiqueta text-vidro/75">Contato</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={linkWhatsApp(mensagemPadraoWhatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tabular inline-block py-1 text-sobre-contraste/90 transition-colors hover:text-marca"
                >
                  {telefones.principal.exibicao}
                </a>
                {!telefones.principal.confirmado ? (
                  <Pendente className="ml-2">confirmar qual WhatsApp é o do site</Pendente>
                ) : null}
              </li>
              <li>
                {empresa.email ? (
                  <a
                    href={`mailto:${empresa.email}`}
                    className="inline-block py-1 text-sobre-contraste/90 transition-colors hover:text-marca"
                  >
                    {empresa.email}
                  </a>
                ) : (
                  <Pendente>e-mail de contato</Pendente>
                )}
              </li>
              <li className="text-vidro/75">
                {endereco.logradouro ? (
                  <>
                    {endereco.logradouro} — {endereco.bairro}
                    <br />
                    {endereco.cidade}/{endereco.uf}
                  </>
                ) : (
                  <Pendente>endereço do escritório</Pendente>
                )}
              </li>
              <li className="text-vidro/75">
                {empresa.horarioAtendimento ?? (
                  <Pendente>horário de atendimento</Pendente>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-sobre-contraste/15 pt-6 text-xs text-vidro/75 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>
              © {new Date().getFullYear()} {cadastro.razaoSocial ?? empresa.nome}
            </span>
            <span className="tabular">
              {cadastro.cnpj ? `CNPJ ${cadastro.cnpj}` : <Pendente>CNPJ</Pendente>}
            </span>
            <span className="tabular">
              {cadastro.crea && cadastro.responsavelTecnico ? (
                `${cadastro.crea} — ${cadastro.responsavelTecnico}`
              ) : (
                <Pendente>CREA e responsável técnico</Pendente>
              )}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
