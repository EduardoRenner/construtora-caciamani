/**
 * Gera as capas das obras DEMONSTRATIVAS (`src/content/demo.ts`).
 *
 * Por que desenho e não foto: não existe foto dessas obras — elas não
 * existem. Usar banco de imagem ou foto de terceiro atribuiria a
 * terceiros uma obra da Caciamani, que é exatamente o que o projeto
 * inteiro evita. Então cada capa é um desenho de elevação, no mesmo
 * traço técnico do hero, com a palavra ILUSTRAÇÃO impressa no próprio
 * desenho — viaja com o arquivo, não dá para perder no caminho.
 *
 * Rodar:  node scripts/gerar-capas-demo.mjs
 * Saída:  public/obras/demo/*.webp  (4:3, 1600×1200) + os .svg de origem
 *
 * Só precisa rodar de novo se um desenho mudar. O `sharp` já vem com o
 * Next; nenhuma dependência nova entra no projeto por causa disto.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(RAIZ, "public", "obras", "demo");

const L = 1600;
const A = 1200;
/** Linha do terreno. Tudo se apoia nela, e a ampliação escala em torno dela. */
const CHAO = 940;
/** Centro horizontal do desenho — o ponto fixo da ampliação. */
const EIXO = 800;

const COR = {
  fundo: "#0A1826",
  fundo2: "#0E2233",
  grade: "#16293C",
  traco: "#35C2E3",
  marca: "#F2A81D",
  vidro: "#C2D4E6",
};

const FONTE = "Segoe UI, Tahoma, Arial, Helvetica, sans-serif";

/** Grade de caderno técnico, bem discreta. */
function grade() {
  const linhas = [];
  for (let x = 0; x <= L; x += 50) {
    linhas.push(`<line x1="${x}" y1="0" x2="${x}" y2="${A}" />`);
  }
  for (let y = 0; y <= A; y += 50) {
    linhas.push(`<line x1="0" y1="${y}" x2="${L}" y2="${y}" />`);
  }
  return `<g stroke="${COR.grade}" stroke-width="1">${linhas.join("")}</g>`;
}

/**
 * Linha de cota com os dois ticks — o elemento assinatura do site.
 * Fica FORA do grupo ampliado: a espessura do traço e o corpo da letra
 * não podem crescer junto com o desenho.
 */
function cota(x1, x2, y, rotulo) {
  return `
    <g stroke="${COR.marca}" stroke-width="3" fill="none">
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
      <line x1="${x1}" y1="${y - 14}" x2="${x1}" y2="${y + 14}" />
      <line x1="${x2}" y1="${y - 14}" x2="${x2}" y2="${y + 14}" />
    </g>
    <text x="${(x1 + x2) / 2}" y="${y - 26}" fill="${COR.marca}"
          font-family="${FONTE}" font-size="30" letter-spacing="3"
          text-anchor="middle">${rotulo}</text>`;
}

/** Selo que impede qualquer confusão entre desenho e obra construída. */
function selo() {
  return `
    <g>
      <rect x="72" y="${A - 128}" width="640" height="62" fill="${COR.fundo}"
            fill-opacity="0.78" stroke="${COR.marca}" stroke-opacity="0.55" stroke-width="2" />
      <text x="100" y="${A - 87}" fill="${COR.marca}" font-family="${FONTE}"
            font-size="27" letter-spacing="5">ILUSTRAÇÃO · OBRA DEMONSTRATIVA</text>
    </g>`;
}

function chao() {
  return `
    <line x1="0" y1="${CHAO}" x2="${L}" y2="${CHAO}"
          stroke="${COR.vidro}" stroke-opacity="0.5" stroke-width="4" />
    <g stroke="${COR.vidro}" stroke-opacity="0.22" stroke-width="3">
      ${Array.from({ length: 41 }, (_, i) => {
        const x = 20 + i * 40;
        return `<line x1="${x}" y1="${CHAO}" x2="${x - 26}" y2="${CHAO + 26}" />`;
      }).join("")}
    </g>`;
}

/** Fileira de janelas igualmente espaçadas. */
function janelas(x, y, largura, altura, quantidade, folga = 26) {
  const passo = (largura + folga) / quantidade;
  return Array.from({ length: quantidade }, (_, i) => {
    const jx = x + i * passo;
    return `<rect x="${jx}" y="${y}" width="${passo - folga}" height="${altura}"
                  fill="${COR.traco}" fill-opacity="0.16"
                  stroke="${COR.traco}" stroke-width="3" />`;
  }).join("");
}

