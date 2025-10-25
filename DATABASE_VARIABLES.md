# 🔧 Variáveis de Ambiente - MIX App Digital

## 📊 Variáveis do Banco de Dados

### DATABASE_URL (Obrigatória)
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database?sslmode=require
```

**Descrição:** URL de conexão completa com o PostgreSQL (Neon)

**Exemplo Neon PostgreSQL:**
```env
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Exemplo Local:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mixapp
```

**Ambiente Atual (Replit Development):**
```env
DATABASE_URL=postgresql://postgres:password@helium/heliumdb?sslmode=disable
```

### Componentes da DATABASE_URL

A URL do banco de dados é composta por:
```
postgresql://[usuario]:[senha]@[host]:[porta]/[database]?[parametros]
```

- **Protocolo:** `postgresql://`
- **Usuário:** Nome de usuário do banco (ex: `postgres`, `neondb_owner`)
- **Senha:** Senha do usuário
- **Host:** Endereço do servidor (ex: `localhost`, `ep-xxx.neon.tech`)
- **Porta:** Porta do PostgreSQL (padrão: `5432`)
- **Database:** Nome do banco de dados (ex: `mixapp`, `neondb`)
- **Parâmetros:** Configurações adicionais (ex: `sslmode=require`)

## 🔐 Variáveis de Autenticação e Sessão

### SESSION_SECRET (Obrigatória)
```env
SESSION_SECRET=sua-chave-secreta-super-segura-aqui-min-32-caracteres
```

**Descrição:** Chave secreta para criptografar as sessões dos usuários

**Geração recomendada:**
```bash
# Gerar uma chave aleatória segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### GOOGLE_CLIENT_ID (Opcional - OAuth)
```env
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
```

**Descrição:** ID do cliente OAuth 2.0 do Google Cloud Console

**Como obter:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Navegue para "APIs & Services" → "Credentials"
3. Copie o "Client ID"

### GOOGLE_CLIENT_SECRET (Opcional - OAuth)
```env
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

**Descrição:** Chave secreta do cliente OAuth 2.0 do Google

**Como obter:**
1. Mesmo local do Client ID
2. Copie o "Client Secret"

## 💳 Variáveis do Stripe (Pagamentos)

### STRIPE_SECRET_KEY (Opcional)
```env
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
```

**Descrição:** Chave secreta do Stripe para processar pagamentos

**Tipos:**
- **Desenvolvimento:** `sk_test_...`
- **Produção:** `sk_live_...`

**Como obter:**
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Navegue para "Developers" → "API keys"
3. Copie a "Secret key"

### STRIPE_PUBLISHABLE_KEY (Frontend)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

**Descrição:** Chave pública do Stripe para uso no frontend

**Nota:** Precisa do prefixo `VITE_` para ser acessível no frontend

## 🌐 Variáveis de Ambiente

### NODE_ENV
```env
NODE_ENV=production
# ou
NODE_ENV=development
```

**Descrição:** Define o ambiente de execução

**Valores:**
- `development` - Desenvolvimento local
- `production` - Produção

### PORT (Opcional)
```env
PORT=5000
```

**Descrição:** Porta do servidor

**Padrão:** 5000 (desenvolvimento) ou 3000 (produção)

### HOST (Opcional)
```env
HOST=0.0.0.0
```

**Descrição:** Endereço de host do servidor

**Padrão:** `0.0.0.0` (aceita conexões de qualquer origem)

## 📋 Variáveis do Sistema Replit

Essas variáveis são **automaticamente configuradas** pelo Replit:

### PGDATABASE
```env
PGDATABASE=heliumdb
```

**Descrição:** Nome do banco de dados PostgreSQL

### PGUSER
```env
PGUSER=postgres
```

**Descrição:** Usuário do PostgreSQL

### REPL_ID
```env
REPL_ID=f0554fda-3ce3-487f-8f8b-13d24b6e7ea3
```

**Descrição:** ID único do Repl

### REPL_SLUG
```env
REPL_SLUG=mix70
```

**Descrição:** Nome do projeto Replit

### REPLIT_DB_URL
```env
REPLIT_DB_URL=https://kv.replit.com/v0/...
```

**Descrição:** URL do banco de dados key-value do Replit (não usado neste projeto)

## 📝 Arquivo .env Completo para Produção

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados (OBRIGATÓRIO)
DATABASE_URL=postgresql://username:password@host:porta/database?sslmode=require

# Sessão (OBRIGATÓRIO)
SESSION_SECRET=sua-chave-secreta-super-segura-aqui-min-32-caracteres

# Google OAuth (OPCIONAL - mas recomendado)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Stripe (OPCIONAL - apenas se usar pagamentos)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx

# Ambiente
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
```

## 🚀 Como Configurar para Deploy

### Vercel

1. Acesse o dashboard do projeto
2. Vá em "Settings" → "Environment Variables"
3. Adicione cada variável individualmente

### Netlify

1. Acesse "Site settings" → "Environment variables"
2. Clique em "Add a variable"
3. Adicione cada variável

### Variáveis Mínimas Necessárias

Para o app funcionar, você **PRECISA** de:

✅ **Obrigatórias:**
- `DATABASE_URL` - Conexão com PostgreSQL
- `SESSION_SECRET` - Segurança das sessões

⚠️ **Recomendadas:**
- `GOOGLE_CLIENT_ID` - Login com Google
- `GOOGLE_CLIENT_SECRET` - Login com Google
- `NODE_ENV=production` - Otimizações

📌 **Opcionais:**
- `STRIPE_SECRET_KEY` - Pagamentos
- `VITE_STRIPE_PUBLISHABLE_KEY` - Pagamentos (frontend)

## 🔍 Como Verificar Variáveis

### No terminal:
```bash
# Ver todas as variáveis de ambiente
env | grep -i "database\|google\|stripe\|session"

# Ver variável específica
echo $DATABASE_URL
```

### No código:
```typescript
// Verificar se DATABASE_URL existe
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado');
```

## 🛡️ Segurança

### ⚠️ NUNCA faça:
- ❌ Commitar `.env` no Git
- ❌ Compartilhar chaves secretas publicamente
- ❌ Usar a mesma SESSION_SECRET em dev e prod
- ❌ Expor DATABASE_URL com credenciais

### ✅ SEMPRE faça:
- ✅ Use `.gitignore` para `.env`
- ✅ Gere SESSION_SECRET única para produção
- ✅ Use variáveis de ambiente na plataforma de deploy
- ✅ Rotacione chaves periodicamente

## 📊 Status Atual das Variáveis

**Configuradas no Replit:**
- ✅ DATABASE_URL
- ✅ PGDATABASE
- ✅ PGUSER
- ⚠️ GOOGLE_CLIENT_ID (não configurado)
- ⚠️ GOOGLE_CLIENT_SECRET (não configurado)
- ⚠️ SESSION_SECRET (usando padrão de desenvolvimento)
- ⚠️ STRIPE_SECRET_KEY (não configurado)

**Próximos Passos:**
1. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET para OAuth
2. Configure SESSION_SECRET para produção
3. Configure Stripe se for usar pagamentos

---

**Última atualização:** 24 de Outubro de 2025
