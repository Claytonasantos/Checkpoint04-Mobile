# CP5 Mobile — Meus Registros

Aplicativo mobile desenvolvido com [Expo](https://expo.dev) e [Expo Router](https://docs.expo.dev/router/introduction), com autenticação via **Firebase Authentication** e armazenamento de dados no **Cloud Firestore**.

## Integrantes

- Clayton Alves dos Santos — RM: 562285
- Guilherme Sola Garcia — RM: 563674

## Tema do aplicativo

**Gerenciador de registros pessoais**: cada usuário autenticado cadastra e organiza os próprios registros (tarefas/anotações) com título, descrição, categoria e prioridade.

## Descrição do projeto

O aplicativo permite que o usuário crie uma conta, faça login e gerencie seus registros pessoais com um CRUD completo no Cloud Firestore. Os dados de cada usuário ficam isolados pelo UID do Firebase Authentication, e as regras de segurança do Firestore impedem que um usuário leia ou altere os registros de outro.

### Funcionalidades

- Cadastro de usuário, login e recuperação de senha (Firebase Authentication)
- Persistência da sessão: o usuário continua autenticado após fechar e reabrir o app (AsyncStorage)
- Rotas protegidas: telas internas só podem ser acessadas por usuários autenticados
- **Cadastro** de registros (título, descrição, categoria e prioridade Baixa/Média/Alta)
- **Consulta/listagem** dos registros em tempo real, ordenados pelos mais recentes
- **Atualização** de registros
- **Exclusão** de registros com confirmação
- Isolamento dos dados entre usuários
- Validação dos campos no app e nas regras do Firestore
- Tela "Minha conta" com logout e exclusão de conta

## Vídeo de demonstração

[Assista no YouTube](https://youtube.com/shorts/C2LqjjaNerE)

## Tecnologias utilizadas

- [Expo](https://expo.dev) SDK 57
- [Expo Router](https://docs.expo.dev/router/introduction) (rotas baseadas em arquivos e `Stack.Protected`)
- [React Native](https://reactnative.dev) 0.86 / React 19
- TypeScript
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (persistência da sessão)

## Estrutura do Firestore

Os registros ficam em uma subcoleção dentro do documento de cada usuário, identificado pelo UID:

```
usuarios                      (coleção)
└── {uid}                     (documento — UID do usuário autenticado)
    └── registros             (subcoleção)
        └── {registroId}      (documento — ID gerado automaticamente)
            ├── titulo        string   (obrigatório, até 100 caracteres)
            ├── descricao     string   (obrigatório, até 500 caracteres)
            ├── categoria     string   (obrigatório, até 50 caracteres)
            ├── prioridade    string   ("Baixa" | "Média" | "Alta")
            ├── uid           string   (UID do dono do registro)
            ├── criadoEm      timestamp
            └── atualizadoEm  timestamp
```

### Regras de segurança

As regras estão em [`firestore.rules`](./firestore.rules):

- Só usuários autenticados acessam dados, e apenas dentro de `usuarios/{seu próprio uid}/registros`.
- Na criação e na atualização, só os campos esperados são aceitos e validados (tipo, tamanho e prioridade válida).
- Não é possível trocar o dono (`uid`) nem a data de criação (`criadoEm`) de um registro.
- Qualquer outro caminho do banco fica bloqueado.

## Estrutura do projeto

```
app/
  _layout.tsx             # layout raiz e proteção das rotas
  index.tsx               # tela de login
  cadastro.tsx            # cadastro de usuário
  recuperar.tsx           # recuperação de senha
  home.tsx                # minha conta (logout / exclusão de conta)
  registros/
    index.tsx             # listagem e exclusão de registros
    formulario.tsx        # cadastro e edição de registros
components/               # Campo e Botao reutilizáveis
constants/cores.ts        # paleta de cores do tema
contexts/AuthContext.tsx  # sessão do usuário (onAuthStateChanged)
services/
  firebaseConfig.ts       # Firebase (Auth + Firestore)
  registros.ts            # CRUD de registros no Firestore
utils/mensagens.ts        # alertas/confirmações (mobile e web)
firestore.rules           # regras de segurança do Firestore
```

## Instalação

Pré-requisitos:

- [Node.js](https://nodejs.org) (LTS)
- [Git](https://git-scm.com)
- App [Expo Go](https://expo.dev/go) no celular (Android/iOS), ou um emulador

1. Clone o repositório:

   ```bash
   git clone https://github.com/Claytonasantos/Checkpoint04-Mobile.git
   cd Checkpoint04-Mobile
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

O projeto já vem configurado com o Firebase do grupo em `services/firebaseConfig.ts`. Para usar outro projeto Firebase, substitua as credenciais nesse arquivo, habilite **Authentication (E-mail/senha)** e **Cloud Firestore** no console e publique as regras de `firestore.rules`.

## Execução

1. Inicie o servidor do Expo:

   ```bash
   npx expo start
   ```

2. Escolha onde rodar:
   - **Celular:** escaneie o QR code com o Expo Go (Android) ou com a câmera (iOS)
   - **Android:** pressione `a` (emulador) — ou `npm run android`
   - **iOS:** pressione `i` (simulador, somente macOS) — ou `npm run ios`
   - **Web:** pressione `w` — ou `npm run web`

## Licença

Este projeto está sob a licença presente no arquivo [LICENSE](./LICENSE).
