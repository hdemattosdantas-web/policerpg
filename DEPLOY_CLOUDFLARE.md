# 🚀 Deploy do PoliceRPG na Cloudflare Pages

## 📋 Pré-requisitos
- Conta na Cloudflare (gratuita)
- Repositório no GitHub/GitLab/Bitbucket
- Projeto já configurado para build

## 🔧 Configuração do Projeto

### 1. Fazer push do código para o repositório
```bash
git add .
git commit -m "Configuração para deploy na Cloudflare Pages"
git push origin main
```

### 2. Configurar variáveis de ambiente no Firebase
Antes do deploy, configure as regras de segurança no Firestore:

```javascript
// Regras do Firestore (console.firebase.google.com)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seu próprio documento
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Usernames devem ser únicos
    match /usernames/{username} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.uid;
    }
    
    // Mesas (salas multiplayer)
    match /mesas/{mesaId} {
      allow read, write: if request.auth != null;
    }
    
    // Rankings (leitura pública)
    match /rankings/{rankingId} {
      allow read: if true;
    }
  }
}
```

## 🌐 Deploy na Cloudflare Pages

### Método 1: Pela Interface Web

1. **Acesse** [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Vá para** Pages → Create application
3. **Conecte seu repositório** GitHub/GitLab
4. **Configure as configurações de build:**

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: / (deixe em branco)
```

5. **Variáveis de Ambiente** (Environment Variables):
```
VITE_FIREBASE_API_KEY=AIzaSyDMEX7hL_F0gZka0YqM0jxhb64X5fMhZzk
VITE_FIREBASE_AUTH_DOMAIN=policerpg.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=policerpg
VITE_FIREBASE_STORAGE_BUCKET=policerpg.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=808784317915
VITE_FIREBASE_APP_ID=1:808784317915:web:aa927f53781ddd18486bfe
VITE_FIREBASE_MEASUREMENT_ID=G-D10VM0SBSE
```

6. **Clique em** "Save and Deploy"

### Método 2: Por CLI (Wrangler)

```bash
# Instalar Wrangler
npm install -g wrangler

# Login na Cloudflare
wrangler login

# Criar projeto Pages
wrangler pages project create policerpg

# Fazer deploy
npm run build
wrangler pages deploy dist --project-name policerpg
```

## 🔒 Configurações de Segurança Importantes

### 1. Domínio Personalizado (Opcional)
- No dashboard da Cloudflare → Pages → Seu projeto
- Custom domains → Add custom domain
- Configure DNS conforme instruções

### 2. SSL Automático
- Cloudflare fornece SSL gratuito automaticamente
- Certifique-se que "Always HTTPS" está ativado

### 3. Cache Control
- Configure cache estático para assets
- Headers para arquivos estáticos:

```javascript
// No vite.config.js (opcional)
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    }
  }
})
```

## 🚀 Pós-Deploy

### 1. Testar a Aplicação
- Acesse a URL fornecida pela Cloudflare
- Teste login, cadastro e funcionalidades
- Verifique console do navegador para erros

### 2. Configurar Analytics (Opcional)
- Cloudflare Analytics para métricas
- Firebase Analytics já configurado

### 3. Backup e Monitoramento
- Configure backups automáticos do Firestore
- Monitore uso e performance

## 🛠️ Troubleshooting Comum

### Erro: "Failed to load resource"
- Verifique variáveis de ambiente
- Confirme regras de segurança do Firestore

### Erro: "404 Not Found" em rotas
- Verifique se arquivo `_redirects` está em `public/`
- Deve conter: `/*    /index.html   200`

### Build lento
- Cache de dependências ativado automaticamente
- Build incremental funciona nas próximas execuções

## 📱 Performance Otimizada

A configuração atual inclui:
- ✅ Code splitting automático
- ✅ Cache de assets estáticos
- ✅ CDN global da Cloudflare
- ✅ Compressão gzip/brotli
- ✅ HTTP/3 suporte

## 🔄 Deploy Automático

Com GitHub conectado, cada push para main:
1. Trigger automático de build
2. Deploy para ambiente de preview
3. Promover para produção após aprovação

---

**URL do seu projeto:** `https://policerpg.pages.dev` (ou seu domínio personalizado)

**Suporte:** [Documentação Cloudflare Pages](https://developers.cloudflare.com/pages/)
