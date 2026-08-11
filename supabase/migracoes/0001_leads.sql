-- ---------------------------------------------------------------------
-- Tabela de leads — Construtora Caciamani
--
-- Recebe os três caminhos de contato do site: o simulador de orçamento,
-- o formulário de contato geral e o "quero algo parecido" das páginas
-- de obra.
--
-- Rodar no SQL Editor do painel do Supabase.
-- ---------------------------------------------------------------------

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),

  origem text not null check (origem in ('orcamento', 'contato', 'obra')),

  -- Contato
  nome text not null,
  telefone text not null,
  email text,
  cidade text,
  mensagem text,

  -- Só para leads vindos do simulador
  tipo_construcao text,
  area_m2 integer,
  padrao_acabamento text,
  situacao_terreno text,
  prazo_inicio text,
  estimativa_minima numeric(12, 2),
  estimativa_maxima numeric(12, 2),

  -- Só para leads vindos de uma página de obra
  obra_slug text,

  -- Controle do Carlos no painel
  atendido boolean not null default false,
  anotacoes text
);

comment on table public.leads is
  'Contatos recebidos pelo site. Gravados antes do redirecionamento para o WhatsApp, para não se perder quem desiste no meio.';

-- A listagem do admin filtra por período e por tipo.
create index if not exists leads_criado_em_idx on public.leads (criado_em desc);
create index if not exists leads_origem_idx on public.leads (origem);

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- O site grava com a chave anônima, que é pública por natureza. Por isso
-- a política libera INSERT e nada mais: quem tiver a chave consegue
-- mandar um lead (como conseguiria pelo formulário), mas não consegue
-- LER a base de contatos. A leitura fica só para o admin autenticado.
-- ---------------------------------------------------------------------

alter table public.leads enable row level security;

drop policy if exists "site pode inserir lead" on public.leads;
create policy "site pode inserir lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admin autenticado lê leads" on public.leads;
create policy "admin autenticado lê leads"
  on public.leads
  for select
  to authenticated
  using (true);

drop policy if exists "admin autenticado atualiza leads" on public.leads;
create policy "admin autenticado atualiza leads"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);
