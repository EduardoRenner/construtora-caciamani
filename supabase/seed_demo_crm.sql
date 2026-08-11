-- ---------------------------------------------------------------------
-- DADOS DE EXEMPLO — só para demonstrar o CRM na venda do site
-- ---------------------------------------------------------------------
--
-- NÃO É PARA IR PARA PRODUÇÃO. Todo nome aqui é fictício, criado só
-- para o painel não aparecer vazio numa demonstração. Rodar isto num
-- ambiente que o Carlos vai usar de verdade seria mostrar "clientes"
-- que não existem — o oposto do que este projeto defende em todo o
-- resto (PENDENCIAS.md é claro: nada de dado inventado).
--
-- Como usar:
--   1. Rodar num projeto Supabase de DEMONSTRAÇÃO, separado do que o
--      Carlos vai usar — nunca no mesmo banco que recebe leads reais.
--   2. Depois da apresentação, apagar com o bloco no fim deste arquivo.
--
-- Requer 0001_leads.sql, 0002_conteudo.sql e 0003_crm.sql já aplicados.
-- ---------------------------------------------------------------------

insert into public.leads (
  id, origem, nome, telefone, email, cidade,
  tipo_construcao, area_m2, padrao_acabamento, situacao_terreno, prazo_inicio,
  estimativa_minima, estimativa_maxima, atendido, estagio, criado_em
) values
  (
    '00000000-0000-4000-8000-000000000001', 'orcamento',
    'Exemplo — Rafael Bittencourt', '(49) 99900-0001', 'rafael.exemplo@mail.com',
    'Maravilha', 'casa-terrea', 140, 'medio', 'tenho', '3-meses',
    380000, 460000, false, 'novo', now() - interval '1 day'
  ),
  (
    '00000000-0000-4000-8000-000000000002', 'orcamento',
    'Exemplo — Juliana Prestes', '(49) 99900-0002', 'juliana.exemplo@mail.com',
    'Maravilha', 'germinada', 220, 'alto', 'tenho', 'imediato',
    650000, 780000, false, 'contatado', now() - interval '4 days'
  ),
  (
    '00000000-0000-4000-8000-000000000003', 'contato',
    'Exemplo — Marcos Vinícius Souza', '(49) 99900-0003', null,
    'Pinhalzinho', null, null, null, null, null,
    null, null, false, 'orcamento_enviado', now() - interval '9 days'
  ),
  (
    '00000000-0000-4000-8000-000000000004', 'obra',
    'Exemplo — Fernanda Zanella', '(49) 99900-0004', 'fernanda.exemplo@mail.com',
    'Maravilha', 'predio', 90, 'alto', 'vou-comprar', '6-meses',
    410000, 490000, true, 'orcamento_enviado', now() - interval '15 days'
  ),
  (
    '00000000-0000-4000-8000-000000000005', 'orcamento',
    'Exemplo — Diego Hoffmann', '(49) 99900-0005', 'diego.exemplo@mail.com',
    'Maravilha', 'casa-terrea', 160, 'simples', 'tenho', 'imediato',
    320000, 380000, true, 'fechado', now() - interval '22 days'
  ),
  (
    '00000000-0000-4000-8000-000000000006', 'contato',
    'Exemplo — Patrícia Lourenço', '(49) 99900-0006', null,
    'São Miguel do Oeste', null, null, null, null, null,
    null, null, true, 'perdido', now() - interval '30 days'
  )
on conflict (id) do nothing;

insert into public.lead_interacoes (lead_id, tipo, nota, criado_em) values
  ('00000000-0000-4000-8000-000000000002', 'whatsapp', 'Mandei o link do simulador de orçamento e o portfólio de germinadas.', now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000002', 'ligacao', 'Confirmou que já tem o terreno em Maravilha, quer começar em até 30 dias.', now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000003', 'email', 'Enviei a proposta detalhada com o cronograma de obra.', now() - interval '8 days'),
  ('00000000-0000-4000-8000-000000000004', 'visita', 'Visita ao escritório — apresentei o projeto do prédio residencial.', now() - interval '13 days'),
  ('00000000-0000-4000-8000-000000000005', 'ligacao', 'Contrato assinado, início da obra previsto para o mês que vem.', now() - interval '20 days')
on conflict do nothing;

insert into public.lead_tarefas (lead_id, titulo, vencimento, concluida) values
  ('00000000-0000-4000-8000-000000000001', 'Ligar para apresentar a estimativa', current_date, false),
  ('00000000-0000-4000-8000-000000000002', 'Enviar contrato para assinatura', current_date + 2, false),
  ('00000000-0000-4000-8000-000000000003', 'Cobrar retorno da proposta', current_date - 2, false),
  ('00000000-0000-4000-8000-000000000004', 'Agendar visita ao terreno', current_date + 5, false),
  ('00000000-0000-4000-8000-000000000005', 'Confirmar data de início da obra', current_date - 15, true)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- Para apagar os dados de exemplo depois da demonstração:
--
--   delete from public.leads where nome like 'Exemplo — %';
--
-- O `on delete cascade` das duas tabelas novas apaga junto as
-- interações e tarefas de exemplo.
-- ---------------------------------------------------------------------
