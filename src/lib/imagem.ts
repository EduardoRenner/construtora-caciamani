/**
 * Otimização de imagem no NAVEGADOR, antes de enviar.
 *
 * As fotos vêm do celular do Carlos com 6 MB e 4000 px de largura. Fazer
 * isso no cliente resolve três problemas de uma vez:
 *   1. sobe ~200 kB em vez de 6 MB — decisivo no 4G do canteiro de obra;
 *   2. não gasta CPU de servidor nem exige biblioteca nativa no deploy;
 *   3. o Carlos não espera minutos por foto.
 *
 * Saída em WebP: é o formato com melhor compressão que o `canvas` sabe
 * gerar em todos os navegadores atuais. AVIF comprime mais, mas
 * `toBlob('image/avif')` ainda não é confiável no navegador — quem
 * converte para AVIF é o `next/image`, na entrega.
 */

export interface ImagemOtimizada {
  arquivo: Blob;
  largura: number;
  altura: number;
}

const QUALIDADE = 0.82;

export const TAMANHOS = {
  /** Foto principal: suficiente para tela cheia em telas grandes. */
  grande: 2000,
  /** Miniatura para as listas do painel e as grades do site. */
  miniatura: 600,
} as const;

async function redimensionar(
  origem: ImageBitmap,
  larguraMaxima: number,
): Promise<ImagemOtimizada> {
  const escala = Math.min(1, larguraMaxima / origem.width);
  const largura = Math.round(origem.width * escala);
  const altura = Math.round(origem.height * escala);

  const tela = document.createElement("canvas");
  tela.width = largura;
  tela.height = altura;

  const contexto = tela.getContext("2d");
  if (!contexto) throw new Error("Não foi possível processar a imagem.");

  contexto.imageSmoothingQuality = "high";
  contexto.drawImage(origem, 0, 0, largura, altura);

  const arquivo = await new Promise<Blob | null>((resolver) =>
    tela.toBlob(resolver, "image/webp", QUALIDADE),
  );

  if (!arquivo) throw new Error("Não foi possível converter a imagem.");

  return { arquivo, largura, altura };
}

/**
 * Devolve a versão grande e a miniatura de uma foto.
 *
 * O `imageOrientation: "from-image"` não é detalhe: sem ele, foto tirada
 * com o celular deitado sobe girada, porque a orientação vive no EXIF e
 * o canvas ignora o EXIF por padrão.
 */
export async function prepararFoto(arquivo: File): Promise<{
  grande: ImagemOtimizada;
  miniatura: ImagemOtimizada;
}> {
  const bitmap = await createImageBitmap(arquivo, {
    imageOrientation: "from-image",
  });

  try {
    const [grande, miniatura] = await Promise.all([
      redimensionar(bitmap, TAMANHOS.grande),
      redimensionar(bitmap, TAMANHOS.miniatura),
    ]);
    return { grande, miniatura };
  } finally {
    bitmap.close();
  }
}

/** Proporção largura/altura, arredondada — usada para comparar enquadramentos. */
export function proporcao(imagem: ImagemOtimizada): number {
  return Number((imagem.largura / imagem.altura).toFixed(3));
}

/**
 * O comparador antes/depois só funciona se as duas fotos tiverem o mesmo
 * enquadramento. Esta checagem avisa o Carlos no momento do envio, que é
 * quando ainda dá para tirar a foto de novo — não depois, no site.
 */
export function enquadramentosBatem(
  antes: ImagemOtimizada,
  depois: ImagemOtimizada,
  tolerancia = 0.02,
): boolean {
  return Math.abs(proporcao(antes) - proporcao(depois)) <= tolerancia;
}

export function nomeUnico(original: string, sufixo: string): string {
  const limpo = original
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 40);

  return `${Date.now()}-${limpo || "foto"}-${sufixo}.webp`;
}
