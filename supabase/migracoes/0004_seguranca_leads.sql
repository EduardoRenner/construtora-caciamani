-- ---------------------------------------------------------------------
-- Trava adicional em `leads` — colunas administrativas
--
-- A política de INSERT em `leads` (0001) libera a chave anônima, de
-- propósito: é o que permite o site gravar um lead sem sessão. Mas RLS
-- no Postgres controla LINHAS, não colunas — a política não impede que
-- alguém, com a mesma chave anônima que já é pública por natureza (vai
-- no JS do navegador), monte uma chamada direta à API REST do Supabase
-- e insira uma linha já com `atendido = true` ou (desde 0003)
-- `estagio = 'fechado'`. O app nunca manda essas colunas no INSERT, mas
-- isso não impede alguém de ir direto à API.
--
-- Impacto real é baixo — no máximo poluir a lista/funil com registros
-- falsos já marcados como resolvidos, não vazamento de dado — mas é
-- barato fechar: um gatilho ANTES do insert reseta as colunas que só
-- fazem sentido depois de um humano do painel mexer, não importa o que
-- veio na requisição.
--
-- Rodar depois de 0001 e 0003.
-- ---------------------------------------------------------------------

create or replace function public.higienizar_lead_novo()
returns trigger language plpgsql as $$
begin
  -- Só reseta quando quem está inserindo é literalmente a chave anônima
  -- pública (`auth.role() = 'anon'` — é assim que o site insere um lead
  -- de verdade). Uma sessão autenticada do painel ou uma inserção feita
  -- direto no SQL Editor (onde `auth.role()` não existe, porque não há
  -- JWT nenhum) passam batido — é o caso do `seed_demo_crm.sql`, que
  -- precisa espalhar os leads de exemplo por vários estágios do funil.
  if auth.role() = 'anon' then
    new.atendido = false;
    new.estagio = 'novo';
    new.anotacoes = null;
  end if;
  return new;
end;
$$;

drop trigger if exists leads_higienizar_insert on public.leads;
create trigger leads_higienizar_insert
  before insert on public.leads
  for each row execute function public.higienizar_lead_novo();
