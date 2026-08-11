import type { Metadata } from "next";
import { PaginaNaoEncontrada } from "@/components/PaginaNaoEncontrada";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NaoEncontrada() {
  return <PaginaNaoEncontrada />;
}
