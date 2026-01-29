# RPG Policial (React + Vite + Firebase)

Projeto inicial de um RPG de texto policial com:

- React (Vite)
- Firebase Auth (login com Google)
- Firestore (coleção `/users`)

## Requisitos

- Node.js + npm

## Como rodar

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` a partir do exemplo:

```bash
copy .env.local.example .env
```

Preencha o `.env` com os dados do seu app no Firebase Console.

Depois rode:

```bash
npm run dev
```

## Configuração do Firebase

No Firebase Console:

1. Crie um projeto
2. Ative o **Firestore Database**
3. Ative o **Authentication** e habilite o provedor **Google**
4. Crie um app Web e copie as credenciais para o `.env`

## Estrutura de Dados (Firestore)

Documento em `/users/{uid}`:

- `uid`
- `nome_policial`
- `xp`
- `patente_atual`
- `saldo`
- `status` (`folga` | `patrulha`)
- `username` (único)
- `data_ingresso`

Ao iniciar o app:

- Você faz login com Google
- O documento do usuário é criado automaticamente caso não exista
- Se `username` ainda não estiver definido, o app pede para você escolher um (único)

## Username (único)

Para garantir unicidade, é usada também a coleção:

- `/usernames/{username}` -> `{ uid, createdAt }`

## MVP Patrulha

No Dashboard, o botão **Iniciar Patrulha**:

- muda `status` para `patrulha`
- espera 5s
- adiciona `+50 XP` e `+R$ 100` ao perfil no Firestore
- volta `status` para `folga`
