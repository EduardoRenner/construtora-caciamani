import { empresa } from "@/content/empresa";

/**
 * Aviso de lead novo por e-mail.
 *
 * Lead de construção esfria em horas — um que fica três dias sem
 * resposta está perdido. Este é o alerta que evita isso.
 *
 * É opcional: sem `RESEND_API_KEY` e `EMAIL_AVISO_LEAD` configurados,
 * não faz nada e não quebra. E nunca derruba o envio do formulário —
 * falhar em avisar é ruim, mas perder o lead é pior.
 *
 * Por que e-mail e não WhatsApp: a API oficial da Meta tem custo por
 * mensagem, exige modelo aprovado antes e conta comercial verificada.
 * Ver PENDENCIAS.md → 5.4, é decisão do cliente.
 */
export async function avisarLeadNovo(resumo: {
  origem: string;
  nome: string;
  telefone: string;
  cidade?: string | null;
  detalhe?: string | null;
}): Promise<void> {
  const chave = process.env.RESEND_API_KEY;
  const destino = process.env.EMAIL_AVISO_LEAD;
  const remetente = process.env.EMAIL_REMETENTE;

  if (!chave || !destino || !remetente) return;

  const linhas = [
    `Origem: ${resumo.origem}`,
    `Nome: ${resumo.nome}`,
    `WhatsApp: ${resumo.telefone}`,
    resumo.cidade ? `Cidade: ${resumo.cidade}` : null,
    resumo.detalhe ? `\n${resumo.detalhe}` : null,
    `\nAbrir o painel: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/leads`,
  ].filter(Boolean);

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remetente,
        to: [destino],
        subject: `Novo contato pelo site — ${resumo.nome}`,
        text: `${linhas.join("\n")}\n\n— ${empresa.nome}`,
      }),
    });

    if (!resposta.ok) {
      console.error("[aviso] Resend recusou o envio:", await resposta.text());
    }
  } catch (erro) {
    console.error("[aviso] Falha ao avisar sobre lead novo:", erro);
  }
}
