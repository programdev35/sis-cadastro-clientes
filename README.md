# Sistema de Cadastro de Clientes

## Descrição

Este é um sistema web para cadastro e gerenciamento de clientes, desenvolvido com React, Vite e TypeScript. O projeto utiliza componentes Shadcn UI e está configurado para deploy na Vercel.

## Funcionalidades

### Gestão de Clientes
- Cadastro completo de clientes com:
  - Informações pessoais (nome, CPF, RG)
  - Contatos (telefone, e-mail)
  - Endereço (rua, número, complemento, bairro, cidade, estado, CEP)
  - Data de cadastro
  - Observações

### Interface do Usuário
- Interface moderna e responsiva com tema claro/escuro
- Lista de clientes com filtros e ordenação
- Formulário de cadastro/editar com validação
- Sistema de notificações
- Autenticação de usuários

### Características Técnicas
- Validação de dados em tempo real
- Máscaras para telefone e CEP
- Integração com API de CEP
- Sistema de autenticação
- Armazenamento em banco de dados
- Suporte a múltiplos usuários

## Tecnologias

- React
- TypeScript
- Vite
- Shadcn UI
- Radix UI
- Tailwind CSS

## Configuração do Projeto

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn
- Conta na Vercel para deploy

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
```

2. Instale as dependências:
```bash
npm install
```

### Desenvolvimento Local

Para rodar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado na porta 8080 (http://localhost:8080).

### Build

Para criar uma versão de produção do projeto:

```bash
npm run build
```

### Deploy na Vercel

1. Faça o login na Vercel (https://vercel.com)
2. Conecte seu repositório GitHub/Bitbucket
3. A Vercel detectará automaticamente as configurações do projeto e iniciará o deploy
4. Monitore o progresso do deploy no dashboard da Vercel

## Estrutura do Projeto

```
src/
├── components/    # Componentes React
├── pages/         # Páginas da aplicação
├── styles/        # Estilos globais
└── utils/        # Funções utilitárias
```

## Configurações

### Vercel

O arquivo `vercel.json` está configurado com:
- Build usando `@vercel/static-build`
- Configurações de reescrita de rotas
- Headers de segurança
- Ambiente de produção

### Vite

O arquivo `vite.config.ts` está configurado com:
- Suporte a TypeScript
- Plugins React
- Aliases de importação
- Configurações de desenvolvimento

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Suporte

Para suporte ou dúvidas, abra uma issue no repositório ou entre em contato pelo email: [seu-email@dominio.com]

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e46708a8-f212-413c-a289-e28c04d3538a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
