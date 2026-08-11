/**
 * Limite de envios por IP, em memória.
 *
 * LIMITAÇÃO CONHECIDA: o estado vive no processo. Em serverless, cada
 * instância tem o seu, então o limite real é o configurado multiplicado
 * pelo número de instâncias ativas. Para o volume de um site de
 * construtora regional isso é suficiente e não custa nada — ele existe
 * para conter robô burro, não ataque dirigido.
 *
 * Se o volume crescer, o caminho é uma tabela no próprio Supabase com
 * contagem por IP e janela, ou um Redis (Upstash). Ver PENDENCIAS.md.
 */

const envios = new Map<string, number[]>();

const MAXIMO_PADRAO = 5;
const JANELA_PADRAO_MS = 10 * 60 * 1000;

export function dentroDoLimite(
  ip: string,
  maximo = MAXIMO_PADRAO,
  janelaMs = JANELA_PADRAO_MS,
): boolean {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < janelaMs);

  if (recentes.length >= maximo) {
    envios.set(ip, recentes);
    return false;
  }

  recentes.push(agora);
  envios.set(ip, recentes);

  // Faxina oportunista: sem isso o Map cresce para sempre em processos
  // de vida longa.
  if (envios.size > 5000) {
    for (const [chave, marcas] of envios) {
      if (marcas.every((t) => agora - t >= janelaMs)) envios.delete(chave);
    }
  }

  return true;
}
