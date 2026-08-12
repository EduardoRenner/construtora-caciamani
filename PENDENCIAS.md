# Pendências — site Construtora Caciamani

Tudo o que o site precisa e ainda não tem. Nada nesta lista foi
preenchido por estimativa: onde falta informação, o site mostra
`⟨PENDENTE⟩` na tela, de propósito. Hoje são 32 marcadores na home, 17
em `/obras`, 14 em `/sobre`, 12 em `/contato` e 11 em cada página de obra.

> **Existe agora um modo demonstração** (`NEXT_PUBLIC_MODO_DEMO=true`),
> para apresentar o site ao Carlos sem seção vazia. Ele **não resolve
> nada desta lista** — só troca o marcador por conteúdo fictício,
> centralizado em `src/content/demo.ts`. Com a flag ligada a home cai de
> 32 marcadores para 6, `/obras` para 5 e `/sobre` para 10; os que
> sobram são justamente os que conteúdo fictício não pode cobrir (itens
> 1.1, 1.2, 1.3, 3.6, 3.8). **Tudo aqui continua valendo.** Ver seção
> 0-B e o README.

Atualizado depois de uma **auditoria técnica completa** (dev sênior:
código, segurança, performance, acessibilidade, SEO). Ver seção 0.

> **O item 1.4 foi resolvido em 12/08/2026.** O Supabase do projeto
> "caciamani" está criado e as 4 migrações rodaram — confirmadas linha
> por linha, não só "sem erro": tabelas, RLS, o gatilho de segurança e
> até um insert de teste real (com tentativa de forjar campo, barrada
> pelo gatilho — depois apagado). `.env.local` e as variáveis da Vercel
> já estão configuradas. Falta só **criar o login do Carlos** — ver 1.4b,
> é a única coisa que ninguém além de um humano no painel do Supabase
> pode fazer.

---

## 0. Auditoria técnica — o que foi encontrado e corrigido

Passe completo pelo código, sem mudar nenhum texto nem inventar imagem
nenhuma — os locais com `⟨PENDENTE⟩` continuam `⟨PENDENTE⟩`, de
propósito. O que mudou foi correção de bug, segurança e organização.

**Corrigido nesta auditoria:**

- **Bug real, ainda não visível.** `next.config.ts` não tinha
  `images.remotePatterns` configurado. Toda foto do site público passa
  pelo otimizador do Next, que recusa (erro 400) qualquer domínio de
  imagem não liberado explicitamente. Hoje isso não aparece porque as
  únicas fotos no ar são arquivos locais — mas a **primeira** foto que o
  Carlos subir pelo painel (hospedada no Storage do Supabase,
  `*.supabase.co`) quebraria em toda página que a exibisse. Corrigido:
  o domínio é extraído automaticamente de `NEXT_PUBLIC_SUPABASE_URL`,
  então funciona com qualquer projeto Supabase configurado, sem
  hardcode.
- **Brecha de segurança fechada** (`0004_seguranca_leads.sql`). A
  política de `leads` libera INSERT para a chave anônima — de
  propósito, é como o site grava um lead sem sessão. Mas RLS controla
  linhas, não colunas: com a mesma chave anônima (pública por natureza,
  vai no JS do navegador) dava para montar uma chamada direta à API do
  Supabase e inserir um lead já com `atendido = true` ou
  `estagio = 'fechado'` forjados, sem passar pela validação do site.
  Impacto real era baixo (poluir a lista, não vazar dado), mas barato de
  fechar: um gatilho reseta essas colunas no insert, só quando quem está
  inserindo é de fato a chave anônima pública — não afeta o painel
  autenticado nem o script de dados de exemplo.
- **Cabeçalhos de segurança**, ausentes até agora: `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` (bloqueia câmera/microfone/
  localização, que o site não usa), e `X-Frame-Options: DENY` só no
  painel — é o único ponto que autentica, vale a barreira a mais contra
  clickjacking.
- **Faltavam páginas de erro.** Sem `error.tsx`, qualquer exceção não
  tratada (ex.: uma consulta ao Supabase que falha de um jeito
  inesperado) caía na tela genérica do Next, sem a cara do site e sem
  caminho de volta. Criadas as três: uma para o site público (mantém
  cabeçalho e rodapé), uma para o painel, e uma "última rede" para o
  caso raro do próprio layout raiz falhar.
