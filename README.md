# Tech One - Angular 21 + Tailwind + PWA

Projeto gerado a partir das telas do PDF `Tech One_projeto.pdf`.

## O que foi implementado

- Angular 21 com componentes standalone.
- Tailwind CSS 4 via PostCSS.
- PWA com `@angular/service-worker`, `manifest.webmanifest`, ícones e `ngsw-config.json`.
- Layout mobile-first, responsivo para celular e navegador.
- Signals com `signal`, `computed` e store simples em memória.
- Nova sintaxe de controle de fluxo Angular: `@if`, `@else`, `@for` e `@empty`.
- Telas principais:
  - Login
  - Recuperação de senha em 3 etapas
  - Perfil/Menu
  - Lista de OS
  - Detalhe da OS
  - Criar/Editar OS
  - Selecionar técnico
  - Iniciar/Encerrar OS
  - Lista de usuários
  - Adicionar/Editar usuário
  - Modal de exclusão de OS e usuário

## Como executar

```bash
npm install
npm start
```

Acesse:

```text
http://localhost:4200
```

## Como gerar build PWA

```bash
npm run build
```

Depois sirva a pasta gerada em `dist/tech-one-angular-21/browser` com um servidor HTTP. O service worker só funciona em build de produção e em `localhost` ou HTTPS.

Exemplo:

```bash
npx http-server dist/tech-one-angular-21/browser -p 8080
```

## Rotas úteis

- `/login`
- `/recuperar-senha`
- `/perfil`
- `/ordens`
- `/ordens/abertas`
- `/ordens/historico`
- `/ordens/nova`
- `/ordens/30021`
- `/usuarios`
- `/usuarios/novo`

## Observação

Os dados estão mockados em `src/app/core/app-store.service.ts`. Para conectar com backend, substitua as operações do store por chamadas HTTP.

## Revisão de layout responsivo

A versão atual ajusta o comportamento para desktop e mobile:

- No navegador, as telas usam um container largo (`max-width: 1180px`) em vez de simular somente uma tela de celular.
- No celular, o mesmo container ocupa 100% da viewport.
- As listagens de OS e usuários têm rolagem interna no bloco da lista (`list-scroll`).
- O `body` não faz scroll geral; a rolagem fica concentrada na área da lista.
- Os cards de listagem foram organizados com espaçamento (`gap`) e grid responsivo no desktop.

## Revisão de layout web/mobile

Ajustes desta versão:

- Login refeito com classes CSS próprias para evitar quebra visual caso o Tailwind não processe alguma classe utilitária.
- Layout web separado do layout mobile.
- No desktop, as telas usam container amplo e grid responsivo.
- No mobile/tablet, o layout fica em formato de tela de aplicativo, seguindo a proposta das telas do PDF.
- Listagens de OS e Usuários usam scroll interno no componente da lista, não no `body`.
- Menu de Perfil fica vertical no mobile e em grid apenas no layout web.
