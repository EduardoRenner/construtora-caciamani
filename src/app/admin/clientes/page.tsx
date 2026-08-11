import { QuadroClientes } from "@/components/admin/QuadroClientes";
import { listarLeads } from "@/lib/dadosAdmin";

export default async function ClientesAdmin() {
  const leads = await listarLeads();

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">Clientes</h1>
      <p className="prosa mt-3 text-concreto">
        Arraste um cliente entre as colunas para mudar o estágio, ou use o
        menu no card. Clique no nome para ver o histórico e as tarefas.
      </p>

      <div className="mt-8">
        {leads.length === 0 ? (
          <p className="border border-dashed border-noite/25 bg-cal p-8 text-center text-concreto">
            Nenhum cliente ainda. Assim que alguém preencher o simulador ou o
            formulário de contato, aparece aqui como &ldquo;Novo&rdquo;.
          </p>
        ) : (
          <QuadroClientes leads={leads} />
        )}
      </div>
    </div>
  );
}
