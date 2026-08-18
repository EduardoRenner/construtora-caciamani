import {
  padroesAcabamento,
  prazosInicio,
  situacoesTerreno,
  tiposConstrucao,
  type ResultadoOrcamento,
} from "@/config/orcamento";
import type { DadosContato, DadosOrcamento } from "@/lib/validacao";
import { numeroBR, reaisBR } from "@/lib/utils";

const rotulo = (
  lista: Array<{ id: string; rotulo: string }>,
  id: string,
): string => lista.find((item) => item.id === id)?.rotulo ?? id;

/**
 * Monta a mensagem que abre no WhatsApp já escrita.
 *
 * O objetivo é que o Carlinhos leia tudo sem precisar perguntar de novo:
 * chega tipo, área, padrão, terreno, prazo e contato numa mensagem só.
 * O `*` é a negrito do WhatsApp.
 */
export function mensagemOrcamento(
  dados: DadosOrcamento,
  resultado: ResultadoOrcamento,
): string {
  const linhas = [
    "*Orçamento pelo site — Construtora Caciamani*",
    "",
    `*Tipo de obra:* ${rotulo(tiposConstrucao, dados.tipo)}`,
    `*Área aproximada:* ${numeroBR(dados.areaM2)} m²`,
    `*Padrão de acabamento:* ${rotulo(padroesAcabamento, dados.padrao)}`,
    `*Terreno:* ${rotulo(situacoesTerreno, dados.terreno)} — ${dados.cidade}`,
    `*Pretende começar:* ${rotulo(prazosInicio, dados.prazoInicio)}`,
    "",
  ];

  if (resultado.calculavel) {
    linhas.push(
      `*Estimativa do site:* ${reaisBR(resultado.minimo)} a ${reaisBR(resultado.maximo)}`,
      `*Prazo estimado:* ${resultado.prazoMinimoMeses} a ${resultado.prazoMaximoMeses} meses`,
      "",
    );
  } else {
    linhas.push(
      "_(O simulador ainda não está calibrado, então não gerou estimativa.)_",
      "",
    );
  }

  linhas.push(
    `*Nome:* ${dados.nome}`,
    `*WhatsApp:* ${dados.telefone}`,
  );
  if (dados.email) linhas.push(`*E-mail:* ${dados.email}`);

  return linhas.join("\n");
}

export function mensagemContato(dados: DadosContato, tituloObra?: string): string {
  const linhas = [
    tituloObra
      ? `*Interesse na obra “${tituloObra}” — site da Caciamani*`
      : "*Contato pelo site — Construtora Caciamani*",
    "",
    `*Nome:* ${dados.nome}`,
    `*WhatsApp:* ${dados.telefone}`,
  ];
  if (dados.email) linhas.push(`*E-mail:* ${dados.email}`);
  if (dados.cidade) linhas.push(`*Cidade:* ${dados.cidade}`);
  linhas.push("", dados.mensagem);

  return linhas.join("\n");
}
