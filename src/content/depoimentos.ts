import type { Depoimento } from "./tipos";

/**
 * Depoimentos de clientes.
 *
 * Vazio de propósito. Depoimento inventado em site de construtora é o
 * pior tipo de mentira: é fácil de checar em cidade pequena, e quem
 * descobre não volta.
 *
 * Cada depoimento precisa de nome real, bairro/cidade, o texto do
 * próprio cliente e autorização de uso. De preferência com a foto da
 * obra dele. Ver PENDENCIAS.md → 2.4.
 */
export const depoimentos: Depoimento[] = [];

export const depoimentosPublicaveis = depoimentos.filter((d) => d.autorizado);
