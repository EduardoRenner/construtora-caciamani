"use client";

import { useEffect } from "react";

/**
 * Última rede de segurança: dispara só se o PRÓPRIO layout raiz (fontes,
 * tema, `<html>`) falhar ao renderizar — algo que `(site)/error.tsx` e
 * `admin/error.tsx` não alcançam, porque eles pressupõem que o layout
 * acima deles funcionou.
 *
 * Por isso este arquivo substitui o `<html>`/`<body>` inteiros e não usa
 * nenhum componente do site: cor em hexadecimal direto, sem depender das
 * variáveis CSS do `globals.css` nem das fontes carregadas pelo layout
 * que acabou de falhar. É o único lugar do projeto onde isso é correto.
 */
export default function ErroGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[erro-global]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#0a1826",
          color: "#e8eff6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
            O site travou
          </h1>
          <p style={{ marginTop: "1rem", color: "#a6b8cc", lineHeight: 1.5 }}>
            Não foi nada que você fez. Tenta recarregar a página — se
            continuar assim, é um problema do nosso lado.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              background: "#f2a81d",
              color: "#16212e",
              border: 0,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
