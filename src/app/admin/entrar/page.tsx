import { Marca } from "@/components/layout/Marca";
import { FormularioEntrar } from "@/components/admin/FormularioEntrar";
import { supabaseConfigurado } from "@/lib/supabase/publico";

export default function EntrarPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cal-2 px-4 py-16">
      <div className="w-full max-w-sm">
        <Marca />

        <h1 className="titulo mt-10 text-3xl">Entrar no painel</h1>
        <p className="prosa mt-3 text-sm text-concreto">
          Esta área é só da Caciamani. Não existe cadastro aberto — o acesso é
          criado pelo administrador.
        </p>

        {supabaseConfigurado() ? (
          <FormularioEntrar />
        ) : (
          <div className="mt-8 border border-dashed border-oxido/60 bg-oxido/6 p-5 text-sm text-oxido">
            <p className="font-medium">O painel ainda não está ligado.</p>
            <p className="mt-2">
              Falta criar o projeto no Supabase, rodar os arquivos de
              <code className="mx-1">supabase/migracoes/</code>e preencher o
              <code className="mx-1">.env.local</code>. Está no PENDENCIAS.md,
              item 1.4.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
