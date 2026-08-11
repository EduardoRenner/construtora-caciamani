import { EditorNumeros } from "@/components/admin/EditorNumeros";
import { obterCidades, obterEstatisticas } from "@/lib/conteudo";

export default async function NumerosAdmin() {
  const [estatisticas, cidades] = await Promise.all([
    obterEstatisticas(),
    obterCidades(),
  ]);

  return (
    <div>
      <h1 className="titulo text-3xl md:text-4xl">Números da empresa</h1>
      <p className="prosa mt-3 text-concreto">
        São os quatro números que aparecem logo abaixo da primeira imagem do
        site, e a lista de cidades atendidas.
      </p>

      <div className="mt-10">
        <EditorNumeros estatisticas={estatisticas} cidades={cidades} />
      </div>
    </div>
  );
}
