"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apagarObra, salvarObra, type DadosObra } from "@/acoes/admin";
import {
  Aviso,
  Campo,
  Interruptor,
  Painel,
  Selecao,
  Texto,
  paraEndereco,
  paraNumero,
} from "@/components/admin/Campos";
import { EnvioDeFotos, type FotoEnviada } from "@/components/admin/EnvioDeFotos";
import { FotoUnica, fotoVazia, type FotoComProporcao } from "@/components/admin/FotoUnica";
import { Botao, BotaoLink } from "@/components/ui/Botao";
import { rotulosTipoObra } from "@/content/tipos";

interface ParEditavel {
  /**
   * Identidade estável do par, só para o React. NÃO vai para o banco.
   *
   * Antes daqui a lista usava `key={indice}`. Com índice, apagar ou
   * reordenar um par faz o React reaproveitar o nó errado: o estado
   * interno dos campos de foto (proporção medida, arquivo em envio)
   * fica no par de cima. Não aparecia porque a lista é curta e cada
   * campo é controlado, mas quebra no primeiro reordenamento.
   *
   * A chave nasce no cliente e não vem do banco de propósito: par
   * recém-adicionado ainda não tem id, e o salvamento reescreve a lista
   * inteira — o id do banco não serviria para os dois casos.
   */
  chave: string;
  antes: FotoComProporcao;
  depois: FotoComProporcao;
  legenda: string;
  prazo: string;
  ano: string;
}

/**
 * Identificador só de interface. `randomUUID` não existe em contexto
 * inseguro (http em rede local, por exemplo), então há reserva.
 */
let contadorDeChaves = 0;
function novaChave(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  contadorDeChaves += 1;
  return `par-${Date.now()}-${contadorDeChaves}`;
}

