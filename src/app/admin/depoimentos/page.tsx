import { EditorDepoimentos } from "@/components/admin/EditorDepoimentos";
import { listarDepoimentosAdmin } from "@/lib/dadosAdmin";

export default async function DepoimentosAdmin() {
  const depoimentos = await listarDepoimentosAdmin();

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">Depoimentos</h1>
      <p className="prosa mt-3 text-concreto">
        Em cidade pequena, é o vizinho que vende. Um depoimento real com nome e
        bairro vale mais que qualquer texto que a gente escreva.
      </p>

      <div className="mt-10">
        <EditorDepoimentos depoimentos={depoimentos} />
      </div>
    </div>
  );
}
