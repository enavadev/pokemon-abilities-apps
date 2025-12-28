# Guia de Configuração e Execução - Mobile

Este guia explica como executar o app mobile no emulador Android ou em um dispositivo físico via cabo USB.

## Pré-requisitos

### Para Emulador Android
1. **Android Studio** instalado
2. **Android SDK** configurado
3. **Emulador Android** criado e configurado
4. **Node.js** 18+ instalado

### Para Dispositivo Físico (USB)
1. **Dispositivo Android** com USB Debugging habilitado
2. **Drivers USB** do dispositivo instalados (geralmente automático)
3. **ADB** (Android Debug Bridge) configurado
4. **Node.js** 18+ instalado

## Configuração Inicial

### 1. Instalar Dependências

```bash
cd pokemons-app/mobile
npm install
```

### 2. Configurar URL da API

Edite o arquivo `config.json` na raiz do projeto mobile:

```json
{
  "apiUrl": "http://SEU_IP_LOCAL:18081"
}
```

**Importante**: 
- Para emulador Android: use `http://10.0.2.2:18081` (IP especial do emulador)
- Para dispositivo físico: use o IP da sua máquina na rede local (ex: `http://192.168.1.100:18081`)

Para descobrir seu IP local:
- **Windows**: `ipconfig` (procure por IPv4)
- **Linux/Mac**: `ifconfig` ou `ip addr`

## Executando no Emulador Android

### Passo 1: Iniciar o Emulador

1. Abra o **Android Studio**
2. Vá em **Tools > Device Manager**
3. Clique em **Play** no emulador desejado
4. Aguarde o emulador iniciar completamente

### Passo 2: Verificar Conexão ADB

```bash
adb devices
```

Você deve ver algo como:
```
List of devices attached
emulator-5554   device
```

### Passo 3: Executar o App

```bash
npm run android
```

Ou:

```bash
npx expo start --android
```

O Expo irá:
1. Iniciar o servidor de desenvolvimento
2. Detectar o emulador
3. Compilar e instalar o app automaticamente

## Executando em Dispositivo Físico (USB)

### Passo 1: Habilitar USB Debugging

1. No seu dispositivo Android, vá em **Configurações > Sobre o telefone**
2. Toque 7 vezes em **Número da versão** para ativar o modo desenvolvedor
3. Volte para **Configurações > Opções do desenvolvedor**
4. Ative **Depuração USB**
5. Conecte o dispositivo via USB ao computador

### Passo 2: Autorizar o Computador

1. Quando conectar o USB, aparecerá um popup no dispositivo
2. Marque **Sempre permitir deste computador**
3. Toque em **Permitir**

### Passo 3: Verificar Conexão ADB

```bash
adb devices
```

Você deve ver algo como:
```
List of devices attached
ABC123XYZ    device
```

Se aparecer "unauthorized", desconecte e reconecte o USB, autorizando novamente.

### Passo 4: Configurar IP da API

Edite `config.json` com o IP da sua máquina na rede local:

```json
{
  "apiUrl": "http://192.168.1.100:18081"
}
```

### Passo 5: Executar o App

```bash
npm run android:device
```

Ou:

```bash
npx expo start --android --device
```

O Expo irá:
1. Iniciar o servidor de desenvolvimento
2. Detectar o dispositivo conectado
3. Compilar e instalar o app automaticamente

## Solução de Problemas

### Emulador não detectado

```bash
# Verificar se o emulador está rodando
adb devices

# Reiniciar o servidor ADB
adb kill-server
adb start-server
```

### Dispositivo não detectado

1. Verifique se o USB Debugging está ativado
2. Tente outra porta USB
3. Reinstale os drivers USB do dispositivo
4. Reinicie o ADB:
```bash
adb kill-server
adb start-server
```

### Erro de conexão com a API

1. **Emulador**: Certifique-se de usar `http://10.0.2.2:18081`
2. **Dispositivo físico**: 
   - Use o IP local da sua máquina
   - Certifique-se de que o dispositivo e o computador estão na mesma rede Wi-Fi
   - Verifique se o firewall não está bloqueando a porta 18081

### Limpar cache do Expo

```bash
npm run start:clear
```

### Reinstalar dependências

```bash
rm -rf node_modules
npm install
```

## Comandos Úteis

```bash
# Iniciar normalmente
npm start

# Iniciar com cache limpo
npm run start:clear

# Executar no Android (emulador ou dispositivo)
npm run android

# Executar apenas em dispositivo físico
npm run android:device

# Verificar dispositivos conectados
adb devices

# Ver logs do dispositivo
adb logcat

# Reiniciar servidor ADB
adb kill-server && adb start-server
```

## Notas Importantes

1. **Primeira execução**: Pode demorar alguns minutos para compilar
2. **Hot Reload**: Alterações no código são refletidas automaticamente
3. **Backend**: Certifique-se de que o backend está rodando na porta 18081
4. **Rede**: Dispositivo físico e computador devem estar na mesma rede Wi-Fi para acessar a API