export function FormularioObra({ obra }: { obra?: DadosObra & { id: string } }) {
  const router = useRouter();
  const editando = Boolean(obra?.id);

  const [titulo, setTitulo] = useState(obra?.titulo ?? "");
  const [endereco, setEndereco] = useState(obra?.slug ?? "");
  const [enderecoTocado, setEnderecoTocado] = useState(editando);
  const [tipo, setTipo] = useState(obra?.tipo ?? "casa");
  const [cidade, setCidade] = useState(obra?.cidade ?? "Maravilha");
  const [uf, setUf] = useState(obra?.uf ?? "SC");
  const [ano, setAno] = useState(obra?.ano?.toString() ?? "");
  const [area, setArea] = useState(obra?.areaM2?.toString() ?? "");
  const [prazo, setPrazo] = useState(obra?.prazoMeses?.toString() ?? "");
  const [resumo, setResumo] = useState(obra?.resumo ?? "");
  const [descricao, setDescricao] = useState(obra?.descricao ?? "");
  const [destaque, setDestaque] = useState(obra?.destaque ?? false);
  const [publicada, setPublicada] = useState(obra?.publicada ?? false);

  const [fotos, setFotos] = useState<FotoEnviada[]>(obra?.fotos ?? []);
  const [pares, setPares] = useState<ParEditavel[]>(
    (obra?.antesDepois ?? []).map((par) => ({
      chave: novaChave(),
      antes: { url: par.antesUrl, alt: par.antesAlt, proporcao: null },
      depois: { url: par.depoisUrl, alt: par.depoisAlt, proporcao: null },
      legenda: par.legenda ?? "",
      prazo: par.prazo ?? "",
      ano: par.ano?.toString() ?? "",
    })),
  );

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  /** Enquanto o Carlos não editar o endereço à mão, ele segue o título. */
  function mudarTitulo(novo: string) {
    setTitulo(novo);
    if (!enderecoTocado) setEndereco(paraEndereco(novo));
  }

  async function aoSalvar(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErro(null);
    setSalvo(false);

    const resposta = await salvarObra({
      id: obra?.id,
      slug: endereco,
      titulo,
      tipo,
      cidade,
      uf,
      ano: paraNumero(ano),
      areaM2: paraNumero(area),
      prazoMeses: paraNumero(prazo),
      resumo: resumo || null,
      descricao: descricao || null,
      capaUrl: fotos[0]?.url ?? null,
      capaAlt: fotos[0]?.alt || `Foto da obra ${titulo}`,
      destaque,
      publicada,
      ordem: obra?.ordem ?? 0,
      fotos: fotos.filter((foto) => foto.url),
      antesDepois: pares
        .filter((par) => par.antes.url && par.depois.url)
        .map((par) => ({
          antesUrl: par.antes.url,
          antesAlt: par.antes.alt || `Antes da obra ${titulo}`,
          depoisUrl: par.depois.url,
          depoisAlt: par.depois.alt || `Depois da obra ${titulo}`,
          legenda: par.legenda || null,
          prazo: par.prazo || null,
          ano: paraNumero(par.ano),
        })),
    });

    setSalvando(false);

    if (!resposta.ok) {
      setErro(resposta.erro ?? "Não foi possível salvar.");
      return;
    }

    setSalvo(true);
    router.refresh();
    if (!editando) router.push("/admin/obras");
  }

  return (
    <form onSubmit={aoSalvar} className="flex flex-col gap-6">
      <Painel titulo="A obra">
        <div className="grid gap-5 md:grid-cols-2">
          <Campo
            rotulo="Nome da obra"
            valor={titulo}
            aoMudar={mudarTitulo}
            obrigatorio
            className="md:col-span-2"
            dica="É o título que aparece no site. Ex.: “Casa em Maravilha”."
          />

          <Selecao
            rotulo="Tipo"
            valor={tipo}
            aoMudar={setTipo}
            opcoes={Object.entries(rotulosTipoObra).map(([id, rotulo]) => ({
              id,
              rotulo,
            }))}
          />

          <Campo
            rotulo="Endereço da página"
            valor={endereco}
            aoMudar={(v) => {
              setEnderecoTocado(true);
              setEndereco(paraEndereco(v));
            }}
            obrigatorio
            dica={`O site vai mostrar esta obra em /obras/${endereco || "…"}`}
          />

          <Campo rotulo="Cidade" valor={cidade} aoMudar={setCidade} obrigatorio />
          <Campo rotulo="Estado" valor={uf} aoMudar={setUf} obrigatorio />

          <Campo rotulo="Ano de entrega" valor={ano} aoMudar={setAno} tipo="number" />
          <Campo
            rotulo="Área construída (m²)"
            valor={area}
            aoMudar={setArea}
            tipo="number"
          />
          <Campo
            rotulo="Tempo de obra (meses)"
            valor={prazo}
            aoMudar={setPrazo}
            tipo="number"
          />

          <Texto
            rotulo="Resumo"
            valor={resumo}
            aoMudar={setResumo}
            linhas={2}
            className="md:col-span-2"
            dica="Uma linha, aparece embaixo da foto na listagem."
          />
          <Texto
            rotulo="Descrição"
            valor={descricao}
            aoMudar={setDescricao}
            linhas={6}
            className="md:col-span-2"
            dica="O texto da página da obra. O que o cliente pediu, o que o terreno impôs, o que foi resolvido."
          />
        </div>
      </Painel>

      <Painel
        titulo="Fotos"
        descricao="A primeira foto é a que aparece na capa e na listagem. Arraste para reordenar, ou use as setas."
      >
        <EnvioDeFotos fotos={fotos} aoMudar={setFotos} />
      </Painel>

      <Painel
        titulo="Antes e depois"
        descricao="As duas fotos precisam ser tiradas do MESMO ponto, com o mesmo enquadramento. Sem isso a comparação não funciona."
      >
        <div className="flex flex-col gap-8">
          {pares.map((par, indice) => {
            const desalinhado =
              par.antes.proporcao !== null &&
              par.depois.proporcao !== null &&
              Math.abs(par.antes.proporcao - par.depois.proporcao) > 0.02;

            return (
              <div key={par.chave} className="border-t border-noite/12 pt-6 first:border-0 first:pt-0">
                <div className="grid gap-5 md:grid-cols-2">
                  <FotoUnica
                    rotulo="Antes"
                    foto={par.antes}
                    aoMudar={(nova) => {
                      const copia = [...pares];
                      copia[indice] = { ...par, antes: nova };
                      setPares(copia);
                    }}
                  />
                  <FotoUnica
                    rotulo="Depois"
                    foto={par.depois}
                    aoMudar={(nova) => {
                      const copia = [...pares];
                      copia[indice] = { ...par, depois: nova };
                      setPares(copia);
                    }}
                  />
                </div>

                {desalinhado ? (
                  <p className="mt-4 border border-oxido/40 bg-oxido/6 px-4 py-3 text-sm text-oxido">
                    As duas fotos têm formatos diferentes. A comparação vai ficar
                    torta — o ideal é tirar as duas do mesmo ponto e com o
                    celular na mesma posição.
                  </p>
                ) : null}

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <Campo
                    rotulo="O que foi feito"
                    valor={par.legenda}
                    aoMudar={(v) => {
                      const copia = [...pares];
                      copia[indice] = { ...par, legenda: v };
                      setPares(copia);
                    }}
                  />
                  <Campo
                    rotulo="Prazo"
                    valor={par.prazo}
                    aoMudar={(v) => {
                      const copia = [...pares];
                      copia[indice] = { ...par, prazo: v };
                      setPares(copia);
                    }}
                    dica="Ex.: 11 meses"
                  />
                  <Campo
                    rotulo="Ano"
                    valor={par.ano}
                    tipo="number"
                    aoMudar={(v) => {
                      const copia = [...pares];
                      copia[indice] = { ...par, ano: v };
                      setPares(copia);
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setPares(pares.filter((_, i) => i !== indice))}
                  className="etiqueta mt-4 min-h-11 border border-oxido/40 px-3 text-oxido"
                >
                  Remover esta comparação
                </button>
              </div>
            );
          })}

          <Botao
            type="button"
            variante="contorno"
            onClick={() =>
              setPares([
                ...pares,
                {
                  chave: novaChave(),
                  antes: fotoVazia,
                  depois: fotoVazia,
                  legenda: "",
                  prazo: "",
                  ano: "",
                },
              ])
            }
          >
            Adicionar uma comparação
          </Botao>
        </div>
      </Painel>

      <Painel titulo="Publicação">
        <div className="flex flex-col gap-5">
          <Interruptor
            rotulo="Mostrar esta obra no site"
            dica="Enquanto estiver desmarcado, a obra fica só aqui no painel. Ninguém de fora vê."
            marcado={publicada}
            aoMudar={setPublicada}
          />
          <Interruptor
            rotulo="Destacar na página inicial"
            dica="As obras destacadas aparecem logo na primeira página do site."
            marcado={destaque}
            aoMudar={setDestaque}
          />
        </div>
      </Painel>

      {erro ? <Aviso>{erro}</Aviso> : null}
      {salvo ? <Aviso tom="sucesso">Salvo. O site já está atualizado.</Aviso> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Botao type="submit" tamanho="lg" disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </Botao>

        <BotaoLink href="/admin/obras" variante="contorno">
          Voltar
        </BotaoLink>

        {editando && publicada ? (
          <Link
            href={`/obras/${endereco}`}
            target="_blank"
            className="etiqueta py-2 text-concreto underline decoration-marca decoration-2 underline-offset-4"
          >
            Ver no site
          </Link>
        ) : null}

        {editando ? (
          <button
            type="button"
            onClick={async () => {
              if (!confirm(`Apagar a obra “${titulo}”? Não dá para desfazer.`)) return;
              const resposta = await apagarObra(obra!.id, endereco);
              if (resposta.ok) router.push("/admin/obras");
              else setErro(resposta.erro ?? "Não foi possível apagar.");
            }}
            className="etiqueta ml-auto min-h-11 border border-oxido/40 px-4 text-oxido"
          >
            Apagar obra
          </button>
        ) : null}
      </div>
    </form>
  );
}
