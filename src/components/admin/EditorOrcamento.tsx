"use client";

import { useMemo, useState } from "react";
import { salvarCoeficientes } from "@/acoes/admin";
import { Aviso, Campo, Painel, paraNumero } from "@/components/admin/Campos";
import { Botao } from "@/components/ui/Botao";
import {
  calcularOrcamento,
  faixaArea,
  padroesAcabamento,
  tiposConstrucao,
  type Coeficientes,
  type PadraoAcabamento,
  type TipoConstrucao,
} from "@/config/orcamento";
import { reaisBR } from "@/lib/utils";

/**
 * Edição dos coeficientes do simulador, com prévia ao vivo.
 *
 * A prévia é o ponto: o Carlinhos não pensa em "fator 1.2", ele pensa em
 * "casa de 150 m² dá quanto?". Ver o resultado mudar enquanto digita é o
 * que torna a calibragem possível sem ele entender a fórmula.
 */
export function EditorOrcamento({ inicial }: { inicial: Coeficientes }) {
  const [cub, setCub] = useState(inicial.cubValorM2?.toString() ?? "");
  const [projetoPadrao, setProjetoPadrao] = useState(inicial.cubProjetoPadrao ?? "");
  const [referencia, setReferencia] = useState(inicial.cubReferencia ?? "");
  const [amplitude, setAmplitude] = useState(
    inicial.amplitude !== null ? String(inicial.amplitude * 100) : "",
  );

  const [fatoresTipo, setFatoresTipo] = useState<Record<string, string>>(
    Object.fromEntries(
      tiposConstrucao.map((t) => [t.id, inicial.fatoresTipo[t.id]?.toString() ?? ""]),
    ),
  );
  const [prazoBase, setPrazoBase] = useState<Record<string, string>>(
    Object.fromEntries(
      tiposConstrucao.map((t) => [t.id, inicial.prazos[t.id]?.base?.toString() ?? ""]),
    ),
  );
  const [prazoPorCem, setPrazoPorCem] = useState<Record<string, string>>(
    Object.fromEntries(
      tiposConstrucao.map((t) => [
        t.id,
        inicial.prazos[t.id]?.porCemM2?.toString() ?? "",
      ]),
    ),
  );
  const [fatoresPadrao, setFatoresPadrao] = useState<Record<string, string>>(
    Object.fromEntries(
      padroesAcabamento.map((p) => [p.id, inicial.fatoresPadrao[p.id]?.toString() ?? ""]),
    ),
  );

  const [tipoPrevia, setTipoPrevia] = useState<TipoConstrucao>("casa-terrea");
  const [areaPrevia, setAreaPrevia] = useState("150");
  const [padraoPrevia, setPadraoPrevia] = useState<PadraoAcabamento>("medio");

  const [salvando, setSalvando] = useState(false);
  const [estado, setEstado] = useState<null | { ok: boolean; texto: string }>(null);

  const coeficientes: Coeficientes = useMemo(() => {
    const porcentagem = paraNumero(amplitude);
    return {
      cubValorM2: paraNumero(cub),
      cubProjetoPadrao: projetoPadrao.trim() || null,
      cubReferencia: referencia.trim() || null,
      amplitude: porcentagem === null ? null : porcentagem / 100,
      fatoresTipo: Object.fromEntries(
        tiposConstrucao.map((t) => [t.id, paraNumero(fatoresTipo[t.id] ?? "")]),
      ) as Coeficientes["fatoresTipo"],
      fatoresPadrao: Object.fromEntries(
        padroesAcabamento.map((p) => [p.id, paraNumero(fatoresPadrao[p.id] ?? "")]),
      ) as Coeficientes["fatoresPadrao"],
      prazos: Object.fromEntries(
        tiposConstrucao.map((t) => [
          t.id,
          {
            base: paraNumero(prazoBase[t.id] ?? ""),
            porCemM2: paraNumero(prazoPorCem[t.id] ?? ""),
          },
        ]),
      ) as Coeficientes["prazos"],
    };
  }, [cub, projetoPadrao, referencia, amplitude, fatoresTipo, fatoresPadrao, prazoBase, prazoPorCem]);

  const previa = calcularOrcamento(
    {
      tipo: tipoPrevia,
      areaM2: paraNumero(areaPrevia) ?? faixaArea.minimo,
      padrao: padraoPrevia,
    },
    coeficientes,
  );

  async function salvar() {
    setSalvando(true);
    setEstado(null);
    const resposta = await salvarCoeficientes(coeficientes);
    setSalvando(false);
    setEstado(
      resposta.ok
        ? { ok: true, texto: "Salvo. O simulador do site já usa estes valores." }
        : { ok: false, texto: resposta.erro ?? "Não deu para salvar." },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Painel
        titulo="Ponto de partida: o CUB"
        descricao="O CUB é o custo por metro quadrado publicado todo mês pelo Sinduscon. É dele que sai toda a conta — quando o custo sobe, basta atualizar este número aqui."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Campo
            rotulo="CUB por m² (R$)"
            valor={cub}
            aoMudar={setCub}
            tipo="number"
            dica="Só o número, sem R$. Ex.: 2650"
          />
          <Campo
            rotulo="Margem da faixa (%)"
            valor={amplitude}
            aoMudar={setAmplitude}
            tipo="number"
            dica="15 mostra de 15% abaixo a 15% acima. O site nunca mostra valor único."
          />
          <Campo
            rotulo="Qual CUB você usou"
            valor={projetoPadrao}
            aoMudar={setProjetoPadrao}
            dica="Ex.: R-8 Normal. Só para você lembrar depois."
          />
          <Campo
            rotulo="Mês de referência"
            valor={referencia}
            aoMudar={setReferencia}
            dica="Ex.: julho/2026"
          />
        </div>
      </Painel>

      <Painel
        titulo="Quanto cada tipo de obra custa a mais ou a menos"
        descricao="Um número perto de 1 significa “custa o mesmo que o CUB”. 1,2 significa 20% mais caro. Germinada costuma ficar abaixo de 1; sobrado e prédio, acima."
      >
        <div className="flex flex-col gap-6">
          {tiposConstrucao.map((tipo) => (
            <div key={tipo.id} className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
              <p className="self-end pb-3 text-sm font-medium">{tipo.rotulo}</p>
              <Campo
                rotulo="Fator de custo"
                valor={fatoresTipo[tipo.id] ?? ""}
                tipo="number"
                aoMudar={(v) => setFatoresTipo({ ...fatoresTipo, [tipo.id]: v })}
              />
              <Campo
                rotulo="Meses de base"
                valor={prazoBase[tipo.id] ?? ""}
                tipo="number"
                aoMudar={(v) => setPrazoBase({ ...prazoBase, [tipo.id]: v })}
              />
              <Campo
                rotulo="+ meses a cada 100 m²"
                valor={prazoPorCem[tipo.id] ?? ""}
                tipo="number"
                aoMudar={(v) => setPrazoPorCem({ ...prazoPorCem, [tipo.id]: v })}
              />
            </div>
          ))}
        </div>
      </Painel>

      <Painel
        titulo="Quanto o acabamento pesa"
        descricao="Mesma ideia: 1 é o padrão do CUB, acima disso encarece."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {padroesAcabamento.map((padrao) => (
            <Campo
              key={padrao.id}
              rotulo={padrao.rotulo}
              valor={fatoresPadrao[padrao.id] ?? ""}
              tipo="number"
              aoMudar={(v) => setFatoresPadrao({ ...fatoresPadrao, [padrao.id]: v })}
            />
          ))}
        </div>
      </Painel>

      <Painel
        titulo="Prévia — teste antes de salvar"
        descricao="Escolha uma obra de exemplo e veja o que o cliente veria com os valores acima. Nada disso é salvo até você clicar em salvar."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="previa-tipo" className="etiqueta block text-concreto">
              Tipo
            </label>
            <select
              id="previa-tipo"
              value={tipoPrevia}
              onChange={(e) => setTipoPrevia(e.target.value as TipoConstrucao)}
              className="mt-2 min-h-11 w-full border border-noite/20 bg-cal px-3 text-base"
            >
              {tiposConstrucao.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.rotulo}
                </option>
              ))}
            </select>
          </div>

          <Campo
            rotulo="Área (m²)"
            valor={areaPrevia}
            aoMudar={setAreaPrevia}
            tipo="number"
          />

          <div>
            <label htmlFor="previa-padrao" className="etiqueta block text-concreto">
              Padrão
            </label>
            <select
              id="previa-padrao"
              value={padraoPrevia}
              onChange={(e) => setPadraoPrevia(e.target.value as PadraoAcabamento)}
              className="mt-2 min-h-11 w-full border border-noite/20 bg-cal px-3 text-base"
            >
              {padroesAcabamento.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          aria-live="polite"
          className="mt-7 border-t border-noite/12 pt-6"
        >
          {previa.calculavel ? (
            <>
              <p className="etiqueta text-concreto">O cliente veria</p>
              <p className="titulo mt-3 text-2xl md:text-3xl">
                {reaisBR(previa.minimo)} a {reaisBR(previa.maximo)}
              </p>
              <p className="tabular mt-2 text-concreto">
                Obra de {previa.prazoMinimoMeses} a {previa.prazoMaximoMeses} meses
              </p>
            </>
          ) : (
            <>
              <p className="etiqueta text-oxido">
                Com estes valores o site ainda não calcula
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-concreto">
                {previa.faltando.map((item) => (
                  <li key={item}>Falta {item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Painel>

      {estado ? (
        <Aviso tom={estado.ok ? "sucesso" : "erro"}>{estado.texto}</Aviso>
      ) : null}

      <div>
        <Botao type="button" tamanho="lg" onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar os valores"}
        </Botao>
      </div>
    </div>
  );
}
