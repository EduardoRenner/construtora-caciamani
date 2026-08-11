"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apagarDepoimento, salvarDepoimento } from "@/acoes/admin";
import { Aviso, Campo, Interruptor, Painel, Texto } from "@/components/admin/Campos";
import { Botao } from "@/components/ui/Botao";
import type { LinhaDepoimento } from "@/lib/dadosAdmin";

interface Rascunho {
  id?: string;
  nome: string;
  cidade: string;
  bairro: string;
  texto: string;
  autorizado: boolean;
  publicado: boolean;
}

const vazio: Rascunho = {
  nome: "",
  cidade: "",
  bairro: "",
  texto: "",
  autorizado: false,
  publicado: false,
};

export function EditorDepoimentos({ depoimentos }: { depoimentos: LinhaDepoimento[] }) {
  const router = useRouter();
  const [rascunho, setRascunho] = useState<Rascunho>(vazio);
  const [salvando, setSalvando] = useState(false);
  const [estado, setEstado] = useState<null | { ok: boolean; texto: string }>(null);

  async function salvar() {
    setSalvando(true);
    setEstado(null);

    const resposta = await salvarDepoimento({
      id: rascunho.id,
      nome: rascunho.nome,
      cidade: rascunho.cidade,
      bairro: rascunho.bairro || null,
      texto: rascunho.texto,
      autorizado: rascunho.autorizado,
      publicado: rascunho.publicado,
      ordem: depoimentos.length,
    });

    setSalvando(false);

    if (resposta.ok) {
      setRascunho(vazio);
      setEstado({ ok: true, texto: "Depoimento salvo." });
      router.refresh();
    } else {
      setEstado({ ok: false, texto: resposta.erro ?? "Não deu para salvar." });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Painel
        titulo={rascunho.id ? "Editando depoimento" : "Novo depoimento"}
        descricao="Escreva com as palavras do próprio cliente. Depoimento reescrito por nós soa igual a todos os outros — e some o motivo de ele existir."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Campo
            rotulo="Nome do cliente"
            valor={rascunho.nome}
            aoMudar={(v) => setRascunho({ ...rascunho, nome: v })}
            obrigatorio
          />
          <Campo
            rotulo="Cidade"
            valor={rascunho.cidade}
            aoMudar={(v) => setRascunho({ ...rascunho, cidade: v })}
            obrigatorio
          />
          <Campo
            rotulo="Bairro"
            valor={rascunho.bairro}
            aoMudar={(v) => setRascunho({ ...rascunho, bairro: v })}
          />
        </div>

        <div className="mt-5">
          <Texto
            rotulo="O que ele disse"
            valor={rascunho.texto}
            aoMudar={(v) => setRascunho({ ...rascunho, texto: v })}
            linhas={5}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Interruptor
            rotulo="O cliente autorizou usar o nome e o depoimento"
            dica="Sem autorização não publica. Um cliente que se vê no site sem ter sido avisado vira problema."
            marcado={rascunho.autorizado}
            aoMudar={(v) =>
              setRascunho({
                ...rascunho,
                autorizado: v,
                publicado: v ? rascunho.publicado : false,
              })
            }
          />
          <Interruptor
            rotulo="Mostrar no site"
            marcado={rascunho.publicado}
            aoMudar={(v) => setRascunho({ ...rascunho, publicado: v })}
          />
          {rascunho.publicado && !rascunho.autorizado ? (
            <p className="text-sm text-oxido">
              Este depoimento não vai ao ar enquanto a autorização não estiver
              marcada.
            </p>
          ) : null}
        </div>

        {estado ? (
          <div className="mt-6">
            <Aviso tom={estado.ok ? "sucesso" : "erro"}>{estado.texto}</Aviso>
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <Botao
            type="button"
            onClick={salvar}
            disabled={salvando || !rascunho.nome || !rascunho.texto}
          >
            {salvando ? "Salvando…" : "Salvar depoimento"}
          </Botao>
          {rascunho.id ? (
            <Botao type="button" variante="contorno" onClick={() => setRascunho(vazio)}>
              Cancelar edição
            </Botao>
          ) : null}
        </div>
      </Painel>

      <Painel titulo={`Depoimentos cadastrados (${depoimentos.length})`}>
        {depoimentos.length === 0 ? (
          <p className="text-concreto">Nenhum depoimento ainda.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {depoimentos.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-4 border border-noite/12 p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {item.nome} · {item.cidade}
                  </p>
                  <p className="prosa mt-2 text-sm text-concreto">{item.texto}</p>
                  <p className="etiqueta mt-3 text-concreto">
                    {item.publicado && item.autorizado
                      ? "No site"
                      : item.autorizado
                        ? "Autorizado, fora do site"
                        : "Sem autorização"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRascunho({
                        id: item.id,
                        nome: item.nome,
                        cidade: item.cidade,
                        bairro: item.bairro ?? "",
                        texto: item.texto,
                        autorizado: item.autorizado,
                        publicado: item.publicado,
                      })
                    }
                    className="etiqueta min-h-11 border border-noite/25 px-3"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Apagar o depoimento de ${item.nome}?`)) return;
                      await apagarDepoimento(item.id);
                      router.refresh();
                    }}
                    className="etiqueta min-h-11 border border-oxido/40 px-3 text-oxido"
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Painel>
    </div>
  );
}
