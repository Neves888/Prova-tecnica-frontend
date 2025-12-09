## Justificativa da Estrutura e Padrões de Código

Esta seção explica por que a árvore de pastas e os padrões de código foram escolhidos, e como o ESLint/Prettier se encaixam no projeto.

 - **Separação lógica de responsabilidades**: o diretório `src/` contém todo o código que precisa ser transpilado/empacotado (componentes, estilos, testes). O `public/` contém ativos estáticos servidos diretamente pelo servidor (útil para Nginx em produção). O backend simples (`back-noticias/`) fica isolado para manter front e back desacoplados.
 - **Testes próximos ao código**: os testes estão em `src/__tests__/` para facilitar manutenção e discovery automático pelo Vitest.
 - **Arquivos de configuração separados**: `vitest.config.ts`, `tsconfig.*.json`, `Dockerfile` e `.dockerignore` mantêm responsabilidades claras (build/test/typecheck/container).

Padrões de Código — por que usar ESLint + Prettier

 - **ESLint**: detecta problemas de qualidade (variáveis não usadas, imports inválidos, uso incorreto de hooks) e aplica regras específicas de TypeScript/React. Instalamos `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks` e `eslint-plugin-jsx-a11y` para cobrir essas áreas.
 - **Prettier**: garante formatação consistente (quebras de linha, aspas, identação). Integra-se com ESLint via `eslint-config-prettier` para evitar conflitos (Prettier cuida da formatação; ESLint das regras semânticas).

Exemplo mínimo de configuração recomendada

1) Arquivo `.eslintrc.cjs` sugerido:

```cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
```

2) Arquivo `.prettierrc` sugerido:

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true
}
```

3) Scripts úteis em `package.json` (sugestão):

```json
"scripts": {
  "lint": "eslint \"src/**/*.{ts,tsx,js,jsx}\"",
  "lint:fix": "eslint \"src/**/*.{ts,tsx,js,jsx}\" --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
}
```

Boas práticas e observações

 - Adicione `husky` + `lint-staged` para rodar `eslint --fix` e `prettier --write` em arquivos staged antes do commit — isso mantém a base consistente sem atrito de revisão.
 - No CI, adicione etapas para rodar `npm run lint` e `npm test` (Vitest) para evitar regressões.
 - Há um conflito de peer-deps entre `@testing-library/react@14.x` (espera React 18) e React 19; por isso usamos `--legacy-peer-deps` na instalação de dev-deps. Documente essa necessidade no README (já registrado) e, quando possível, migre dependências oficiais para versões compatíveis com React 19.
 - Execute `npm audit` e `npm audit fix` regularmente; revise `npm audit fix --force` antes de usá-lo, pois pode introduzir breaking changes.

Se quiser, eu posso gerar os arquivos de configuração (`.eslintrc.cjs`, `.prettierrc`, `.eslintignore`) e adicionar os scripts sugeridos em `package.json` — sem fazer commits. Deseja que eu gere esses arquivos agora? 
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
```
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
