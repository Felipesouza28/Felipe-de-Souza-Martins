# Felipe de Souza Martins — Portfólio

Portfólio pessoal de desenvolvimento web, publicado com GitHub Pages.

## Tecnologias
- HTML
- CSS
- JavaScript

## Projetos
- [ClimaGestão](https://felipesouza28.github.io/Painel-de-Controle-Dashboard-/)
- [Itechub](https://felipesouza28.github.io/Itechub_/)
- [MatchBook](https://felipesouza28.github.io/match_book/)

## Publicação automática
O workflow em `.github/workflows/pages.yml` reconstrói o pacote de arquivos estáticos e publica no GitHub Pages a cada atualização da branch `main`.

O código-fonte do site está empacotado em `portfolio-source/part-*.b64`; o workflow concatena as partes, extrai o arquivo e publica os arquivos estáticos. O formulário de contato usa `mailto:` e não depende de backend.

## Ativação inicial
No repositório, abra **Settings → Pages** e selecione **GitHub Actions** em **Build and deployment → Source**. Depois disso, cada commit na branch `main` dispara a publicação.
