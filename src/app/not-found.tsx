import type { Metadata } from "next";
import { CromoSite } from "@/components/layout/CromoSite";
import { PaginaNaoEncontrada } from "@/components/PaginaNaoEncontrada";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 de endereços que não casam com rota nenhuma. Como fica na raiz do
 * `app/`, não recebe o layout do grupo `(site)` — por isso a moldura é
 * aplicada aqui à mão.
 */
export default function NaoEncontradaGlobal() {
  return (
    <CromoSite>
      <PaginaNaoEncontrada />
    </CromoSite>
  );
}
