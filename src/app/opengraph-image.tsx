import { ImageResponse } from "next/og";
import { empresa } from "@/content/empresa";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${empresa.nome} — construção em ${empresa.cidadeSede}/${empresa.uf}`;

/**
 * Imagem que aparece quando alguém manda o link do site no WhatsApp — o
 * que, para este público, é o principal canal de compartilhamento.
 *
 * É tipográfica, sem foto: não usamos banco de imagem, e as fotos reais
 * das obras ainda não chegaram. Quando o vetor da logo e as fotos
 * existirem, vale refazer. Ver PENDENCIAS.md → 1.5.
 */
export default function ImagemOpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#E9EAE7",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 4, background: "#F2B705" }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.18em",
              color: "#5A6067",
              textTransform: "uppercase",
            }}
          >
            {/* String única: o Satori exige display:flex em qualquer div
                com mais de um filho, e cada interpolação conta como um. */}
            {`${empresa.cidadeSede}/${empresa.uf} · ${empresa.regiao}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "#16212E",
            textTransform: "uppercase",
            maxWidth: 900,
          }}
        >
          {`Do traço à obra, em ${empresa.cidadeSede}.`}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(22,33,46,0.2)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#16212E",
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>
              {empresa.nomeCurto.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.24em",
                color: "#5A6067",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {empresa.assinatura}
            </div>
          </div>

          <div style={{ fontSize: 26, color: "#5A6067" }}>
            {empresa.telefones.principal.exibicao}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
