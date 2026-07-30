# BI Eleva — Painel de Contratos

Dashboard interativo (React + Vite) com todas as abas da planilha de análise de contratos:
**Sintética**, **Analítica**, **Vendedor × Categoria**, **Região/Estado/Cidade** e **Dados Tratados**.

Site estático, sem backend — os dados ficam embutidos em `src/data/*.json` e tudo roda no navegador
(inclusive celular). Pronto para publicar no GitHub Pages.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview   # testa o build localmente antes de publicar
```

O build gera a pasta `dist/` — é isso que vai pro ar.

## Publicar no GitHub Pages (automático)

Este repositório já vem com um workflow do GitHub Actions em
`.github/workflows/deploy.yml` que builda e publica a cada push na branch `main`.

**Passo a passo (peça ao Claude Code para fazer isso, ou faça manualmente):**

1. Crie um repositório novo no GitHub (pode ser público ou privado).
2. Suba este projeto:
   ```bash
   git init
   git add .
   git commit -m "Painel de contratos Eleva Brasil"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages** e em "Build and deployment" escolha
   **Source: GitHub Actions** (não escolher "branch" — o workflow já cuida disso).
4. Aguarde o Actions rodar (aba "Actions" do repositório). Quando o job `deploy` terminar,
   o link fica disponível em:
   ```
   https://SEU_USUARIO.github.io/SEU_REPO/
   ```
5. Pronto — esse link funciona em qualquer navegador, celular incluso, sem precisar de login.

Qualquer novo `git push` na branch `main` atualiza o site automaticamente.

## Atualizando os dados

Existem duas formas de atualizar os dados do painel:

### 1. Pelo próprio site (sem precisar mexer em código) — recomendado no dia a dia

O painel tem um botão **"Atualizar dados (.xlsx)"** no topo. Basta selecionar a planilha
atualizada (mesmas colunas de `Contratos_atualizados_-_2026.xlsx`: Nome do parceiro de negócios,
Cód. Contrato, N.Serie, Cód. Modelo, Modelo, Tipo Modelo, Apelido, Valor da Locação,
Valor de Serviço, Endereço de Entrega, Vendedor) que o navegador processa tudo localmente
(exclusão de linhas em branco/sem Nº de série, normalização de cidade, cálculo de
Equipamentos + Operadores, agregações por vendedor/categoria/região) e atualiza todas as abas
na hora — sem precisar de servidor, API ou rebuild.

**Importante — limitação sem backend:** como não há API/servidor, esse upload fica salvo
apenas no navegador de quem subiu o arquivo (`localStorage`), igual um "modo offline". Se você
abrir o link em outro computador/celular, ou pedir para outra pessoa acessar, ela ainda vai ver
a base publicada no build (a mais recente que foi enviada ao GitHub). Para que a atualização
apareça **para todo mundo** que acessa o link, é preciso publicar os dados no repositório
(opção 2 abaixo). O botão "Restaurar base original" limpa o `localStorage` e volta pros dados
publicados.

### 2. Publicando a atualização para todo mundo

Quando quiser que a planilha nova valha para todos os visitantes do link, regenere os três
arquivos JSON em `src/data/` (`summary.json`, `analitica.json`, `dadosTratados.json`) mantendo
o mesmo formato, e dê `git push` — o GitHub Actions builda e publica sozinho. Não precisa
mexer em nenhum componente React, eles já leem os dados desses arquivos.

## Estrutura do projeto

```
src/
  data/
    summary.json        # Sintética, Vendedor x Categoria, Região/Estado/Cidade (agregados)
    analitica.json       # Analítica — 1 linha por equipamento/contrato
    dadosTratados.json   # Dados Tratados — base completa limpa
  components/
    KpiStrip.jsx          # Cartões de KPI no topo
    TabSintetica.jsx       # Ranking de vendedores + donut de participação
    TabAnalitica.jsx        # Detalhamento por equipamento (filtro por vendedor + busca)
    TabCategoria.jsx        # Heatmap Vendedor x Categoria
    TabGeografia.jsx         # Sub-abas Região / Estado / Cidade
    TabDados.jsx              # Base bruta completa com busca
    UploadPanel.jsx            # Botão de atualizar planilha (.xlsx) direto no navegador
    Donut.jsx / BarChart.jsx / SortableTable.jsx   # componentes visuais reutilizáveis
  parseContracts.js       # parser client-side (SheetJS) — mesma lógica do processamento Python
  App.jsx                # navegação entre as 5 abas
  styles.css              # tema visual (dark industrial, sem dependências externas de CSS)
  main.jsx                # entrada React
vite.config.js            # base: './' — funciona em qualquer nome de repositório no GH Pages
```

## Metodologia dos dados (igual à planilha)

- Linhas em branco e sem Nº de série foram excluídas da base.
- Faturamento = **Equipamentos + Operadores** apenas (Frete e Adicional não entram).
- Nomes de cidade com variação de grafia/acentuação foram normalizados
  (ex.: São Paulo / Sao Paulo / São Pualo → São Paulo).

## O que pedir ao Claude Code

Se você está entregando este projeto para o Claude Code continuar, sugestões de próximos passos:

- Rodar `npm install && npm run build` para validar que builda sem erros.
- Criar o repositório no GitHub e fazer o push inicial (comandos acima).
- Ativar GitHub Pages com "Source: GitHub Actions" nas configurações do repo.
- Opcional: trocar a paleta de cores em `src/styles.css` (variáveis `:root`), adicionar
  autenticação simples caso o link não deva ser 100% público, ou plugar os dados a uma API
  em vez dos arquivos JSON estáticos, se a planilha passar a atualizar com mais frequência.
