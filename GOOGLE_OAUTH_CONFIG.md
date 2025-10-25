# Configurações Google OAuth - MIX App Digital

## 📋 Informações Gerais

**Client ID:** `853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com`
**Client Secret:** `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`

---

## 🔗 URLs Autorizadas (Authorized JavaScript origins)

### Desenvolvimento
- `http://localhost:5000`
- `http://127.0.0.1:5000`

### Produção
- `https://mixapp.digital`
- URLs do Replit (se necessário):
  - `https://<your-repl>.replit.dev`
  - `https://<your-repl>.replit.app`

---

## 🔄 URIs de Redirecionamento (Authorized redirect URIs)

### ⚠️ IMPORTANTE: Frontend OAuth (Atual)
O sistema atual usa **OAuth no navegador** com `useGoogleLogin` do `@react-oauth/google`.

**NÃO precisa de redirect URIs** porque o OAuth ocorre totalmente no frontend.

### Callbacks Antigos (Removidos)
❌ `/api/auth/google/callback` - REMOVIDO (causava erros de DNS no Replit)

---

## 🏗️ Arquitetura Atual

### Fluxo de Autenticação:
1. **Frontend** (`useGoogleLogin` com `flow: 'implicit'`):
   - Usuário clica em "Continuar com Google"
   - Abre popup do Google OAuth (fluxo implícito)
   - Google retorna `access_token` diretamente
   - Frontend busca dados do usuário via Google API

2. **Backend** (`/api/auth/google/token`):
   - Recebe dados do usuário (email, nome, foto)
   - Cria/atualiza usuário no banco
   - Cria sessão
   - Retorna status de perfil completo

### ⚠️ Configuração Crítica:
```typescript
const googleLogin = useGoogleLogin({
  flow: 'implicit',  // OBRIGATÓRIO! Sem isso gera erro redirect_uri_mismatch
  onSuccess: async (tokenResponse) => {
    // ...
  }
});
```

### Vantagens:
✅ Sem requisições externas do servidor (evita DNS errors)
✅ Funciona em desenvolvimento e produção
✅ Mais rápido e confiável
✅ Não precisa de redirect URIs configurados no Google Cloud

---

## 📁 Arquivos Principais

### Frontend
- `/client/src/pages/login.tsx` - Login com Google
- `/client/src/pages/register.tsx` - Cadastro com Google

### Backend
- `/server/routes.ts` - Endpoint `/api/auth/google/token`
- `/server/auth.ts` - Configuração de sessão

### Variáveis de Ambiente
```bash
# .env.local
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Frontend (.env ou vite)
VITE_GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
```

---

## 🔧 Configuração no Google Cloud Console

### 1. Criar Credenciais OAuth 2.0
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Criar credenciais → ID do cliente OAuth 2.0
3. Tipo: Aplicativo da Web

### 2. Configurar Origens JavaScript Autorizadas
```
http://localhost:5000
https://mixapp.digital
```

### 3. APIs Habilitadas
- Google+ API (para obter informações do usuário)
- People API (opcional, para mais dados)

---

## 🧪 Teste Local

```bash
# Desenvolvimento
npm run dev

# Testar login:
1. Acessar http://localhost:5000/login
2. Clicar em "Continuar com Google"
3. Fazer login com conta Google
4. Verificar redirecionamento (discover ou onboarding)
```

---

## 🚀 Produção

### URLs de Produção
- Site: `https://mixapp.digital`
- API: `https://mixapp.digital/api/*`

### Checklist de Deploy
- [ ] Adicionar `https://mixapp.digital` nas origens autorizadas
- [ ] Verificar GOOGLE_CLIENT_ID nas variáveis de ambiente
- [ ] Testar login em produção
- [ ] Verificar cookies (secure=true, sameSite=none)

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch" (Error 400)
**Causa:** `useGoogleLogin` sem o parâmetro `flow: 'implicit'`

**Solução:** Adicionar `flow: 'implicit'` na configuração:
```typescript
const googleLogin = useGoogleLogin({
  flow: 'implicit',  // ← ADICIONAR ESTA LINHA
  onSuccess: async (tokenResponse) => {
    // ...
  }
});
```

**Por quê?** Sem `flow: 'implicit'`, o hook tenta usar o fluxo de autorização padrão que requer redirect URIs. O fluxo implícito funciona totalmente no popup sem precisar de redirects.

### Erro: "popup_closed_by_user"
✅ Usuário fechou popup - comportamento normal

### Erro: "access_denied"
✅ Usuário negou permissão - comportamento normal

### Erro 500 no backend
- Verificar logs do servidor
- Validar formato dos dados recebidos
- Conferir conexão com banco de dados

---

## 📝 Notas Importantes

1. **Client ID é público** - pode ser exposto no frontend
2. **Client Secret é privado** - NUNCA expor no frontend
3. **Access Token** - obtido via popup OAuth, válido por ~1 hora
4. **Sessão** - gerenciada pelo backend com cookies seguros

---

## 🔒 Segurança

- ✅ HTTPS em produção
- ✅ Cookies com `secure=true, sameSite=none, partitioned=true`
- ✅ Validação de email no backend
- ✅ Session management com express-session
- ✅ Sem armazenamento de senhas para usuários OAuth

---

Data última atualização: 17/10/2025