- **Dependência morta removida**: `motion` (framer-motion) estava no
  `package.json` desde o briefing original, mas todas as animações do
  site acabaram sendo feitas em CSS puro (por causa do LCP — ver
  README). Zero import em todo o `src/`. Removida.
- **Contraste do painel admin, medido de verdade.** Ele nunca tinha sido
  verificado no navegador, diferente do site público — foi construído
  antes do sistema de tema existir e ficou preso no escuro quando o
  tema chegou, sem seletor próprio. Medi programaticamente todos os
  pares texto/fundo realmente usados: de 5,34:1 a 15,46:1, **todos
  passam em AA**. Item 6.4 antigo, agora resolvido — sem regressão.
- **`npm audit`**: 3 vulnerabilidades altas, todas no `sharp` (dependência
  transitiva do Next, usada só na otimização de imagem — na Vercel quem
  otimiza é a infraestrutura deles, não o `sharp` local). O único
  conserto automático (`npm audit fix --force`) sobe o Next para a
  versão 16, que é major e pode quebrar coisa — não fiz isso sem
  perguntar. Ver 6.5.

**Verificado e confirmado saudável, sem mudança necessária:**

- Zero `console.log` esquecido, zero `any` explícito, zero
  `eslint-disable`, zero `TODO`/`FIXME` real no código.
- Os dois usos de `dangerouslySetInnerHTML` (script do tema, JSON-LD)
  são seguros — string estática nossa e `JSON.stringify` de dado nosso,
  nenhum dos dois toca em entrada de usuário.
- `lib/aviso.ts` já trata erro de rede corretamente (`try/catch`, nunca
  derruba o formulário se o Resend falhar).
- Lighthouse depois de todas as mudanças, contra o build de produção:
  Performance 98–99, Acessibilidade 100, Boas Práticas 100, SEO 100
  (com `NEXT_PUBLIC_INDEXAR=true` — sem essa variável o SEO cai de
  propósito, é a trava de indexação, não regressão). CLS 0.

**Encontrado, registrado, não corrigido agora** — ver itens 6.5 a 6.7.

## 0-B. Modo demonstração — o que foi feito e por quê

O site precisava ser apresentável ao Carlos antes de a empresa fornecer
os dados. Isso colide de frente com a regra do projeto, então a saída
foi não misturar as duas coisas: **uma camada demo separada, num arquivo
só, atrás de uma variável de ambiente.**

- **`src/content/demo.ts`** — tudo o que é fictício mora aqui: os quatro
  números da faixa de prova, 5 obras, 3 depoimentos, 8 cidades, o
  horário de atendimento, o ano de início, um texto institucional em
  terceira pessoa e a tabela de coeficientes do orçamento. Nenhum desses
  textos está espalhado pelo código — trocar pelo real é editar um
  arquivo e apagar a variável.
- **A ordem nunca inverte.** Banco → semente → demo. Se o Carlos salvar
  dois dos quatro números no painel, esses dois continuam valendo e só
  os outros dois vêm do demo. O mesmo vale obra por obra e depoimento
  por depoimento.
- **O que a flag NÃO preenche, nem ligada:** CNPJ, razão social, CREA,
  responsável técnico, endereço, e-mail e qualquer
  frase em primeira pessoa atribuída a ele. Esses viram `⟨a confirmar⟩`,
  curto, em vez do `⟨PENDENTE: descrição inteira⟩`. Numa apresentação
  lêem como campo a preencher — que é o que são.
- **As capas das obras demonstrativas são desenhos, não fotos.**
  `scripts/gerar-capas-demo.mjs` gera cinco elevações técnicas em
  `public/obras/demo/`, no mesmo traço do hero, com "ILUSTRAÇÃO · OBRA
  DEMONSTRATIVA" impresso dentro da imagem. Banco de imagem atribuiria a
  terceiros uma obra da Caciamani, que é o oposto do que este documento
  defende.
- **Antes/depois sai do ar em modo demo.** O par exige duas fotos com o
  mesmo enquadramento (item 3.3) — não dá para improvisar, então a seção
  some em vez de virar comparador vazio.
- **O simulador passa a calcular**, com coeficientes fictícios e um
  aviso ao lado da faixa dizendo exatamente isso. Item 4 continua aberto.
- **O rodapé anuncia o modo demo** numa linha discreta, para ninguém
  sair da apresentação achando que os números são da empresa.

**Como desligar:** apagar `NEXT_PUBLIC_MODO_DEMO` do `.env.local` e da
Vercel. O site volta ao comportamento original sem nenhuma mudança de
código.

