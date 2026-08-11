# Pendências — site Construtora Caciamani

Tudo o que o site precisa e ainda não tem. Nada nesta lista foi
preenchido por estimativa: onde falta informação, o site mostra
`⟨PENDENTE⟩` na tela, de propósito. Hoje são 32 marcadores na home, 17
em `/obras`, 14 em `/sobre`, 12 em `/contato` e 11 em cada página de obra.

Atualizado na **fase 8** (passe final).

> **O item 1.4 virou o mais urgente da lista.** Todo o painel, a
> gravação de leads e a edição de conteúdo dependem do Supabase estar
> criado. Enquanto não estiver, o site funciona e converte pelo
> WhatsApp, mas nada é gravado e nada é editável sem mexer em código.

---

## 1. Bloqueiam o site de ir ao ar

| # | O que falta | Por que é bloqueante | Onde aparece |
|---|---|---|---|
| 1.1 | **CNPJ e razão social** | Rodapé de site de construtora sem CNPJ é problema de conformidade. Não pode ser inventado. | Rodapé, JSON-LD |
| 1.2 | **CREA e nome do responsável técnico** | Exigência do CONFEA/CREA para divulgação de serviços de engenharia. | Rodapé |
| 1.3 | **Endereço do escritório** (rua, bairro, CEP) | Alimenta o `LocalBusiness` do Google e a página de contato. Sem ele o SEO local perde muito. | Contato, rodapé, JSON-LD |
| 1.4 | **Criar o projeto no Supabase**, rodar `supabase/migracoes/0001_leads.sql` e preencher `.env.local` com a URL e a chave anônima | Sem isso os formulários funcionam e mandam para o WhatsApp, mas **o lead não é gravado** — quem desistir no meio se perde. Hoje o site avisa isso na tela, em desenvolvimento. | Simulador, contato, páginas de obra |
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
| 3.6 | **Retrato do Carlos Primo Caciamani**, ano em que começou, e uma fala dele em primeira pessoa | Home, /sobre |
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

---

## Já resolvido

- **Logo definida**: é a de fundo marinho, com os prédios em ciano e "CPC CACIAMANI CONSTRUTORA" em âmbar. O tema escuro do site (padrão) foi construído em cima dela: marinho `#0A1826`, ciano `#35C2E3`, âmbar `#F2A81D`. A versão amarela antiga não é mais referência — se ela aparecer em material novo, é engano.
- **Dois renders no ar**, recuperados dos prints do Instagram e limpos: o prédio residencial (hero + card + página da obra) e as duas casas germinadas. Ver 3.2 para os originais em alta.
- **Escopo do painel admin** (decidido na fase 6). Além da base — obras, estatísticas, textos, depoimentos, valores do orçamento, leads com CSV, contatos e cidades — entram três coisas: marcar lead como atendido com anotação, rascunho/publicado com prévia, e aviso de novo lead. Ficaram **de fora** por decisão: diário de obra com link privado, área logada por cliente, origem do lead, upload dedicado para celular, pedido automático de depoimento e agendamento de visita. Todos podem entrar depois.
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
