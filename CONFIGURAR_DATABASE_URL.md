# 🔗 Configuração DATABASE_URL - Neon + Render

## 📋 String de Conexão do Neon

**String de Conexão Completa:**
```
postgresql://neondb_owner:npg_j2gPC3aArYFy@ep-lively-thunder-ah1jko6x-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🚀 Como Configurar no Render

### Passo 1: Acessar Render Dashboard
1. Vá para [render.com](https://render.com)
2. Faça login na sua conta
3. Selecione o serviço `mixapp-digital`

### Passo 2: Configurar Variável de Ambiente
1. No painel do Render, clique em **"Environment"**
2. Clique em **"Add Environment Variable"**
3. Configure:

**Nome da Variável:**
```
DATABASE_URL
```

**Valor da Variável:**
```
postgresql://neondb_owner:npg_j2gPC3aArYFy@ep-lively-thunder-ah1jko6x-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Passo 3: Salvar e Deploy
1. Clique em **"Save Changes"**
2. O Render fará **deploy automático** com a nova configuração
3. Aguarde o build completar

## ✅ Verificação da Configuração

### 1. Verificar Logs do Render
- Acesse **"Logs"** no painel Render
- Procure por: `"DATABASE_URL must be set"` (não deve aparecer)
- Confirme: `"Database connected successfully"`

### 2. Testar Conexão
- Acesse sua aplicação: `https://mixapp-digital.onrender.com`
- Teste login/cadastro
- Verifique se dados são salvos no banco

### 3. Verificar no Neon Console
- Volte ao [Neon Console](https://console.neon.tech)
- Vá para **"SQL Editor"**
- Execute: `SELECT COUNT(*) FROM users;`
- Deve retornar número de usuários cadastrados

## 🔧 Configurações Adicionais Recomendadas

### Variáveis de Ambiente no Render
```env
# Banco de Dados (OBRIGATÓRIO)
DATABASE_URL=postgresql://neondb_owner:npg_j2gPC3aArYFy@ep-lively-thunder-ah1jko6x-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Sessão (gerado automaticamente pelo Render)
SESSION_SECRET=gerado-automaticamente

# Google OAuth (se configurado)
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=sua-chave-secreta-google

# Facebook OAuth (se configurado)
FACEBOOK_APP_ID=seu-facebook-app-id
FACEBOOK_APP_SECRET=seu-facebook-app-secret

# Stripe (se configurado)
STRIPE_SECRET_KEY=sk_test_sua-chave-stripe
STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-publica-stripe
```

## 🚨 Troubleshooting

### Problema: "DATABASE_URL must be set"
**Solução:**
1. Verifique se a variável está configurada no Render
2. Confirme se o nome é exatamente `DATABASE_URL`
3. Teste a string de conexão no Neon Console

### Problema: "Connection timeout"
**Solução:**
1. Verifique se o Neon está ativo (não suspenso)
2. Confirme se `sslmode=require` está na URL
3. Teste com connection pooling habilitado

### Problema: "Authentication failed"
**Solução:**
1. Verifique usuário: `neondb_owner`
2. Confirme senha: `npg_j2gPC3aArYFy`
3. Teste conexão no Neon Console primeiro

## 📊 Monitoramento

### Neon Console
- ✅ **Status**: IDLE (ativo)
- ✅ **Branch**: production (DEFAULT)
- ✅ **Database**: neondb
- ✅ **Connection pooling**: Habilitado

### Render Dashboard
- ✅ **Health Check**: `/api/health`
- ✅ **Logs**: Monitoramento em tempo real
- ✅ **Metrics**: CPU, Memory, Response Time

## 🎉 Próximos Passos

1. **Configure DATABASE_URL** no Render
2. **Faça deploy** da aplicação
3. **Teste** login/cadastro
4. **Monitore** logs e métricas
5. **Configure** outras variáveis conforme necessário

---

**Sua aplicação estará conectada ao Neon Database e funcionando perfeitamente!** 🚀
