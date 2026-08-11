import { ListaLeads } from "@/components/admin/ListaLeads";
import { listarLeads } from "@/lib/dadosAdmin";

export default async function LeadsAdmin() {
  const leads = await listarLeads();

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">Contatos recebidos</h1>
      <p className="prosa mt-3 text-concreto">
        Todo mundo que preencheu alguma coisa no site aparece aqui — inclusive
        quem não chegou a abrir o WhatsApp.
      </p>

      <div className="mt-10">
        {leads.length === 0 ? (
          <p className="border border-dashed border-noite/25 bg-cal p-8 text-center text-concreto">
            Nenhum contato ainda.
          </p>
        ) : (
          <ListaLeads leads={leads} />
        )}
      </div>
    </div>
  );
}
