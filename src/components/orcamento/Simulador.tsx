"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { registrarLeadOrcamento } from "@/acoes/leads";
import { CampoArea } from "@/components/orcamento/CampoArea";
import { CampoOpcoes } from "@/components/orcamento/CampoOpcoes";
import { CampoArmadilha, CampoTexto } from "@/components/orcamento/CampoTexto";
import { Resultado } from "@/components/orcamento/Resultado";
import { Botao } from "@/components/ui/Botao";
import { IconeSeta } from "@/components/ui/Icones";
import {
  calcularOrcamento,
  padroesAcabamento,
  prazosInicio,
  situacoesTerreno,
  tiposConstrucao,
  type Coeficientes,
  type PadraoAcabamento,
  type ResultadoOrcamento,
  type TipoConstrucao,
} from "@/config/orcamento";
import { mensagemOrcamento } from "@/lib/mensagens";
import { camposPorPasso, schemaOrcamento, type DadosOrcamento } from "@/lib/validacao";

const TOTAL_PASSOS = 6;

/**
 * Os coeficientes chegam por props, lidos do banco pela página no
 * servidor. Nunca de estado de módulo: em servidor de vida longa, um
 * valor global seria compartilhado entre visitantes.
 */
export function Simulador({ coeficientes }: { coeficientes: Coeficientes }) {
  const [passo, setPasso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [concluido, setConcluido] = useState<{
    resultado: ResultadoOrcamento;
    mensagem: string;
    gravado: boolean;
  } | null>(null);

  const topo = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DadosOrcamento>({
    resolver: zodResolver(schemaOrcamento),
    mode: "onTouched",
    defaultValues: { areaM2: 150, cidade: "", nome: "", telefone: "", email: "", site: "" },
  });

  const area = watch("areaM2");

  /** Leva o foco e a vista para o começo do passo que acabou de entrar. */
  const irParaTopo = () => {
    topo.current?.scrollIntoView({ block: "start" });
    topo.current?.focus({ preventScroll: true });
  };

  const avancar = async () => {
    const valido = await trigger(camposPorPasso[passo]);
    if (!valido) return;
    setPasso((atual) => Math.min(TOTAL_PASSOS - 1, atual + 1));
    irParaTopo();
  };

  const voltar = () => {
    setPasso((atual) => Math.max(0, atual - 1));
    irParaTopo();
  };

  const aoEnviar = handleSubmit(async (dados) => {
    setEnviando(true);
    setErroEnvio(null);

    // O lead é gravado ANTES de qualquer redirecionamento: se a pessoa
    // desistir na tela do WhatsApp, o contato já está salvo.
    const envio = await registrarLeadOrcamento(dados);

    if (!envio.ok) {
      setEnviando(false);
      setErroEnvio(envio.erro ?? "Não foi possível enviar. Tente novamente.");
      return;
    }

    const resultado = calcularOrcamento(
      {
        tipo: dados.tipo as TipoConstrucao,
        areaM2: dados.areaM2,
        padrao: dados.padrao as PadraoAcabamento,
      },
      coeficientes,
    );

    setConcluido({
      resultado,
      mensagem: mensagemOrcamento(dados, resultado),
      gravado: envio.gravado,
    });
    setEnviando(false);
    irParaTopo();
  });

  if (concluido) {
    return (
      <div ref={topo} tabIndex={-1} className="scroll-mt-28 outline-none">
        <Resultado {...concluido} />
      </div>
    );
  }

  return (
    <div ref={topo} tabIndex={-1} className="scroll-mt-28 outline-none">
      <Progresso passo={passo} />

      <form onSubmit={aoEnviar} noValidate className="relative mt-10">
        <CampoArmadilha registro={register("site")} />

        {passo === 0 ? (
          <CampoOpcoes
            legenda="O que você quer construir?"
            opcoes={tiposConstrucao.map((t) => ({
              id: t.id,
              rotulo: t.rotulo,
              descricao: t.descricao,
            }))}
            registro={register("tipo")}
            erro={errors.tipo?.message}
            colunas={3}
          />
        ) : null}

        {passo === 1 ? (
          <CampoArea
            valor={area}
            aoMudar={(novo) =>
              setValue("areaM2", novo, { shouldValidate: true, shouldDirty: true })
            }
            erro={errors.areaM2?.message}
          />
        ) : null}

        {passo === 2 ? (
          <CampoOpcoes
            legenda="Qual padrão de acabamento?"
            descricao="Os itens abaixo são exemplos do que costuma entrar em cada padrão. Dá para misturar depois."
            opcoes={padroesAcabamento.map((p) => ({
              id: p.id,
              rotulo: p.rotulo,
              itens: p.itens,
            }))}
            registro={register("padrao")}
            erro={errors.padrao?.message}
            colunas={3}
          />
        ) : null}

        {passo === 3 ? (
          <div>
            <CampoOpcoes
              legenda="E o terreno?"
              opcoes={situacoesTerreno.map((s) => ({ id: s.id, rotulo: s.rotulo }))}
              registro={register("terreno")}
              erro={errors.terreno?.message}
            />
            <CampoTexto
              rotulo="Em qual cidade"
              registro={register("cidade")}
              erro={errors.cidade?.message}
              autoComplete="address-level2"
              className="mt-8 max-w-sm"
            />
          </div>
        ) : null}

        {passo === 4 ? (
          <CampoOpcoes
            legenda="Quando pretende começar?"
            opcoes={prazosInicio.map((p) => ({ id: p.id, rotulo: p.rotulo }))}
            registro={register("prazoInicio")}
            erro={errors.prazoInicio?.message}
          />
        ) : null}

        {passo === 5 ? (
          <fieldset>
            <legend className="titulo text-2xl md:text-4xl">
              Para onde mandamos a estimativa?
            </legend>
            <p className="prosa mt-4 text-concreto">
              Só isso. Nada de cadastro, nada de senha.
            </p>

            <div className="mt-8 grid max-w-2xl gap-6 sm:grid-cols-2">
              <CampoTexto
                rotulo="Seu nome"
                registro={register("nome")}
                erro={errors.nome?.message}
                autoComplete="name"
              />
              <CampoTexto
                rotulo="WhatsApp"
                tipo="tel"
                inputMode="tel"
                registro={register("telefone")}
                erro={errors.telefone?.message}
                autoComplete="tel"
                dica="Com DDD"
              />
              <CampoTexto
                rotulo="E-mail"
                tipo="email"
                inputMode="email"
                opcional
                registro={register("email")}
                erro={errors.email?.message}
                autoComplete="email"
                className="sm:col-span-2"
              />
            </div>
          </fieldset>
        ) : null}

        {erroEnvio ? (
          <p role="alert" className="mt-8 border border-oxido/50 px-4 py-3 text-sm text-oxido">
            {erroEnvio}
          </p>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-noite/15 pt-8">
          {passo > 0 ? (
            <Botao type="button" variante="contorno" onClick={voltar}>
              Voltar
            </Botao>
          ) : null}

          {passo < TOTAL_PASSOS - 1 ? (
            <Botao type="button" onClick={avancar} tamanho="lg">
              Continuar
              <IconeSeta className="size-4" />
            </Botao>
          ) : (
            <Botao type="submit" tamanho="lg" disabled={enviando}>
              {enviando ? "Enviando…" : "Ver a estimativa"}
              <IconeSeta className="size-4" />
            </Botao>
          )}
        </div>
      </form>
    </div>
  );
}

function Progresso({ passo }: { passo: number }) {
  const porcentagem = ((passo + 1) / TOTAL_PASSOS) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="etiqueta text-concreto">
          Passo {passo + 1} de {TOTAL_PASSOS}
        </p>
        <p className="tabular text-sm text-concreto">{Math.round(porcentagem)}%</p>
      </div>

      <div
        role="progressbar"
        // `aria-valuetext` diz o valor, mas não diz do que ele é. Sem
        // `aria-label` o leitor de tela anuncia "passo 1 de 6" sem
        // contexto nenhum.
        aria-label="Progresso do orçamento"
        aria-valuemin={1}
        aria-valuemax={TOTAL_PASSOS}
        aria-valuenow={passo + 1}
        aria-valuetext={`Passo ${passo + 1} de ${TOTAL_PASSOS}`}
        className="mt-3 h-1 w-full bg-noite/12"
      >
        <div
          className="h-full bg-marca transition-[width] duration-300 ease-obra"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </div>
  );
}
