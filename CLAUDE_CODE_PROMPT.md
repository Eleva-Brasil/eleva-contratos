Tenho um projeto React + Vite pronto na pasta atual (bi-eleva/) — um dashboard de BI
chamado "Painel de Contratos — Eleva Brasil", com 5 abas (Sintética, Analítica,
Vendedor x Categoria, Região/Estado/Cidade, Dados Tratados) e um botão para atualizar
os dados subindo um .xlsx direto pelo navegador. Quero publicar isso no GitHub Pages.

Por favor:

1. Rode `npm install` e depois `npm run build` para confirmar que o projeto builda
   sem erros. Se der algum erro, corrija antes de continuar.

2. Inicialize um repositório git nesta pasta (se ainda não existir), faça o commit
   inicial de tudo (respeitando o .gitignore que já existe, não commitar node_modules
   nem dist/).

3. Crie um repositório novo no GitHub para mim (pergunte o nome que eu quero usar, ou
   sugira "bi-eleva-contratos" se eu não responder) e faça o push da branch main.

4. Configure o GitHub Pages desse repositório para usar "GitHub Actions" como fonte de
   build (o workflow já existe em .github/workflows/deploy.yml, só falta ativar nas
   configurações do repo — Settings > Pages > Build and deployment > Source).

5. Depois que o Actions rodar com sucesso, me diga qual é a URL final do site
   (formato https://MEU_USUARIO.github.io/NOME_DO_REPO/) e confirme que abre
   corretamente, inclusive testando que as 5 abas carregam com dados.

6. Me avise se precisar de alguma permissão minha (autenticação no GitHub CLI, etc)
   antes de continuar em qualquer etapa que grave ou publique algo.

Contexto técnico que pode ajudar:
- vite.config.js já está configurado com `base: './'` (paths relativos), então funciona
  em qualquer nome de repositório sem precisar editar nada.
- Os dados ficam embutidos em src/data/*.json (não tem backend/API).
- Existe um botão "Atualizar dados (.xlsx)" no site que processa planilha nova
  100% no navegador (usa a lib xlsx/SheetJS) e guarda em localStorage — isso só
  atualiza a visão de quem fez o upload, não publica pra todo mundo. Para atualizar
  os dados publicados (visíveis a todos), é preciso regenerar os JSONs em src/data/
  e dar push — não precisa alterar isso agora, só saber que existe.
- README.md do projeto já tem o passo a passo completo, pode usar como referência.
