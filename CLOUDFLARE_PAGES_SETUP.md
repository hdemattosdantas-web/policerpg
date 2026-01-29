#  Configuração do Cloudflare Pages para Police RPG

##  Problemas Resolvidos

1. ** wrangler.toml removido** - Estava configurando como Workers
2. ** _redirects criado** - Arquivo de roteamento correto
3. ** Variáveis .env configuradas** - Prontas para Pages

##  Configurar Variáveis de Ambiente no Cloudflare Pages

### Passo 1: Acessar o Painel
1. Vá para: https://dash.cloudflare.com/pages
2. Selecione seu projeto 'policerpg'
3. Clique em 'Settings'  'Environment variables'

### Passo 2: Adicionar Variáveis
Adicione EXATAMENTE estas variáveis:

`
VITE_FIREBASE_API_KEY=AIzaSyDMEX7hL_F0gZka0YqM0jxhb64X5fMhZzk
VITE_FIREBASE_AUTH_DOMAIN=policerpg.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=policerpg
VITE_FIREBASE_STORAGE_BUCKET=policerpg.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=808784317915
VITE_FIREBASE_APP_ID=1:808784317915:web:aa927f53781ddd18486bfe
VITE_FIREBASE_MEASUREMENT_ID=G-D10VM0SBSE
`

### Passo 3: Configurações de Build
Em 'Settings'  'Build & deployments':

- **Framework preset**: 'Vite'
- **Build command**: 'npm run build'
- **Build output directory**: 'dist'
- **Root directory**: '/'

### Passo 4: Deploy
1. Faça push das mudanças:
   `ash
   git add .
   git commit -m 'Fix Cloudflare Pages setup'
   git push
   `

2. O Cloudflare fará deploy automático

##  Verificação

Após o deploy, verifique:
1. **Console do navegador** (F12) - Sem erros de Firebase
2. **Network tab** - Arquivos carregando corretamente
3. **Login** - Funcionando sem erros de API

##  Importante

- **NÃO** use wrangler.toml para Pages
- **SIM** use _redirects para SPA routing
- **SEMPRE** configure variáveis no painel do Pages
- **VERIFIQUE** se todas variáveis começam com 'VITE_'

##  Se Ainda Der Erro

1. **Limpe o cache**: Settings  Build & deployments  Clear cache and retry
2. **Verifique logs**: Build logs para erros específicos
3. **Re-deploy**: Force novo deploy com novo commit

##  Teste Final

Acesse a URL do Cloudflare Pages e:
-  Login com Google/Email
-  Criar personagem
-  Fazer patrulha
-  Ver ranking

---

**Status**: Configuração otimizada para Cloudflare Pages! 
