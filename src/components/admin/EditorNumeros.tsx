"use client";

import { useState } from "react";
import { salvarCidades, salvarEstatisticas } from "@/acoes/admin";
import { Aviso, Campo, Painel, Texto, paraNumero } from "@/components/admin/Campos";
import { Botao } from "@/components/ui/Botao";
import type { Estatistica } from "@/content/empresa";

export function EditorNumeros({
  estatisticas,
  cidades,
}: {
  estatisticas: Estatistica[];
  cidades: string[];
}) {
  const [itens, setItens] = useState(
    estatisticas.map((e) => ({
      rotulo: e.rotulo,
      valor: e.valor?.toString() ?? "",
      qualificador: e.qualificador ?? "",
      sufixo: e.sufixo ?? "",
    })),
  );
  const [listaCidades, setListaCidades] = useState(cidades.join("\n"));
  const [estado, setEstado] = useState<null | { ok: boolean; texto: string }>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    setSalvando(true);
    setEstado(null);

    const respostaNumeros = await salvarEstatisticas(
      itens.map((item) => ({
        rotulo: item.rotulo,
        valor: paraNumero(item.valor),
        qualificador: item.qualificador.trim() || null,
        sufixo: item.sufixo.trim() || undefined,
      })),
    );

    const respostaCidades = await salvarCidades(
      listaCidades
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean),
    );

    setSalvando(false);
    setEstado(
      respostaNumeros.ok && respostaCidades.ok
        ? { ok: true, texto: "Salvo. O site já está atualizado." }
        : {
            ok: false,
            texto: respostaNumeros.erro ?? respostaCidades.erro ?? "Não deu para salvar.",
          },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Painel
        titulo="Os quatro números da página inicial"
        descricao="Deixe em branco o que você não tiver certeza. Número em branco aparece marcado como pendente no site — o que é bem melhor do que um número errado."
      >
        <div className="flex flex-col gap-8">
          {itens.map((item, indice) => (
            <div key={item.rotulo} className="grid gap-4 md:grid-cols-[1fr_auto_2fr]">
              <Campo
                rotulo="O que é"
                valor={item.rotulo}
                aoMudar={(v) => {
                  const copia = [...itens];
                  copia[indice] = { ...item, rotulo: v };
                  setItens(copia);
                }}
              />
              <Campo
                rotulo="Número"
                valor={item.valor}
                tipo="number"
                aoMudar={(v) => {
                  const copia = [...itens];
                  copia[indice] = { ...item, valor: v };
                  setItens(copia);
                }}
              />
              <Campo
                rotulo="Frase curta embaixo"
                valor={item.qualificador}
                aoMudar={(v) => {
                  const copia = [...itens];
                  copia[indice] = { ...item, qualificador: v };
                  setItens(copia);
                }}
                dica="Ex.: “em Maravilha e região”, “desde 2005”."
              />
            </div>
          ))}
        </div>
      </Painel>

      <Painel
        titulo="Cidades atendidas"
        descricao="Uma por linha. Só coloque cidade onde vocês realmente atendem — prometer atendimento onde não há gera contato que não vira obra."
      >
        <Texto
          rotulo="Cidades"
          valor={listaCidades}
          aoMudar={setListaCidades}
          linhas={8}
        />
      </Painel>

      {estado ? (
        <Aviso tom={estado.ok ? "sucesso" : "erro"}>{estado.texto}</Aviso>
      ) : null}

      <div>
        <Botao type="button" tamanho="lg" onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </Botao>
      </div>
    </div>
  );
}
