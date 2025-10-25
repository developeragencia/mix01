# 🚀 VARIÁVEIS DE AMBIENTE RENDER - MIX APP DIGITAL

## 📋 VARIÁVEIS OBRIGATÓRIAS (Copie e cole no Render)

### 1. DATABASE_URL (CRÍTICO)
```
postgresql://neondb_owner:npg_j2gPC3aArYFy@ep-lively-thunder-ah1jko6x-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. NODE_ENV
```
production
```

### 3. PORT
```
10000
```

### 4. SESSION_SECRET
```
generate
```
*(O Render gerará automaticamente)*

### 5. FRONTEND_URL
```
https://mixapp-digital.onrender.com
```

### 6. BACKEND_URL
```
https://mixapp-digital.onrender.com
```

---

## 🔧 VARIÁVEIS OPCIONAIS (Configure conforme necessário)

### Google OAuth (para login com Google)
```
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
```

### Facebook OAuth (para login com Facebook)
```
FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID_HERE
FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET_HERE
```

### Stripe (para pagamentos)
```
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

### SendGrid (para emails)
```
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE
FROM_EMAIL=noreply@mixapp.digital
```

---

## 🎯 COMO CONFIGURAR NO RENDER

### Passo 1: Acessar Render Dashboard
1. Vá para [render.com](https://render.com)
2. Faça login
3. Selecione o serviço `mixapp-digital`

### Passo 2: Adicionar Variáveis
1. Clique em **"Environment"**
2. Para cada variável:
   - Clique em **"Add Environment Variable"**
   - Cole o **nome** e **valor**
   - Clique em **"Save Changes"**

### Passo 3: Deploy Automático
- O Render fará deploy automático após salvar
- Aguarde o build completar
- Teste a aplicação

---

## ✅ VERIFICAÇÃO

### 1. Logs do Render
- Acesse **"Logs"**
- Procure por: `"Database connected successfully"`
- Não deve aparecer: `"DATABASE_URL must be set"`

### 2. Teste da Aplicação
- Acesse: `https://mixapp-digital.onrender.com`
- Teste login/cadastro
- Verifique se dados são salvos

### 3. Neon Console
- Volte ao [Neon Console](https://console.neon.tech)
- Execute: `SELECT COUNT(*) FROM users;`
- Deve retornar número de usuários

---

## 🚨 TROUBLESHOOTING

### Problema: "DATABASE_URL must be set"
**Solução:** Verifique se a variável está configurada corretamente

### Problema: "Connection timeout"
**Solução:** Verifique se o Neon está ativo (não suspenso)

### Problema: "OAuth not working"
**Solução:** Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET

### Problema: "CORS errors"
**Solução:** Verifique FRONTEND_URL e BACKEND_URL

---

## 🎉 PRÓXIMOS PASSOS

1. ✅ Configure as variáveis obrigatórias
2. ✅ Teste a conexão com banco
3. ✅ Configure OAuth (opcional)
4. ✅ Configure pagamentos (opcional)
5. ✅ Teste todas as funcionalidades

**Sua aplicação estará funcionando perfeitamente!** 🚀