### Banco, durante a demonstração

- **Dados de exemplo do CRM aplicados** no projeto `caciamani`
  (`supabase/seed_demo_crm.sql`): 6 leads cobrindo os cinco estágios do
  funil, 5 interações e 5 tarefas. Todo nome vem prefixado
  `Exemplo — `. Contraria a instrução original do próprio arquivo (que
  pedia um projeto Supabase separado) — foi decisão consciente do dono
  do projeto, para o painel não abrir zerado na apresentação.
  **Limpar depois com:**

  ```sql
  delete from public.leads where nome like 'Exemplo — %';
  ```

- **"Casa bimba" foi despublicada, não apagada** (`publicada = false`).
  Era o registro de teste do primeiro cadastro pelo painel e aparecia
  como primeiro card do portfólio, com uma captura de tela por capa.
  Continua no banco e visível em `/admin/obras` como rascunho; um clique
  republica.

## 1. Bloqueiam o site de ir ao ar

| # | O que falta | Por que é bloqueante | Onde aparece |
|---|---|---|---|
| 1.1 | **CNPJ e razão social** | Rodapé de site de construtora sem CNPJ é problema de conformidade. Não pode ser inventado. | Rodapé, JSON-LD |
| 1.2 | **CREA e nome do responsável técnico** | Exigência do CONFEA/CREA para divulgação de serviços de engenharia. | Rodapé |
| 1.3 | **Endereço do escritório** (rua, bairro, CEP) | Alimenta o `LocalBusiness` do Google e a página de contato. Sem ele o SEO local perde muito. | Contato, rodapé, JSON-LD |
| 1.4 | ~~Criar o projeto no Supabase, rodar as migrações, preencher `.env.local`~~ — **feito em 12/08/2026.** Projeto `caciamani` (`dlrfheafvjjcckwnzunh`), as 4 migrações aplicadas e verificadas, `.env.local` e as 3 variáveis da Vercel (produção, preview, dev) configuradas. | — | — |
| 1.4b | **Criar o login do Carlos**: no painel do Supabase, **Authentication › Users › Add user** — e-mail e senha à mão. Não existe cadastro aberto no site, e criar conta/senha não é algo que se automatiza por API — precisa ser um humano com acesso ao painel do Supabase. | Sem isso, ninguém consegue entrar em `/admin` — o painel já funciona (confirmei: `/admin` redireciona pro login corretamente), só falta a credencial de quem vai usar. | Login do painel |
| 1.5 | **Logo em vetor** (`.svg`, `.ai`, `.pdf` ou PNG grande com fundo transparente) | Hoje só existe em raster, do Instagram. Sem vetor não dá para gerar favicon nítido, imagem Open Graph nem a versão monocromática para fundo escuro. O site usa um wordmark provisório em tipo — **não** um monograma inventado. | Header, rodapé, favicon, OG |

## 2. Precisam da conferência do Carlos

Estes textos **já estão escritos** no site, no tom certo. Mas descrevem
como a empresa trabalha, e isso é fato, não estilo. Se algum estiver
errado, a frase muda.

| # | O que conferir | Arquivo |
|---|---|---|
| 2.1 | **Descrição dos 5 serviços** e o que está incluído em cada um. Exemplo concreto: o site afirma que a Caciamani cuida da documentação para aprovação. Cuida mesmo? | `src/content/servicos.ts` |
| 2.2 | **As 6 etapas da obra** e o que o cliente recebe ao fim de cada uma. É assim que o Carlos trabalha? | `src/content/processo.ts` |

## 3. Bloqueiam seções inteiras

