# 🚀 DEPLOY: Aplicar Correções em https://mixapp.digital

## ✅ Correções Implementadas (JÁ FEITAS NO CÓDIGO)

### 1. **CORS configurado para produção**
```typescript
// server/index.ts - linha 37
const allowedOrigins = [
  'https://mixapp.digital',  // ← Produção
  /https:\/\/.*\.replit\.dev$/,
  /https:\/\/.*\.repl\.co$/
];
```

### 2. **Onboarding Simplificado**
- ✅ Removida página `/welcome-new-user`
- ✅ Apenas 2 etapas: Nome + Boas-vindas
- ✅ Redirecionamento direto para `/edit-profile`

### 3. **Configuração de Produção**
- ✅ `.replit` com autoscale deployment
- ✅ Build: `npm run build`
- ✅ Start: `npm start`
- ✅ Porta dinâmica do Replit (PORT env var)

---

## 🎯 COMO FAZER DEPLOY (1 CLIQUE)

### **PASSO ÚNICO:**
1. Clique na aba **"Deployments"** (🚀) no Replit
2. Clique em **"Deploy"**
3. Aguarde 2-3 minutos até status = "Active"

---

## ✅ Testar Após Deploy

Acesse: **https://mixapp.digital/phone-auth**

### **Cadastro com Celular:**
- Email: teste@example.com
- Telefone: (11) 99999-9999  
- Senha: 123456
- ✅ Deve criar conta → Onboarding (nome) → "Bora lá" → Editar Perfil

### **Cadastro com Google:**
Acesse: **https://mixapp.digital/register**
- Clique em "Continuar com o Google"
- ✅ Deve autenticar → Onboarding (nome) → "Bora lá" → Editar Perfil

---

## 📋 Checklist Pós-Deploy

- [ ] Cadastro com celular funciona
- [ ] Cadastro com Google funciona  
- [ ] Login funciona
- [ ] Onboarding tem 2 etapas (nome + boas-vindas)
- [ ] "Bora lá" redireciona para `/edit-profile`
- [ ] Página `/admin/subscription-plans` funciona
- [ ] Página `/admin/verifications` funciona

---

## 🔧 Se não funcionar após deploy

### 1. Limpar cache do navegador:
```
Chrome: F12 → Application → Clear storage → "Clear site data"
```

### 2. Verificar variáveis de ambiente em produção:
No painel Deployments → Settings → Environment Variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`
- `DATABASE_URL`

### 3. Ver logs de produção:
Deployments → Logs → Procurar erros CORS ou sessão

---

## 📝 Resumo

**STATUS ATUAL:**
- ✅ Código corrigido no workspace de desenvolvimento
- ⏳ Aguardando deploy para aplicar em produção

**PARA APLICAR:**
- 🚀 1 clique no botão "Deploy"

**RESULTADO:**
- ✅ https://mixapp.digital funcionando com todas as correções

---

✨ **Tudo está pronto! Basta fazer deploy!**
