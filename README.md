# Site da Construtora Caciamani

Site institucional e de captação da **Construtora Caciamani** —
construção e incorporação em Maravilha/SC e região.

O trabalho do site, em uma frase: fazer alguém que nunca ouviu falar da
Caciamani chegar ao WhatsApp já convencido de que essa é a construtora
certa. É por isso que prova (obras reais, antes/depois, números) vem
antes de discurso, e o orçamento existe para converter, não para dar
preço final.

---

## Como rodar

```bash
npm install
cp .env.example .env.local   # e preencha
npm run dev
```

Abre em <http://localhost:3000>.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |

> **Não rode `npm run build` com o `npm run dev` aberto.** Os dois
> escrevem em `.next/` e o servidor de desenvolvimento quebra.

## O que você precisa saber antes de mexer

**Leia o [PENDENCIAS.md](PENDENCIAS.md).** Ele lista tudo o que o site
precisa e ainda não tem. A regra que vale em todo o projeto:

> Nenhum número, nome de obra, depoimento, CNPJ ou endereço é inventado.
> O que falta aparece na tela como `⟨PENDENTE⟩`, de propósito.

Número plausível inventado em site de construtora é passivo legal e
comercial. Se for preencher algo, preencha com o dado real ou não
preencha.

## Como está organizado

```
src/
  app/
    (site)/          páginas públicas (com cabeçalho e rodapé)
    admin/           painel (sem o cromo do site, noindex)
    globals.css      tokens de cor, tipografia e utilitários
  acoes/             Server Actions (leads e painel)
  components/        componentes de interface
  config/orcamento   textos e coeficientes do simulador
  content/           conteúdo em TypeScript — semente e plano B
  lib/               acesso a dados, validação, imagem, utilitários
supabase/migracoes/  SQL para rodar no painel do Supabase
```

### Duas fontes de conteúdo

`src/content/*.ts` é a **semente**. Quando o Supabase está configurado, o
site lê do banco (`src/lib/conteudo.ts`); quando não está, ou quando a
consulta falha, cai na semente. O site nunca fica sem conteúdo por causa
de banco fora do ar.

## O sistema visual

O conceito: **um caderno de obra**. Medidas em fonte técnica, cor da
marca usada como marcação de canteiro.

### Dois temas

O **escuro é o padrão** e sai direto da logo: marinho profundo, o ciano
do desenho dos prédios e o âmbar do logotipo. O **claro** é o caderno de
obra original — cal, concreto, vidro.

Os tokens são **papéis**, não cores literais. Quatro deles existem
separados justamente porque divergem entre os temas:

| Token | Papel | Claro | Escuro |
|---|---|---|---|
| `cal` / `cal-2` | superfície da página | cal | marinho profundo |
| `contraste` | a seção que inverte | quase preto | marinho elevado |
| `sobre-contraste` | tinta sobre essa seção | cal | quase branco |
| `noite` | tinta principal | quase preto | quase branco |
| `concreto` | tinta secundária | cinza | azul-acinzentado |
| `marca` | amarelo / âmbar | #F2B705 | #F2A81D |
| `acento` | ciano — **só no escuro** | cai para o amarelo | #35C2E3 |
| `vidro` | tinta suave sobre contraste | | |
| `oxido` | acento quente, raro | | |

> **`noite` é tinta, `contraste` é superfície.** Antes eram o mesmo
> token, e é por isso que o modo escuro exigiu separá-los: no escuro a
> tinta clareia, mas a superfície de contraste não pode virar branca.
> Se você usar `bg-noite`, o tema escuro fica com um bloco branco no
> meio. Use `bg-contraste` + `text-sobre-contraste`.

**Como a troca funciona:** o Tailwind v4 emite cada cor como variável
CSS e as utilidades referenciam a variável. Reatribuir as mesmas
variáveis sob `:root[data-tema="claro"]` troca o site inteiro sem tocar
em uma classe sequer.

O tema vem do servidor como `escuro`; um script inline no `<head>`
corrige para `claro` antes da primeira pintura, para quem escolheu. É
inline e síncrono de propósito — qualquer coisa assíncrona ali faria a
página piscar.

**Regra dura do amarelo:** ele é *marcação*, não papel de parede. Nunca
é fundo de bloco grande, nunca é cor de texto sobre claro. Preenche
marcas pequenas e recebe texto escuro por cima.

### Movimento

Uma curva só para tudo que entra ou responde ao toque:
`--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)`. Sobe rápido, assenta
devagar — peso baixando, não coisa deslizando.