| # | O que falta | Onde aparece |
|---|---|---|
| 3.1 | **As quatro estatísticas**: clientes atendidos, projetos realizados, índice de satisfação, anos de mercado — com a frase que qualifica cada uma ("desde 19XX", "em Maravilha e região") | Faixa de prova da home |
| 3.2 | **Arquivos originais dos dois renders que já estão no site.** O prédio residencial e as duas casas germinadas foram recuperados dos prints do Instagram: 850px e 672px de largura, recortados para tirar marca d'água, seta do carrossel e a faixa com a logo antiga. Servem, mas são de baixa resolução — no hero em tela grande a suavidade aparece. Pedir os renders originais ao projetista. | Hero, cards, /obras/[slug] |
| 3.2b | **Fotos das obras entregues, em alta** — as que existem hoje são renders de projeto, não obra construída. Falta foto do que está de pé, incluindo a terceira obra (três germinadas), que segue sem imagem. | Home, /obras, /obras/[slug] |
| 3.3 | **Pares antes/depois** — as duas fotos precisam ter **exatamente o mesmo enquadramento e a mesma proporção**. Isso tem que ser fotografado de propósito: vale tirar a foto do terreno antes de começar toda obra nova, do mesmo ponto. | Home, /obras/[slug] |
| 3.4 | **Dados de cada obra**: ano, área em m², prazo de execução, uma linha de resumo, descrição | /obras e cards da home |
| 3.5 | **Depoimentos** com nome, bairro/cidade, texto do cliente e autorização de uso | Home |
| 3.6 | ~~Retrato do Carlos Primo Caciamani~~ — **foto real recebida e publicada** (12/08/2026), em `public/equipe/`. Continua faltando: o **ano em que ele começou** (hoje vem do modo demonstração) e uma **fala dele em primeira pessoa**, que segue pendente mesmo em demo. | Home, /sobre |
| 3.7 | **Lista nomeada das cidades atendidas** — hoje só Maravilha está confirmada | Área de atendimento, JSON-LD `areaServed` |
| 3.8 | **E-mail de contato** e **horário de atendimento** | Contato, rodapé |
| 3.9 | **Telefone fixo**, se houver | Contato, rodapé |

## 4. Calibragem do simulador de orçamento

O simulador **está pronto e funcionando** — percorre os seis passos,
valida, grava o lead e monta a mensagem do WhatsApp. O que ele ainda não
faz é **calcular**: sem os coeficientes abaixo, a tela final diz que não
está calibrado e lista exatamente o que falta, em vez de mostrar um
número inventado.

Tudo isto vive em `src/config/orcamento.ts`, com o método documentado no
topo do arquivo. Na fase 7 passa a ser editável pelo painel.

| # | O que falta |
|---|---|
| 4.1 | **Valor do CUB/SC** vigente e qual projeto-padrão usar (R-8 Normal, por exemplo) |
| 4.2 | **Fator de custo por tipo de obra** — 6 valores (casa térrea, sobrado, germinada, prédio, reforma, só projeto) |
| 4.3 | **Fator de custo por padrão de acabamento** — 3 valores (simples, médio, alto) |
| 4.4 | **Amplitude da faixa** de preço (ex.: ±15%) |
| 4.5 | **Prazo de obra por tipo**: meses de base + meses a cada 100 m² |
| 4.6 | **Conferir a lista de itens de cada padrão de acabamento.** Já existe um rascunho concreto no site (piso cerâmico vs. porcelanato, forro de PVC vs. gesso etc.). Isso define expectativa e vira discussão na obra se estiver errado. |
| 4.7 | Conferir o **texto do aviso legal** da estimativa com o cliente |

**Sugestão de calibragem:** pegar 3 ou 4 obras já entregues, dividir o
custo final pela área e comparar com o CUB do mês em que cada uma rodou.
A razão entre os dois é o fator.

## 5. Decisões do cliente

| # | Decisão |
|---|---|
| 5.1 | O corretor parceiro **Marcos Aléssio** (CRECI/SC 20.692, (49) 98862-0341) entra no site? Em qual seção? |
| 5.2 | O Facebook entra? Se sim, a URL da página. |
| 5.3 | Qual **domínio** será registrado (hoje está `construtoracaciamani.com.br` como provisório). |
| 5.4 | **Como o Carlos quer ser avisado de um lead novo.** O aviso por **e-mail** é simples e praticamente sem custo (Resend, plano gratuito cobre este volume) — mas e-mail é fácil de não ler. O aviso por **WhatsApp** seria muito mais eficaz, só que exige a API oficial da Meta: custo por mensagem, modelo de mensagem aprovado previamente e conta comercial verificada. O site está sendo feito com e-mail; trocar depois é possível. |
| 5.5 | Quem recebe os leads e por onde (só WhatsApp, ou também e-mail?). |

## 6. Melhoram, mas não bloqueiam

