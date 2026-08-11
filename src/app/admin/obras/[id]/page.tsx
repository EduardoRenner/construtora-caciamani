import { notFound } from "next/navigation";
import { FormularioObra } from "@/components/admin/FormularioObra";
import { obterObraAdmin } from "@/lib/dadosAdmin";

export default async function EditarObra({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "nova") {
    return (
      <div>
        <h1 className="titulo text-3xl md:text-4xl">Cadastrar obra</h1>
        <p className="prosa mt-3 text-concreto">
          Preencha o que você já tem. Dá para salvar como rascunho e completar
          depois — enquanto não publicar, ninguém de fora vê.
        </p>
        <div className="mt-8">
          <FormularioObra />
        </div>
      </div>
    );
  }

  const obra = await obterObraAdmin(id);
  if (!obra) notFound();

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">{obra.titulo}</h1>
      <div className="mt-8">
        <FormularioObra obra={obra} />
      </div>
    </div>
  );
}
