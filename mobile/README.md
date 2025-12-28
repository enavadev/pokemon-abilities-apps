# Pokemons Mobile App

Aplicação mobile Android desenvolvida com React Native, Expo e React Native Paper.

## Tecnologias

- React Native com Expo ~49.0.0
- TypeScript
- React Native Paper 5.14.5
- React Navigation
- Axios
- AsyncStorage

## Configuração

### Arquivo de Configuração

O arquivo `config.json` na raiz do projeto contém a URL da API:

```json
{
  "apiUrl": "http://localhost:18081"
}
```

**Importante**: Para testar no dispositivo físico ou emulador, altere `localhost` para o IP da sua máquina (ex: `http://192.168.1.100:18081`).

## Instalação

```bash
cd mobile
npm install
```

## Execução

### Opção 1: Expo Go (Desenvolvimento Rápido)

1. Instale o Expo Go no seu smartphone Android
2. Execute o projeto:
```bash
npm start
```
3. Escaneie o QR code com o Expo Go

**Nota**: Para usar Expo Go, dispositivo e computador devem estar na mesma rede Wi-Fi.

### Opção 2: Emulador Android

1. Inicie um emulador Android no Android Studio
2. Configure `config.json` com `"apiUrl": "http://10.0.2.2:18081"`
3. Execute:
```bash
npm run android
```

### Opção 3: Dispositivo Físico (USB)

1. Conecte o dispositivo via USB
2. Habilite USB Debugging no dispositivo
3. Configure `config.json` com o IP local da sua máquina (ex: `"apiUrl": "http://192.168.1.100:18081"`)
4. Execute:
```bash
npm run android:device
```

**Para instruções detalhadas, consulte [SETUP.md](./SETUP.md)**

## Funcionalidades

- Tela de login com autenticação JWT
- Header com título e botão de logout
- Busca de Pokemons por nome
- Lista de Pokemons com paginação (20 itens por página)
- Pull to refresh
- Modal de habilidades do Pokemon
- Navegação entre telas
- Armazenamento local de token e usuário

## Estrutura do Projeto

```
mobile/
├── src/
│   ├── config/          # Configurações (API URL)
│   ├── contexts/         # Context API (Auth)
│   ├── screens/          # Telas da aplicação
│   ├── services/         # Serviços de API
│   └── theme.ts          # Tema do React Native Paper
├── config.json           # Configuração da URL da API
├── App.tsx              # Componente principal
└── package.json
```

