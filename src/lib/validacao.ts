import { z } from "zod";
import {
  faixaArea,
  padroesAcabamento,
  prazosInicio,
  situacoesTerreno,
  tiposConstrucao,
} from "@/config/orcamento";

/**
 * Schemas compartilhados entre o formulário (cliente) e a Server Action
 * (servidor). O mesmo arquivo nos dois lados garante que a validação do
 * servidor não fique atrás da do cliente — que é a que um atacante
 * simplesmente ignora.
 */

const idsTipo = tiposConstrucao.map((t) => t.id) as [string, ...string[]];
const idsPadrao = padroesAcabamento.map((p) => p.id) as [string, ...string[]];
const idsTerreno = situacoesTerreno.map((s) => s.id) as [string, ...string[]];
const idsPrazo = prazosInicio.map((p) => p.id) as [string, ...string[]];

/** Aceita (49) 99192-7673, 49991927673 etc. Exige DDD. */
const telefone = z
  .string()
  .min(1, "Informe seu WhatsApp")
  .refine(
    (valor) => {
      const digitos = valor.replace(/\D/g, "");
      return digitos.length === 10 || digitos.length === 11;
    },
    { message: "Telefone incompleto — informe o DDD e o número" },
  );

const emailOpcional = z
  .union([z.email("E-mail inválido"), z.literal("")])
  .optional();

/**
 * Campo-armadilha. Fica escondido no formulário; pessoa nenhuma preenche,
 * robô de spam preenche quase sempre. Se vier com conteúdo, o envio é
 * descartado em silêncio — sem CAPTCHA.
 */
const armadilha = z.string().max(0).optional();

export const schemaOrcamento = z.object({
  // Sem a mensagem explícita, um grupo de rádio não escolhido mostra o
  // texto padrão do Zod ("Invalid input") — em inglês, na cara do usuário.
  tipo: z.enum(idsTipo, { error: "Escolha o tipo de obra" }),
  areaM2: z
    .number()
    .min(faixaArea.minimo, `A área mínima é ${faixaArea.minimo} m²`)
    .max(faixaArea.maximo, `Para mais de ${faixaArea.maximo} m², fale direto com a gente`),
  padrao: z.enum(idsPadrao, { error: "Escolha o padrão de acabamento" }),
  terreno: z.enum(idsTerreno, { error: "Diga se já tem o terreno" }),
  cidade: z.string().min(2, "Informe a cidade"),
  prazoInicio: z.enum(idsPrazo, { error: "Escolha quando pretende começar" }),
  nome: z.string().min(2, "Informe seu nome"),
  telefone,
  email: emailOpcional,
  site: armadilha,
});

export const schemaContato = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  telefone,
  email: emailOpcional,
  cidade: z.string().optional(),
  mensagem: z.string().min(10, "Conte um pouco mais — pelo menos 10 caracteres"),
  /** Preenchido quando o contato parte da página de uma obra. */
  obraSlug: z.string().optional(),
  site: armadilha,
});

export type DadosOrcamento = z.infer<typeof schemaOrcamento>;
export type DadosContato = z.infer<typeof schemaContato>;

/** Campos de cada passo do simulador, para validar um passo por vez. */
export const camposPorPasso: Array<Array<keyof DadosOrcamento>> = [
  ["tipo"],
  ["areaM2"],
  ["padrao"],
  ["terreno", "cidade"],
  ["prazoInicio"],
  ["nome", "telefone", "email"],
];
