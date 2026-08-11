-- ---------------------------------------------------------------------
-- Conteúdo editável — Construtora Caciamani
--
-- Move para o banco o que hoje vive em `src/content/*.ts`, para que o
-- Carlos edite pelo painel sem tocar em código. Os arquivos TypeScript
-- continuam existindo como semente e como plano B: se o Supabase não
-- estiver configurado, o site cai neles e continua no ar.
--
-- Rodar no SQL Editor do painel do Supabase, depois de 0001_leads.sql.
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- Obras
-- ---------------------------------------------------------------------

create table if not exists public.obras (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  -- Endereço da obra no site. No painel isto aparece como
  -- "endereço da página", nunca como "slug".
  slug text not null unique,
  titulo text not null,
  tipo text not null check (tipo in ('casa', 'germinada', 'predio', 'reforma', 'projeto')),
  cidade text not null,
  uf text not null default 'SC',

  ano integer,
  area_m2 integer,
  prazo_meses integer,
  resumo text,
  descricao text,

  capa_url text,
  capa_alt text,

  destaque boolean not null default false,
  publicada boolean not null default false,
  ordem integer not null default 0
);

create index if not exists obras_publicada_idx on public.obras (publicada, ordem);

create table if not exists public.obra_fotos (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  url text not null,
  -- Descrição da foto para quem não enxerga. Obrigatória de propósito.
  alt text not null,
  ordem integer not null default 0
);

create index if not exists obra_fotos_obra_idx on public.obra_fotos (obra_id, ordem);

create table if not exists public.obra_antes_depois (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  antes_url text not null,
  antes_alt text not null,
  depois_url text not null,
  depois_alt text not null,
  legenda text,
  prazo text,
  ano integer,
  ordem integer not null default 0
);

create index if not exists obra_antes_depois_obra_idx
  on public.obra_antes_depois (obra_id, ordem);

-- ---------------------------------------------------------------------
-- Depoimentos
-- ---------------------------------------------------------------------

create table if not exists public.depoimentos (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  nome text not null,
  cidade text not null,
  bairro text,
  texto text not null,
  foto_url text,
  foto_alt text,
  -- Sem autorização do cliente, não publica. É por isso que são dois
  -- campos e não um.
  autorizado boolean not null default false,
  publicado boolean not null default false,
  ordem integer not null default 0
);

-- ---------------------------------------------------------------------
-- Configurações
--
-- Chave/valor em JSON em vez de uma coluna por campo: estatísticas,
-- dados da empresa, cidades atendidas e coeficientes do orçamento mudam
-- de formato com o tempo, e cada mudança dessas viraria uma migração.
-- ---------------------------------------------------------------------

create table if not exists public.configuracoes (
  chave text primary key,
  valor jsonb not null,
  atualizado_em timestamptz not null default now()
);

comment on table public.configuracoes is
  'Chaves usadas: empresa, estatisticas, cidades, orcamento.';

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- Leitura pública apenas do que está publicado; escrita só para o
-- usuário autenticado do painel.
-- ---------------------------------------------------------------------

alter table public.obras enable row level security;
alter table public.obra_fotos enable row level security;
alter table public.obra_antes_depois enable row level security;
alter table public.depoimentos enable row level security;
alter table public.configuracoes enable row level security;

drop policy if exists "público lê obras publicadas" on public.obras;
create policy "público lê obras publicadas"
  on public.obras for select to anon using (publicada = true);

drop policy if exists "admin gerencia obras" on public.obras;
create policy "admin gerencia obras"
  on public.obras for all to authenticated using (true) with check (true);

drop policy if exists "público lê fotos de obra publicada" on public.obra_fotos;
create policy "público lê fotos de obra publicada"
  on public.obra_fotos for select to anon
  using (exists (
    select 1 from public.obras o
    where o.id = obra_fotos.obra_id and o.publicada = true
  ));

drop policy if exists "admin gerencia fotos" on public.obra_fotos;
create policy "admin gerencia fotos"
  on public.obra_fotos for all to authenticated using (true) with check (true);

drop policy if exists "público lê antes e depois publicados" on public.obra_antes_depois;
create policy "público lê antes e depois publicados"
  on public.obra_antes_depois for select to anon
  using (exists (
    select 1 from public.obras o
    where o.id = obra_antes_depois.obra_id and o.publicada = true
  ));

drop policy if exists "admin gerencia antes e depois" on public.obra_antes_depois;
create policy "admin gerencia antes e depois"
  on public.obra_antes_depois for all to authenticated using (true) with check (true);

drop policy if exists "público lê depoimentos publicados" on public.depoimentos;
create policy "público lê depoimentos publicados"
  on public.depoimentos for select to anon
  using (publicado = true and autorizado = true);

drop policy if exists "admin gerencia depoimentos" on public.depoimentos;
create policy "admin gerencia depoimentos"
  on public.depoimentos for all to authenticated using (true) with check (true);

drop policy if exists "público lê configurações" on public.configuracoes;
create policy "público lê configurações"
  on public.configuracoes for select to anon using (true);

drop policy if exists "admin gerencia configurações" on public.configuracoes;
create policy "admin gerencia configurações"
  on public.configuracoes for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------
-- Armazenamento das fotos
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('obras', 'obras', true)
on conflict (id) do nothing;

drop policy if exists "qualquer um vê as fotos" on storage.objects;
create policy "qualquer um vê as fotos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'obras');

drop policy if exists "admin envia fotos" on storage.objects;
create policy "admin envia fotos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'obras');

drop policy if exists "admin apaga fotos" on storage.objects;
create policy "admin apaga fotos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'obras');

-- ---------------------------------------------------------------------
-- atualizado_em automático
-- ---------------------------------------------------------------------

create or replace function public.tocar_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists obras_atualizado_em on public.obras;
create trigger obras_atualizado_em
  before update on public.obras
  for each row execute function public.tocar_atualizado_em();
