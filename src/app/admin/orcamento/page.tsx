import { EditorOrcamento } from "@/components/admin/EditorOrcamento";
import { obterCoeficientes } from "@/lib/conteudo";

export default async function OrcamentoAdmin() {
  const coeficientes = await obterCoeficientes();

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">Valores do orçamento</h1>
      <p className="prosa mt-3 text-concreto">
        É daqui que sai a estimativa que o cliente vê no simulador. Enquanto
        estes campos estiverem vazios, o site diz honestamente que ainda não
        calcula — em vez de mostrar um número chutado.
      </p>

      <div className="mt-10">
        <EditorOrcamento inicial={coeficientes} />
      </div>
    </div>
  );
}
