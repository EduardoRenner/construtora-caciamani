-- ---------------------------------------------------------------------
-- CRM — funil de clientes
--
-- Estende a tabela `leads` (que já recebe os contatos do site) com um
-- estágio de funil, e adiciona histórico de interação e tarefas de
-- follow-up. É um painel de vendas por cima dos leads reais — não troca
-- a lista simples de `/admin/leads`, complementa com visão de funil.
--
-- Rodar no SQL Editor do Supabase, depois de 0001 e 0002.
-- ---------------------------------------------------------------------

alter table public.leads
  add column if not exists estagio text not null default 'novo'
    check (estagio in ('novo', 'contatado', 'orcamento_enviado', 'fechado', 'perdido'));

create index if not exists leads_estagio_idx on public.leads (estagio);

-- ---------------------------------------------------------------------
-- Histórico de interação: cada ligação, WhatsApp ou visita registrada
-- contra um lead, com data. Sem isso, a única "memória" do painel era
-- um campo de anotação único — que a última pessoa a editar sobrescreve.
-- ---------------------------------------------------------------------

create table if not exists public.lead_interacoes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  criado_em timestamptz not null default now(),
  tipo text not null check (tipo in ('ligacao', 'whatsapp', 'email', 'visita', 'outro')),
  nota text not null
);

create index if not exists lead_interacoes_lead_idx
  on public.lead_interacoes (lead_id, criado_em desc);

-- ---------------------------------------------------------------------
-- Tarefas: follow-up com data de vencimento. Alimenta o aviso de
-- "atrasadas / para hoje" no início do painel.
-- ---------------------------------------------------------------------

create table if not exists public.lead_tarefas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  criado_em timestamptz not null default now(),
  titulo text not null,
  vencimento date not null,
  concluida boolean not null default false,
  concluida_em timestamptz
);

create index if not exists lead_tarefas_lead_idx on public.lead_tarefas (lead_id);
create index if not exists lead_tarefas_vencimento_idx
  on public.lead_tarefas (vencimento) where not concluida;

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- Diferente de `leads`, estas duas tabelas não recebem nada do site
-- público — só o painel autenticado lê e escreve. Sem política para
-- `anon`, o padrão do Postgres já nega tudo; não precisa de policy de
-- bloqueio explícita.
-- ---------------------------------------------------------------------

alter table public.lead_interacoes enable row level security;
alter table public.lead_tarefas enable row level security;

drop policy if exists "admin gerencia interações" on public.lead_interacoes;
create policy "admin gerencia interações"
  on public.lead_interacoes for all to authenticated using (true) with check (true);

drop policy if exists "admin gerencia tarefas" on public.lead_tarefas;
create policy "admin gerencia tarefas"
  on public.lead_tarefas for all to authenticated using (true) with check (true);