/**
 * Monta o arquivo. O corpo do desenho é ampliado em torno do pé direito
 * (EIXO, CHAO) para ocupar o quadro — cada elevação foi desenhada na
 * escala que era cômoda, e o `escala` acerta o enquadramento sem
 * remexer em coordenada nenhuma.
 */
function documento({ corpo, escala, cotaDe, cotaAte, cotaRotulo }) {
  const projetar = (x) => Math.round(EIXO + (x - EIXO) * escala);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
    <defs>
      <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${COR.fundo2}" />
        <stop offset="1" stop-color="${COR.fundo}" />
      </linearGradient>
    </defs>
    <rect width="${L}" height="${A}" fill="url(#ceu)" />
    ${grade()}
    <g transform="translate(${EIXO} ${CHAO}) scale(${escala}) translate(${-EIXO} ${-CHAO})">
      ${corpo}
    </g>
    ${chao()}
    ${cota(projetar(cotaDe), projetar(cotaAte), 1032, cotaRotulo)}
    ${selo()}
  </svg>`;
}

const TRACO = `fill="none" stroke="${COR.traco}" stroke-width="5" stroke-linejoin="round"`;
const TRACO_FINO = `fill="none" stroke="${COR.traco}" stroke-width="3" stroke-opacity="0.75"`;

// ---------------------------------------------------------------------
// Os cinco desenhos
// ---------------------------------------------------------------------

const desenhos = {
  /** Casa térrea com telhado embutido em platibanda e varanda avançada. */
  "casa-terrea": {
    escala: 1.5,
    cotaDe: 356,
    cotaAte: 1354,
    cotaRotulo: "PROJETO · ELEVAÇÃO FRONTAL",
    corpo: `
      <g ${TRACO}>
        <path d="M380 940 V620 H1130 V940" />
        <path d="M356 620 H1154 V572 H356 Z" />
        <path d="M1130 830 H1330 V940" />
        <path d="M1306 830 H1354 V806 H1306" />
        <line x1="1330" y1="830" x2="1330" y2="940" />
      </g>
      ${janelas(430, 690, 300, 130, 2)}
      ${janelas(830, 690, 240, 130, 2)}
      <rect x="1170" y="740" width="110" height="200" fill="${COR.traco}" fill-opacity="0.2"
            stroke="${COR.traco}" stroke-width="4" />
      <g ${TRACO_FINO}>
        <line x1="380" y1="806" x2="1130" y2="806" />
      </g>`,
  },

  /** Duas unidades espelhadas com volume central em pedra. */
  germinada: {
    escala: 1.5,
    cotaDe: 276,
    cotaAte: 1324,
    cotaRotulo: "DUAS UNIDADES ESPELHADAS",
    corpo: `
      <g ${TRACO}>
        <path d="M300 940 V600 H760 V940" />
        <path d="M276 600 H784 V556 H276 Z" />
        <path d="M840 940 V600 H1300 V940" />
        <path d="M816 600 H1324 V556 H816 Z" />
        <path d="M760 940 V520 H840 V940" />
      </g>
      <g stroke="${COR.marca}" stroke-width="3" fill="${COR.marca}" fill-opacity="0.14">
        <rect x="770" y="534" width="60" height="406" />
        <line x1="770" y1="636" x2="830" y2="636" />
        <line x1="770" y1="738" x2="830" y2="738" />
        <line x1="770" y1="840" x2="830" y2="840" />
      </g>
      ${janelas(340, 680, 260, 120, 2)}
      ${janelas(1000, 680, 260, 120, 2)}
      <rect x="650" y="780" width="90" height="160" fill="${COR.traco}" fill-opacity="0.2"
            stroke="${COR.traco}" stroke-width="4" />
      <rect x="860" y="780" width="90" height="160" fill="${COR.traco}" fill-opacity="0.2"
            stroke="${COR.traco}" stroke-width="4" />
      <g ${TRACO_FINO}>
        <line x1="300" y1="880" x2="760" y2="880" />
        <line x1="840" y1="880" x2="1300" y2="880" />
      </g>`,
  },

  /** Edifício de quatro pavimentos com sacadas alinhadas. */
  predio: {
    escala: 1.15,
    cotaDe: 406,
    cotaAte: 1194,
    cotaRotulo: "QUATRO PAVIMENTOS · DOZE UNIDADES",
    corpo: `
      <g ${TRACO}>
        <path d="M430 940 V300 H1170 V940" />
        <path d="M406 300 H1194 V250 H406 Z" />
        <line x1="430" y1="820" x2="1170" y2="820" />
        <line x1="430" y1="690" x2="1170" y2="690" />
        <line x1="430" y1="560" x2="1170" y2="560" />
        <line x1="430" y1="430" x2="1170" y2="430" />
      </g>
      <g fill="${COR.marca}" fill-opacity="0.16" stroke="${COR.marca}" stroke-width="3">
        <rect x="470" y="336" width="290" height="76" />
        <rect x="840" y="336" width="290" height="76" />
        <rect x="470" y="466" width="290" height="76" />
        <rect x="840" y="466" width="290" height="76" />
        <rect x="470" y="596" width="290" height="76" />
        <rect x="840" y="596" width="290" height="76" />
      </g>
      ${janelas(470, 716, 660, 86, 4)}
      <rect x="500" y="836" width="380" height="104" fill="${COR.traco}" fill-opacity="0.18"
            stroke="${COR.traco}" stroke-width="4" />
      <rect x="960" y="836" width="120" height="104" fill="${COR.traco}" fill-opacity="0.24"
            stroke="${COR.traco}" stroke-width="4" />`,
  },

  /** Casa existente em traço tracejado, ampliação nova em traço cheio. */
  reforma: {
    escala: 1.35,
    cotaDe: 900,
    cotaAte: 1334,
    cotaRotulo: "AMPLIAÇÃO EXECUTADA",
    corpo: `
      <g fill="none" stroke="${COR.vidro}" stroke-opacity="0.55" stroke-width="4"
         stroke-dasharray="16 12">
        <path d="M330 940 V660 H900 V940" />
        <path d="M306 660 L615 540 L924 660" />
      </g>
      ${janelas(380, 720, 260, 120, 2)}
      <rect x="700" y="770" width="100" height="170" fill="${COR.traco}" fill-opacity="0.16"
            stroke="${COR.traco}" stroke-width="3" stroke-opacity="0.6" />
      <g ${TRACO}>
        <path d="M900 940 V700 H1310 V940" />
        <path d="M876 700 H1334 V656 H876 Z" />
      </g>
      ${janelas(950, 760, 300, 120, 2)}
      <line x1="900" y1="656" x2="900" y2="940" stroke="${COR.marca}" stroke-width="3" />
      <text x="360" y="900" fill="${COR.vidro}" fill-opacity="0.7" font-family="${FONTE}"
            font-size="26" letter-spacing="3">EXISTENTE</text>`,
  },

  /** Sobrado: dois pavimentos, sacada e garagem no nível da rua. */
  sobrado: {
    escala: 1.35,
    cotaDe: 416,
    cotaAte: 1214,
    cotaRotulo: "SOBRADO · DOIS PAVIMENTOS",
    corpo: `
      <g ${TRACO}>
        <path d="M470 940 V800 H1160 V940" />
        <path d="M440 800 V520 H1190 V800" />
        <path d="M416 520 H1214 V474 H416 Z" />
        <line x1="440" y1="800" x2="1190" y2="800" />
      </g>
      ${janelas(490, 580, 340, 130, 2)}
      ${janelas(520, 838, 280, 76, 2)}
      <g fill="${COR.marca}" fill-opacity="0.16" stroke="${COR.marca}" stroke-width="3">
        <rect x="890" y="576" width="280" height="150" />
      </g>
      <rect x="960" y="826" width="110" height="114" fill="${COR.traco}" fill-opacity="0.22"
            stroke="${COR.traco}" stroke-width="4" />`,
  },
};

// ---------------------------------------------------------------------

await mkdir(DESTINO, { recursive: true });

for (const [nome, desenho] of Object.entries(desenhos)) {
  const svg = documento(desenho);
  await writeFile(join(DESTINO, `${nome}.svg`), svg, "utf8");

  const arquivo = join(DESTINO, `${nome}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(arquivo);
  console.log("gerado:", arquivo);
}
