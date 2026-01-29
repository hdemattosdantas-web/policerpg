# 🔥 Como Obter as Chaves do Firebase

## Passo a Passo Completo

### 1. Acessar o Firebase Console
```
https://console.firebase.google.com
```

### 2. Selecionar seu Projeto
- Escolha o projeto que você criou para o Police RPG
- Se não tiver projeto, crie um novo

### 3. Configurações do Projeto
- Clique no **ícone de engrenagem ⚙️** no menu lateral esquerdo
- Selecione **"Project settings"**

### 4. Encontrar as Chaves
- Role a página para baixo até a seção **"Your apps"**
- Selecione seu aplicativo **Web** (</> icon)
- Você verá um card com **"Firebase SDK snippet"**
- Clique em **"Config"** para ver as configurações

## O que Você Procura

Você encontrará um objeto como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",        // ← VITE_FIREBASE_API_KEY
  authDomain: "seu-projeto.firebaseapp.com",           // ← VITE_FIREBASE_AUTH_DOMAIN
  projectId: "seu-projeto-id",                       // ← VITE_FIREBASE_PROJECT_ID
  storageBucket: "seu-projeto.appspot.com",           // ← VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789012",                 // ← VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:abcdef1234567890abcdef12" // ← VITE_FIREBASE_APP_ID
};
```

## Mapeamento das Chaves

| Chave Firebase | Variável .env | Exemplo |
|---------------|---------------|---------|
| `apiKey` | `VITE_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` | `seu-projeto-id` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` | `seu-projeto.appspot.com` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `appId` | `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef1234567890abcdef12` |

## Configurando o Arquivo .env

1. **Copie o arquivo template**:
   ```bash
   cp env.example .env
   ```

2. **Edite o arquivo .env**:
   ```bash
   # Substitua os valores XXX com suas chaves reais
   VITE_FIREBASE_API_KEY=AIzaSySUAS_CHAVE_AQUI
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto-real.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id-real
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto-real.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef12
   ```

## ⚠️ Segurança - MUITO IMPORTANTE

### NUNCA FAÇA ISSO:
❌ Commitar o arquivo `.env` no Git  
❌ Compartilhar suas chaves publicamente  
❌ Usar chaves de produção em ambiente de desenvolvimento  

### SEMPRE FAÇA ISSO:
✅ Manter `.env` no `.gitignore` (já configurado)  
✅ Usar chaves diferentes para dev/prod  
✅ Gerar novas chaves se suspeitar de comprometimento  

## Verificação

Depois de configurar, verifique se está funcionando:

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o desenvolvimento
npm run dev

# 3. Abra http://localhost:5173
# 4. Tente fazer login - se funcionar, as chaves estão corretas!
```

## Problemas Comuns

### "API key not valid"
- Verifique se copiou a chave corretamente (sem espaços extras)
- Confirme se a variável começa com `VITE_`

### "auth/project-not-found"
- Verifique se o `projectId` está correto
- Confirme se o projeto existe no Firebase Console

### "auth/network-request-failed"
- Verifique sua conexão com a internet
- Confirme se o `authDomain` está correto

## Suporte

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Confirme todas as chaves estão copiadas corretamente
3. Teste com o projeto Firebase padrão primeiro

---

**Lembre-se**: Suas chaves do Firebase são como senhas - trate-as com cuidado! 🔐
