# Pokemons e suas Habilidades

Aplicação full-stack para consultar lista de Pokemons e suas habilidades.

## Estrutura do Projeto

```
pokemons-app/
├── back-end/          # API NestJS
├── front-end/         # Aplicação React + Vite
├── mobile/            # Aplicação React Native + Expo
└── docker-compose.yml # Orquestração dos serviços
```

## Tecnologias

### Back-end
- NestJS com TypeScript
- JWT para autenticação
- Redis para cache
- Integração com PokeAPI
- Arquitetura DDD e Clean Architecture
- Configuração via arquivo YAML

### Front-end
- React 18 com TypeScript
- Vite
- Chakra UI
- Axios
- React Router

### Mobile (Android)
- React Native com Expo ~49.0.0
- TypeScript
- React Native Paper 5.14.5
- React Navigation
- Axios
- AsyncStorage

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

## Como executar

### Usando Docker Compose (Recomendado)

1. Na raiz do projeto, execute:
```bash
docker-compose up --build
```

2. Acesse a aplicação:
   - Front-end: http://localhost:18080
   - Back-end API: http://localhost:18081
   - Documentação Swagger: http://localhost:18081/api/docs

### Credenciais de Login

- Usuário: `teste`
- Senha: `teste`

## Configuração

### Arquivo de Configuração YAML

O back-end utiliza um arquivo `config.yaml` na raiz do diretório `back-end/` para configurações:

```yaml
pokeapi:
  baseUrl: https://pokeapi.co/api/v2
  timeout: 10000

redis:
  host: localhost
  port: 6379
```

**Prioridade de configuração:**
1. Variáveis de ambiente (maior prioridade)
2. Arquivo `config.yaml`
3. Valores padrão

**Variáveis de ambiente disponíveis:**
- `POKEAPI_BASE_URL` - URL base da PokeAPI
- `POKEAPI_TIMEOUT` - Timeout das requisições (ms)
- `REDIS_HOST` - Host do Redis
- `REDIS_PORT` - Porta do Redis

## Desenvolvimento Local

### Back-end

```bash
cd back-end
npm install
npm run start:dev
```

### Front-end

```bash
cd front-end
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npm start
```

Para mais detalhes sobre o app mobile, consulte o [README do mobile](./mobile/README.md).

## Estrutura de Rotas da API

### Documentação Swagger
A API possui documentação completa no Swagger UI:
- **URL**: http://localhost:18081/api/docs
- A documentação inclui todas as rotas, parâmetros, exemplos de requisição e resposta
- É possível testar as rotas diretamente pela interface do Swagger

### Autenticação
- `POST /api/v1/auth` - Login (público)

### Pokemons
- `GET /api/v1/pokemon?page=1&totalperpage=10&p=search` - Listar pokemons (requer autenticação)
- `GET /api/v1/pokemon/ability?name=pikachu` - Obter habilidades (requer autenticação)

## Funcionalidades

- Autenticação JWT
- Busca de Pokemons com paginação
- Cache em Redis (TTL de 5 dias)
- Visualização de habilidades do Pokemon
- Interface responsiva com Chakra UI