| # | O que seria melhor |
|---|---|
| 6.0 | **Ícone do navegador e imagem de compartilhamento provisórios.** Hoje são tipográficos, gerados por código — um "C" para o favicon e uma capa com o nome para o WhatsApp. Não inventamos um símbolo para concorrer com a marca real. Quando o vetor da logo chegar (item 1.5), vale refazer os dois. |
| 6.1 | **Desenho de elevação real** de um projeto da Caciamani, para o traço do hero. Hoje é uma elevação genérica de prédio residencial, desenhada na massa do edifício que aparece no Instagram. Se existir o DWG/PDF do projeto, o traçado real deixa o hero muito mais forte. |
| 6.2 | **Limite de envio por IP mais robusto.** Hoje é em memória, por processo — em serverless, o limite real é o configurado vezes o número de instâncias. Segura robô burro, não ataque dirigido. Se aparecer spam de verdade, o caminho é uma tabela de contagem no próprio Supabase ou um Redis. |
| 6.3 | **Ampliar foto na galeria da obra** (lightbox). Hoje a galeria é uma grade sem JavaScript. Só vale decidir depois que as fotos reais chegarem — com foto boa e grande, pode ser desnecessário. |
| 6.4 | ~~O painel admin nunca teve o contraste medido~~ — **resolvido na auditoria técnica**, ver seção 0. Todos os pares passam em AA. |
| 6.5 | **`sharp` com vulnerabilidade alta**, dependência transitiva do Next (`npm audit`). O conserto automático sobe o Next para a versão 16 (major, pode quebrar coisa) — decisão do tipo que não se toma sem combinar. Na Vercel o impacto prático é baixo (a otimização de imagem roda na infraestrutura deles, não no `sharp` local), mas vale planejar a atualização do Next em algum momento, com tempo para testar. |
| 6.6 | **`key={indice}` na lista de pares antes/depois** (`FormularioObra.tsx`, painel de obras). Funciona hoje porque a lista é pequena (1–3 pares) e cada item é totalmente controlado por estado — não é um bug que alguém vá notar na prática — mas é o tipo de padrão frágil que trava sutilmente se a lista crescer ou ganhar reordenação. Consertar direito exige guardar o `id` de cada par (o banco já tem um; hoje ele se perde na conversão para o formato do formulário) e usá-lo como `key`. |
| 6.7 | **`/admin/clientes` não tem "apagar cliente".** Só existe apagar obra e depoimento. Como o CRM foi pensado para demonstração de venda, dá para limpar os dados de exemplo direto no SQL Editor (instrução no fim de `seed_demo_crm.sql`) — mas se o Carlos for usar o funil de verdade, vale adicionar a ação de apagar, com a mesma confirmação (`confirm()`) já usada em obras. |

---

## Já resolvido

- **Logo definida**: é a de fundo marinho, com os prédios em ciano e "CPC CACIAMANI CONSTRUTORA" em âmbar. O tema escuro do site (padrão) foi construído em cima dela: marinho `#0A1826`, ciano `#35C2E3`, âmbar `#F2A81D`. A versão amarela antiga não é mais referência — se ela aparecer em material novo, é engano.
- **Dois renders no ar**, recuperados dos prints do Instagram e limpos: o prédio residencial (hero + card + página da obra) e as duas casas germinadas. Ver 3.2 para os originais em alta.
- **Escopo do painel admin** (decidido na fase 6). Além da base — obras, estatísticas, textos, depoimentos, valores do orçamento, leads com CSV, contatos e cidades — entram três coisas: marcar lead como atendido com anotação, rascunho/publicado com prévia, e aviso de novo lead. Ficaram **de fora** por decisão: diário de obra com link privado, área logada por cliente, origem do lead, upload dedicado para celular, pedido automático de depoimento e agendamento de visita. Todos podem entrar depois.
- **CRM (funil de clientes)** — adicionado depois da fase 8, revertendo a decisão da fase 6. Lá, "CRM com funil e estágios" tinha ficado marcado como "não vale a complexidade", com o argumento de que o Carlos ia continuar usando o WhatsApp e um meio-CRM só criaria um segundo lugar pra esquecer as coisas. O motivo mudou: não é para o Carlos usar todo dia, é para o painel ficar mais convincente **na hora de vender o serviço** — então o argumento original não se aplica mais. Entrou completo: `/admin/clientes` (quadro em colunas: Novo → Contatado → Orçamento enviado → Fechado/Perdido, com arrastar-e-soltar e um `<select>` acessível fazendo a mesma função) e `/admin/clientes/[id]` (histórico de interação com data, tarefas com vencimento). O início do painel ganhou um aviso de tarefas atrasadas/do dia. Migração em `supabase/migracoes/0003_crm.sql`.
  - **Dados de exemplo, para a demonstração**: `supabase/seed_demo_crm.sql`, com nomes claramente marcados "Exemplo — ...". Só para rodar num Supabase de demonstração, nunca no banco que o Carlos vai usar de verdade — o resto deste documento existe justamente para nenhum dado inventado chegar perto do que é real. Tem instrução de limpeza no fim do próprio arquivo.
  - Achado no caminho: `vencimento` é uma coluna `date` do Postgres ("AAAA-MM-DD", sem hora). Formatar isso com `new Date(...)` ou comparar com `toISOString()` interpreta a data como meia-noite UTC — no fuso do Brasil (UTC-3), à noite isso já mostra o dia seguinte. Uma tarefa "para hoje" apareceria como não vencida ainda, ou vencida um dia antes da hora. Corrigido montando a data a partir das partes, sem passar por UTC. Provado isoladamente simulando 23h no fuso de São Paulo.
