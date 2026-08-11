import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Ícone do navegador.
 *
 * PROVISÓRIO. A Caciamani tem monograma próprio, mas só existe em raster
 * no material público — sem o vetor não dá para gerar um ícone nítido.
 * Este aqui é tipográfico de propósito: não inventa um símbolo novo para
 * concorrer com a marca real. Ver PENDENCIAS.md → 1.5.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16212E",
          color: "#F2B705",
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        C
      </div>
    ),
    size,
  );
}