| Recurso | Onde | Por quê |
|---|---|---|
| `Revelar` | abaixo da dobra | A home é longa e quase toda em texto e dados. A cascata dá ordem de leitura sem seta nem "role para baixo". |
| `Entrada` / `TituloEntrada` | acima da dobra | Anima no carregamento, por CSS. O que já está na tela não espera rolagem — nem hidratação. |
| `.preenche` | botões | O hover é um bloco retangular que **sobe de baixo**, a mesma marcação da cota subindo até a altura da peça. |
| `.sublinha` | menu | Fio de 2px que cresce da esquerda. Mesma gramática do tick da cota. |
| `.traco` | elevação do hero | O desenho técnico se desenhando sobre a obra. Uma vez só. |

**Duas armadilhas que já custaram caro aqui:**

1. **Nada pode depender de JavaScript para ficar visível.** Todo estado
   escondido mora atrás de `html.js`, classe que o script inline põe
   antes da pintura. Sem script, nada some.
2. **Não anime a opacidade do elemento de LCP.** O `h1` do hero é o LCP
   da home; animar a opacidade dele empurrou o LCP de 1,98 s para
   2,72 s. Por isso `.palavra` anima **só o transform** — as palavras
   sobem sem nunca ficar invisíveis.

**Tipografia:** Archivo (títulos), Instrument Sans (corpo), IBM Plex
Mono (**todo número** — m², prazos, valores). Números são cidadãos de
primeira classe neste site; use a classe `.tabular`.

**O elemento assinatura é a "cota"** — a linha de dimensão de um desenho
técnico, que corre na margem e marca cada seção com um tick e um número
real. Está embutida no componente `Secao`: toda seção nasce com ela.

### Contraste

Todo texto passa em AA, e isso foi **medido no navegador**, não
estimado. Alguns tons foram ajustados por causa disso — estão anotados
no `globals.css` com o valor que reprovava. Se mudar uma cor, meça de
novo.

Superfícies escuras recebem a classe `superficie-escura`, que troca as
variáveis do anel de foco e do marcador de pendência. Uma ilha clara
dentro de uma seção escura usa `superficie-clara`.

## Decisões que parecem estranhas mas têm motivo

- **O filtro de obras é link com query string, não estado no cliente.**
  Funciona sem JavaScript, e cada recorte tem URL própria — dá para
  mandar `/obras?tipo=germinada` no WhatsApp. O custo é que `/obras`
  renderiza sob demanda.
- **O mapa da página de contato só carrega no clique.** Um embed do
  Google derrubaria o LCP por causa de algo que quase ninguém usa no
  celular.
- **As fotos são otimizadas no navegador antes de subir** (2000px, WebP).
  As fotos vêm do celular do Carlos com 6 MB. O
  `imageOrientation: "from-image"` evita que foto tirada com o celular
  deitado suba girada.
- **Os coeficientes do orçamento são parâmetro, nunca estado de módulo.**
  Estado global compartilharia valores entre visitantes.
- **O site usa só a chave anônima do Supabase.** A chave de serviço
  ignora RLS e não tem por que existir numa aplicação web.
- **O simulador não estima quando não está calibrado.** Ele diz o que
  falta, em português, e mesmo assim abre o WhatsApp com os dados da
  obra. O lead se qualifica igual.

## Supabase

1. Criar o projeto
2. Rodar, no SQL Editor e nesta ordem:
   `supabase/migracoes/0001_leads.sql`, depois `0002_conteudo.sql`
3. Preencher o `.env.local`
4. Criar o usuário do Carlos em **Authentication › Users › Add user** —
   não existe cadastro aberto no site

O painel fica em `/admin`.

## Como medir de novo

O Lighthouse tem que rodar contra o **build de produção**, nunca contra
o `npm run dev` — no dev nada é minificado e os números não significam
nada.

```bash
npm run build
npx next start -p 3100
```

Em outro terminal:

```bash
npx lighthouse http://localhost:3100/ --form-factor=mobile --view
```

Última medição, em 4 páginas, já com os dois temas e as animações:
Performance 98–99, Acessibilidade 100, Boas Práticas 100, SEO 100,
CLS 0. LCP entre 1,83 s e 2,12 s.

O contraste é medido **nos dois temas**, com o script que compõe as
cores em canvas — `getComputedStyle` sozinho não serve, porque as
opacidades do Tailwind v4 computam como `oklab()` e as transições não
avançam quando a aba não está compondo quadros.

## Acessibilidade

Não é enfeite aqui, é requisito:

- contraste AA em todo texto, medido
- foco de teclado visível em tudo, com a cor trocando por superfície
- `alt` descritivo obrigatório em foto de obra — o painel avisa quando
  falta
- o comparador antes/depois funciona por teclado (`←` `→`, `Home`,
  `End`) e tem `role="slider"` com `aria-valuenow`
- `prefers-reduced-motion` respeitado em toda animação
- hierarquia de títulos sem pulos

## Deploy

Vercel. Configure as variáveis do `.env.example` no painel do projeto e
aponte `NEXT_PUBLIC_SITE_URL` para o domínio definitivo.
