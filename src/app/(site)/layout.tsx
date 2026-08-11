import { CromoSite } from "@/components/layout/CromoSite";
import { DadosEstruturados } from "@/components/DadosEstruturados";
import { obterCidades } from "@/lib/conteudo";

export default async function LayoutDoSite({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cidades = await obterCidades();

  return (
    <>
      <DadosEstruturados cidades={cidades} />
      <CromoSite>{children}</CromoSite>
    </>
  );
}
