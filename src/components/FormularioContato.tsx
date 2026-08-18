"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registrarLeadContato } from "@/acoes/leads";
import { Pendente } from "@/components/Pendente";
import {
  CampoArmadilha,
  CampoTexto,
  CampoTextoLongo,
} from "@/components/orcamento/CampoTexto";
import { Botao, BotaoLink } from "@/components/ui/Botao";
import { IconeWhatsApp } from "@/components/ui/Icones";
import { mensagemContato } from "@/lib/mensagens";
import { linkWhatsApp } from "@/lib/site";
import { schemaContato, type DadosContato } from "@/lib/validacao";

/**
 * Formulário de contato. Usado na página de contato e, na versão curta,
 * nas páginas de obra ("quero algo parecido com isto").
 *
 * Como no simulador, grava o lead antes de oferecer o WhatsApp: se a
 * pessoa não clicar, o contato não se perde.
 */
export function FormularioContato({
  obraSlug,
  tituloObra,
  mensagemInicial,
}: {
  obraSlug?: string;
  tituloObra?: string;
  mensagemInicial?: string;
}) {
  const [enviado, setEnviado] = useState<{ mensagem: string; gravado: boolean } | null>(
    null,
  );
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DadosContato>({
    resolver: zodResolver(schemaContato),
    mode: "onTouched",
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      cidade: "",
      mensagem: mensagemInicial ?? "",
      obraSlug,
      site: "",
    },
  });

  const aoEnviar = handleSubmit(async (dados) => {
    setErroEnvio(null);
    const envio = await registrarLeadContato(dados);

    if (!envio.ok) {
      setErroEnvio(envio.erro ?? "Não foi possível enviar. Tente novamente.");
      return;
    }

    setEnviado({
      mensagem: mensagemContato(dados, tituloObra),
      gravado: envio.gravado,
    });
  });

  if (enviado) {
    return (
      <div
        role="status"
        className="superficie-clara border border-noite/15 bg-cal p-6 text-noite md:p-8"
      >
        <h3 className="titulo text-xl">Recebemos seu contato</h3>
        <p className="prosa mt-3 text-base text-concreto">
          O Carlos responde pelo WhatsApp. Se quiser adiantar, é só abrir a
          conversa — a mensagem já vai escrita.
        </p>
        <BotaoLink
          href={linkWhatsApp(enviado.mensagem)}
          externo
          className="mt-6 w-full sm:w-auto"
        >
          <IconeWhatsApp className="size-5" />
          Abrir no WhatsApp
        </BotaoLink>

        {!enviado.gravado ? (
          <p className="mt-5">
            <Pendente>
              Supabase não configurado — o lead não foi gravado
            </Pendente>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    // `superficie-clara` + fundo próprio: o formulário também aparece
    // dentro de seções escuras (páginas de obra), e sem isto rótulo,
    // dica e anel de foco herdariam os tons de fundo claro no escuro.
    <form
      onSubmit={aoEnviar}
      noValidate
      className="superficie-clara relative border border-noite/15 bg-cal p-6 text-noite md:p-8"
    >
      <CampoArmadilha registro={register("site")} />
      <input type="hidden" {...register("obraSlug")} />

      <div className="grid gap-6 sm:grid-cols-2">
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
        />
        <CampoTexto
          rotulo="Cidade"
          opcional
          registro={register("cidade")}
          erro={errors.cidade?.message}
          autoComplete="address-level2"
        />
      </div>

      <div className="mt-6">
        <CampoTextoLongo
          rotulo="O que você quer construir"
          registro={register("mensagem")}
          erro={errors.mensagem?.message}
          dica="Terreno, tamanho aproximado, prazo — o que você já souber ajuda."
        />
      </div>

      {erroEnvio ? (
        <p role="alert" className="mt-6 border border-oxido/50 px-4 py-3 text-sm text-oxido">
          {erroEnvio}
        </p>
      ) : null}

      <Botao type="submit" tamanho="lg" disabled={isSubmitting} className="mt-8 w-full sm:w-auto">
        {isSubmitting ? "Enviando…" : "Enviar"}
      </Botao>
    </form>
  );
}
