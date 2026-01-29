# Deploy do Police RPG

Este guia explica como fazer o deploy do Police RPG usando Cloudflare Workers.

## Pré-requisitos

1. **Conta Cloudflare**: Crie uma conta em https://cloudflare.com
2. **Wrangler CLI**: Instale com `npm install -g wrangler`
3. **Login no Wrangler**: Execute `wrangler login`

## Configuração do Firebase

1. Crie um projeto no Firebase Console
2. Ative Authentication (Google/Email)
3. Crie Firestore Database
4. Copie as configurações para o arquivo `.env`

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=sua_app_id
```

## Scripts de Deploy

### Deploy de Desenvolvimento
```bash
npm run deploy
```

### Deploy de Staging
```bash
npm run deploy:staging
```

### Deploy de Produção
```bash
npm run deploy:prod
```

## Configuração do Wrangler

O arquivo `wrangler.toml` já está configurado com:

- **Ambientes**: production, staging, development
- **Build command**: `npm run build`
- **Compatibilidade**: React 19 + Vite
- **Limites**: CPU de 50ms por requisição

## Arquivos de Som

Antes do deploy, adicione os arquivos de áudio em `public/sounds/`:

- `radio-beep.mp3`
- `success.mp3`
- `purchase.mp3`
- `error.mp3`

Siga as instruções em `public/sounds/README.md`

## Verificação Antes do Deploy

1. **Testar localmente**: `npm run dev`
2. **Build de produção**: `npm run build`
3. **Verificar build**: Confira se não há erros no console
4. **Testar funcionalidades**:
   - Login/Registro
   - Sistema de patrulhas
   - Loja do quartel
   - Ranking
   - Chat em tempo real

## Comandos Úteis

```bash
# Verificar configuração
wrangler whoami

# Fazer deploy para ambiente específico
wrangler deploy --env production

# Verificar logs
wrangler tail

# Fazer deploy sem confirmação
wrangler deploy --compatibility-date=2024-01-01
```

## Troubleshooting

### Erros Comuns

1. **Variáveis de ambiente não encontradas**
   - Verifique se o `.env` está configurado
   - Confirme se as variáveis começam com `VITE_`

2. **Erro de build**
   - Execute `npm run build` localmente primeiro
   - Verifique dependências com `npm install`

3. **Problemas com Firebase**
   - Confirme as regras de segurança do Firestore
   - Verifique se Authentication está ativado

4. **Arquivos estáticos não encontrados**
   - Verifique se os arquivos estão em `public/`
   - Confirme os caminhos no código

### Suporte

- Documentação Cloudflare: https://developers.cloudflare.com/workers/
- Documentação Vite: https://vitejs.dev/
- Documentação Firebase: https://firebase.google.com/docs

## Pós-Deploy

Após o deploy:

1. **Teste todas as funcionalidades**
2. **Monitore os logs** com `wrangler tail`
3. **Configure domínio personalizado** se necessário
4. **Configure analytics** se desejar

## Estrutura do Projeto

```
policerpg/
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/         # Hooks personalizados
│   ├── services/      # Serviços Firebase
│   ├── constants/     # Constantes do jogo
│   └── main.jsx       # Ponto de entrada
├── public/
│   └── sounds/        # Arquivos de áudio
├── wrangler.toml      # Configuração Cloudflare
├── package.json       # Dependências e scripts
└── DEPLOY.md         # Este arquivo
```

---

**Importante**: Mantenha suas chaves do Firebase seguras e nunca as commit no repositório!