- **Supabase configurado e verificado, em produção** (12/08/2026). Projeto `caciamani` (ref `dlrfheafvjjcckwnzunh`), as 4 migrações aplicadas via `supabase db query --linked -f ...` (o CLI já estava autenticado nesta máquina). Verificação foi além de "rodou sem erro":
  - Confirmado por consulta direta: as 8 tabelas existem com RLS ligado, os 2 gatilhos existem, a coluna `estagio` tem o valor padrão certo, o bucket `obras` existe e é público.
  - **Testado o caminho real de ponta a ponta**: um POST HTTP contra a API do Supabase, com a chave anônima, exatamente como o site faz. Confirmou 201 e a linha apareceu no banco. Uma segunda tentativa, forjando `atendido=true` e `estagio='fechado'` no corpo da requisição, confirmou que o gatilho da 0004 reseta os dois campos — a brecha de segurança fechada nesta auditoria funciona de verdade, não só no papel. As duas linhas de teste foram apagadas depois.
  - **Achado no caminho, sem ser bug**: pedir o registro de volta no insert (`Prefer: return=representation` / `.select()` no client JS) falha com "row-level security policy" para a chave anônima — porque `RETURNING` exige política de SELECT, e `anon` só tem política de INSERT em `leads` (de propósito: grava, não lê). O código real (`acoes/leads.ts`) nunca pede o registro de volta, então nunca foi afetado; documentado aqui para não confundir alguém testando a API manualmente no futuro.
  - `.env.local` criado (fora do git) e as 3 variáveis (produção/preview/dev) configuradas na Vercel, com novo deploy publicado.
  - Falta só criar o login do Carlos — ver 1.4b, é passo manual no painel do Supabase.
- **WhatsApp do site**: confirmado o **(49) 99192-7673**. O (11) 99654-7673, que também aparecia no material público, não entra.
- Paleta, tipografia e o elemento assinatura ("a cota") — aprovados na fase 1.
- **Lighthouse no celular, contra o build de produção**, em 8 páginas:
  Performance 98–99, Acessibilidade 100, Boas Práticas 100, SEO 100,
  CLS 0 em todas. LCP entre 1,81 s e 2,11 s — só a página de uma obra
  ficou levemente acima de 2 s.
- Ajustes feitos por causa dessa medição:
  - Fontes passaram de `display: swap` para `optional`. Com swap, a
    troca de fonte movia o hero inteiro: 0,12 de CLS, acima do limite de
    0,1 do Google. **Custo:** quem entra pela primeira vez pode ver a
    página na fonte de reserva; quem volta vê a tipografia real.
  - `.etiqueta` subiu de 11 px para 12 px e o descritor da marca de 9 px
    para 11 px — abaixo de 12 px o Lighthouse considera ilegível no
    celular, e ele tem razão.
  - Os filtros do portfólio viraram rotas próprias
    (`/obras/tipo/germinada`) em vez de `?tipo=`. Em rota dinâmica o
    Next emite a meta description **depois** do `<body>`, e a prévia do
    link no WhatsApp saía sem descrição. De quebra, cada recorte virou
    página indexável.
- Ajustes de contraste feitos para passar em AA (todos medidos no navegador):
  - `concreto` de `#6C7278` → `#5A6067` (dava 4.03:1 sobre `cal`).
  - Marcador `⟨PENDENTE⟩` sobre seção escura: dava 2.78:1; agora usa um óxido clareado, 5.1:1.
  - Marcador `⟨PENDENTE⟩` sobre `cal`: dava 4.35:1 por causa do próprio tingimento; agora usa um óxido escurecido, 5.3:1.
  - Dica "arraste ou use ← →": dava 2.17:1; agora 5.3:1.
