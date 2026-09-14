# CP4 Mobile

Aplicativo mobile desenvolvido com [Expo](https://expo.dev) e [Expo Router](https://docs.expo.dev/router/introduction), com autenticação via [Firebase](https://firebase.google.com/).

## Integrantes

- Clayton Alves dos Santos — RM: 562285
- Guilherme Sola Garcia — RM: 563674

## Vídeo de demonstração

[Assista no YouTube](https://youtube.com/shorts/sv6uX3HzGqs?feature=share)

## Funcionalidades

- Login com e-mail e senha
- Cadastro de novo usuário
- Recuperação de senha
- Tela autenticada (Home) com logout e exclusão de conta

## Tecnologias

- [Expo](https://expo.dev) ~57
- [Expo Router](https://docs.expo.dev/router/introduction) (rotas baseadas em arquivos)
- [React Native](https://reactnative.dev)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- TypeScript

## Estrutura do projeto

```
app/
  _layout.tsx      # layout raiz das rotas
  index.tsx         # tela de login
  cadastro.tsx       # tela de cadastro
  recuperar.tsx       # recuperação de senha
  home.tsx            # tela autenticada
components/
  Campo.tsx           # componente de input reutilizável
  Botao.tsx           # componente de botão reutilizável
constants/
  cores.ts            # paleta de cores do tema
services/
  firebaseConfig.ts   # configuração do Firebase
```

## Como rodar o projeto

1. Instale as dependências

   ```bash
   npm install
   ```

2. Inicie o projeto

   ```bash
   npx expo start
   ```

3. No terminal, escaneie o QR code com o app [Expo Go](https://expo.dev/go) (Android/iOS), ou escolha rodar em emulador Android, simulador iOS ou navegador.

## Requisitos

- Node.js
- App Expo Go instalado no celular (para testar via QR code)

## Licença

Este projeto está sob a licença presente no arquivo [LICENSE](./LICENSE).
