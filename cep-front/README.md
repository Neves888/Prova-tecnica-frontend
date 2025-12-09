# Busca de CEP

Aplicação React para busca de endereços por meio da API ViaCEP.

## 📋 Índice

- [Requisitos](#requisitos)
- [Instalação Local](#instalação-local)
- [Executar Localmente](#executar-localmente)
- [Testes](#testes)
- [Docker](#docker)
- [Tecnologias](#tecnologias)

## 🔧 Requisitos

### Execução Local
- Node.js 18+ 
- npm 9+

### Execução com Docker
- Docker 20+
- Docker Compose (opcional)

## 📦 Instalação Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd front/cep-front
```

2. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

**Nota:** O flag `--legacy-peer-deps` é necessário devido ao React 19 que ainda não tem compatibilidade completa com algumas bibliotecas de teste.

## 🚀 Executar Localmente

### Modo Desenvolvimento

Inicia o servidor de desenvolvimento com hot reload na porta 5173:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Build de Produção

Compila a aplicação para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

Visualize a versão de produção localmente:

```bash
npm run preview
```

## 🧪 Testes

A aplicação utiliza Vitest com Testing Library para testes BDD.

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm test -- --watch
```

### Executar testes com cobertura

```bash
npm test -- --coverage
```

### Estrutura dos Testes

Os testes estão localizados em `src/__tests__/` e seguem a metodologia BDD:

- `buscaCep.test.tsx`: Testa a busca de CEPs de Brasília (válidos e inválidos)

## 🐳 Docker

### Build da Imagem

Construa a imagem Docker (multi-stage otimizada):

```bash
docker build -t cep-front:latest .
```

O Dockerfile utiliza duas etapas:
1. **Build**: Node.js 18 Alpine para compilar a aplicação
2. **Produção**: Nginx Alpine para servir os arquivos estáticos

### Executar Container

Execute o container mapeando a porta 8080:

```bash
docker run -d -p 8080:80 --name cep-front-container cep-front:latest
```

Acesse: `http://localhost:8080`

### Verificar Status do Container

```bash
docker ps --filter name=cep-front-container
```

### Ver Logs do Container

```bash
docker logs cep-front-container
```

### Parar o Container

```bash
docker stop cep-front-container
```

### Remover o Container

```bash
docker rm cep-front-container
```

### Remover a Imagem

```bash
docker rmi cep-front:latest
```

## 🛠️ Tecnologias

### Core
- **React** 19.2.0 - Biblioteca para interfaces
- **TypeScript** 5.9.3 - Tipagem estática
- **Vite** 7.2.4 - Build tool e dev server

### Requisições HTTP
- **Axios** 1.5.0 - Cliente HTTP para API ViaCEP

### Testes
- **Vitest** 0.34.1 - Framework de testes
- **Testing Library** 14.0.0 - Utilitários para testes React
- **jsdom** 27.3.0 - Ambiente DOM para testes

### Containerização
- **Docker** - Multi-stage build
- **Nginx Alpine** - Servidor web para produção

## 📝 Funcionalidades

- ✅ Busca de endereço por CEP usando API ViaCEP
- ✅ Formatação automática do CEP (00000-000)
- ✅ Estados de carregamento (loading states)
- ✅ Tratamento de erros (timeout, CEP inválido)
- ✅ Design responsivo (mobile-first)
- ✅ Acessibilidade (aria-live regions)
- ✅ Testes BDD com casos reais de Brasília

## 🌐 API Utilizada

**ViaCEP**: Serviço gratuito de consulta de CEPs brasileiros

- Endpoint: `https://viacep.com.br/ws/{cep}/json/`
- Documentação: https://viacep.com.br

## 📄 Estrutura do Projeto

```
cep-front/
├── public/              # Arquivos estáticos
├── src/
│   ├── __tests__/       # Testes BDD
│   ├── assets/          # Imagens e recursos
│   ├── App.tsx          # Componente principal
│   ├── App.css          # Estilos da aplicação
│   ├── main.tsx         # Entry point
│   └── setupTests.ts    # Configuração dos testes
├── Dockerfile           # Multi-stage build
├── .dockerignore        # Arquivos ignorados no build
├── vitest.config.ts     # Configuração do Vitest
└── package.json         # Dependências e scripts
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
