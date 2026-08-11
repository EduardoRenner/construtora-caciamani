/**
 * Animação numérica mínima, em requestAnimationFrame.
 *
 * Existe em vez de uma lib de tween porque as duas animações que o site
 * tem (a contagem das estatísticas e o micro-movimento do antes/depois)
 * animam um número só. Trazer uma dependência para isso seria peso sem
 * contrapartida.
 */

export function prefereMenosMovimento(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function suavizar(t: number): number {
  // easeInOutCubic
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Interpola entre uma sequência de quadros-chave.
 * Devolve a função de cancelamento — sempre chamar no cleanup do efeito.
 */
export function animarQuadros({
  quadros,
  duracao,
  aoAtualizar,
  aoTerminar,
}: {
  quadros: number[];
  /** Em milissegundos. */
  duracao: number;
  aoAtualizar: (valor: number) => void;
  aoTerminar?: () => void;
}): () => void {
  if (quadros.length === 0) return () => {};
  if (quadros.length === 1) {
    aoAtualizar(quadros[0]);
    aoTerminar?.();
    return () => {};
  }

  let id = 0;
  let cancelado = false;
  const inicio = performance.now();
  const segmentos = quadros.length - 1;

  const passo = (agora: number) => {
    if (cancelado) return;

    const bruto = Math.min(1, (agora - inicio) / duracao);
    const progresso = suavizar(bruto) * segmentos;
    const indice = Math.min(segmentos - 1, Math.floor(progresso));
    const dentro = progresso - indice;

    aoAtualizar(quadros[indice] + (quadros[indice + 1] - quadros[indice]) * dentro);

    if (bruto < 1) {
      id = requestAnimationFrame(passo);
    } else {
      aoTerminar?.();
    }
  };

  id = requestAnimationFrame(passo);

  return () => {
    cancelado = true;
    cancelAnimationFrame(id);
  };
}
