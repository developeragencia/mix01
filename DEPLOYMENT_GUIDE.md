# 🚀 Guia de Deployment - MIX App Digital

## 📋 Credenciais de Teste

### Usuário de Teste Principal
- **Email:** teste@mixapp.com
- **Senha:** 123456
- **Funciona em:** Qualquer domínio (incluindo mixapp.digital)

Este usuário possui:
- ✅ Perfil completo com fotos
- ✅ 2 matches ativos (Maria Silva e Ana Costa)
- ✅ Conversas com mensagens
- ✅ Todos os campos preenchidos
- ✅ Pronto para testar todas as funcionalidades

## 💾 Backup e Restauração do Banco de Dados

### Criar Backup

Para criar um backup completo do banco de dados:

```bash
npm run db:backup
```

Isso irá gerar um arquivo JSON em `backups/mixapp-backup-[timestamp].json` com todos os dados:
- Usuários e perfis
- Matches e mensagens
- Planos de assinatura
- Configurações do app
- Todas as tabelas do sistema

### Restaurar Backup

Para restaurar um backup:

```bash
npm run db:restore backups/mixapp-backup-[timestamp].json
```

## 🚂 Deploy no Railway

Railway é uma plataforma moderna de deployment com excelente suporte para Node.js e PostgreSQL.

### 1. Criar Conta e Projeto

1. Acesse [Railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"

### 2. Configurar Banco de Dados PostgreSQL

1. No seu projeto Railway, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. O Railway criará automaticamente um banco PostgreSQL
4. Copie a `DATABASE_URL` das variáveis de ambiente

### 3. Deploy da Aplicação

#### Opção A: Via GitHub (Recomendado)

1. No Railway, clique em "New" → "GitHub Repo"
2. Conecte seu repositório
3. Railway detectará automaticamente o `railway.toml`
4. O deploy iniciará automaticamente

#### Opção B: Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy
railway up
```

### 4. Configurar Variáveis de Ambiente

No painel do Railway, adicione estas variáveis:

```env
DATABASE_URL=postgresql://... (copiado do PostgreSQL service)
SESSION_SECRET=seu-secret-super-seguro-aqui
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
STRIPE_SECRET_KEY=seu-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=seu-stripe-publishable-key
```

> ⚠️ **Importante:** Não adicione `NODE_ENV=production` nas variáveis de ambiente. O Railway configurará isso automaticamente durante o runtime. Se você definir durante o build, as devDependencies (vite, esbuild) não serão instaladas e o build falhará.

### 5. Configurar Domínio

1. No Railway, vá em Settings
2. Em "Domains", clique em "Generate Domain" (Railway fornece domínio gratuito)
3. Ou adicione seu domínio customizado `mixapp.digital`

### 6. Restaurar Backup

Após o primeiro deploy:

```bash
# Conectar ao projeto
railway link

# Restaurar dados
npm run db:restore backups/mixapp-backup-[timestamp].json
```

### 7. Health Check

O Railway verificará automaticamente a saúde da aplicação em `/api/health`

---

## 🎨 Deploy no Render

Render é uma alternativa excelente com plano gratuito generoso.

### 1. Criar Conta

1. Acesse [Render.com](https://render.com)
2. Faça login com GitHub
3. Vá para Dashboard

### 2. Configurar Banco de Dados PostgreSQL

1. Clique em "New +" → "PostgreSQL"
2. Configure:
   - **Name:** mixapp-db
   - **Database:** mixapp
   - **User:** mixapp
   - **Region:** Oregon (ou mais próximo)
   - **Plan:** Free
3. Clique em "Create Database"
4. Copie a "Internal Database URL"

### 3. Deploy da Aplicação

#### Opção A: Via Dashboard (Recomendado)

1. No Render Dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name:** mixapp-digital
   - **Environment:** Node
   - **Region:** Oregon
   - **Branch:** main
   - **Build Command:** `npm run build:production`
   - **Start Command:** `npm run start:production`
4. Clique em "Create Web Service"

#### Opção B: Via render.yaml (Blueprint)

O projeto já possui `render.yaml` configurado. Basta:

1. No Render, clique em "New +" → "Blueprint"
2. Conecte seu repositório
3. Render lerá o `render.yaml` automaticamente
4. Confirme e faça deploy

### 4. Configurar Variáveis de Ambiente

No painel do Render, em "Environment":

```env
DATABASE_URL=postgresql://... (Internal Database URL do PostgreSQL)
SESSION_SECRET=seu-secret-super-seguro-aqui
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
STRIPE_SECRET_KEY=seu-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=seu-stripe-publishable-key
```

> ⚠️ **Importante:** Não adicione `NODE_ENV=production` nas variáveis de ambiente. O Render configurará isso automaticamente durante o runtime. Se você definir durante o build, as devDependencies (vite, esbuild) não serão instaladas e o build falhará.

### 5. Configurar Domínio

1. Em "Settings", vá para "Custom Domain"
2. Adicione `mixapp.digital`
3. Configure os DNS records conforme instruções

### 6. Health Checks

O Render verificará automaticamente `/api/health` conforme configurado no `render.yaml`

### 7. Restaurar Backup

Após deploy:

```bash
# Restaurar dados
npm run db:restore backups/mixapp-backup-[timestamp].json
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Iniciar servidor de desenvolvimento

# Build e Produção
npm run build               # Build normal
npm run build:production    # Build otimizado para produção
npm run start               # Iniciar servidor de produção
npm run start:production    # Iniciar com otimizações de produção

# Banco de Dados
npm run db:push             # Sincronizar schema com banco
npm run db:push --force     # Forçar sincronização
npm run db:backup           # Criar backup completo
npm run db:restore          # Restaurar backup
npm run db:generate         # Gerar migrations
npm run db:migrate          # Aplicar migrations

# Utilities
npm run check               # TypeScript type checking
npm run preview             # Build e preview local
```

---

## 📊 Comparação Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| **Plano Gratuito** | $5 crédito/mês | 750h/mês |
| **Deploy** | Instantâneo | ~2-5 min |
| **PostgreSQL** | Incluído | Incluído |
| **Domínio Gratuito** | ✅ | ✅ |
| **Auto-Deploy** | ✅ | ✅ |
| **WebSockets** | ✅ | ✅ |
| **CLI** | Excelente | Bom |
| **Logs** | Tempo real | Tempo real |
| **Escalabilidade** | Automática | Automática |

### Recomendação

- **Railway:** Melhor para desenvolvimento rápido, excelente DX
- **Render:** Melhor para produção de longa duração, mais estável

---

## ⚙️ Configurações Importantes

### PostgreSQL (Neon/Railway/Render)

O projeto funciona com qualquer PostgreSQL moderno:
- ✅ Railway PostgreSQL (recomendado para Railway)
- ✅ Render PostgreSQL (recomendado para Render)
- ✅ Neon (serverless, funciona com ambos)
- ✅ Supabase (alternativa)

### Session e Autenticação

- Sessions armazenadas em PostgreSQL via `connect-pg-simple`
- Google OAuth configurado
- Login com email/senha funcionando
- Senhas com bcrypt (hash seguro)
- WebSocket para mensagens em tempo real

### Features do Usuário Teste

O usuário `teste@mixapp.com` pode testar:

1. **Login/Autenticação** ✅
   - Login com email/senha
   - Google OAuth (se configurado)

2. **Perfil** ✅
   - Ver perfil completo
   - Editar informações
   - Upload de fotos

3. **Descoberta** ✅
   - Ver perfis disponíveis
   - Dar like/dislike
   - Super likes

4. **Matches** ✅
   - 2 matches criados
   - Ver lista de matches

5. **Chat** ✅
   - Conversas com Maria e Ana
   - Enviar mensagens em tempo real
   - WebSocket ativo

6. **Assinaturas** ✅
   - Ver planos disponíveis
   - Upgrade de conta via Stripe

---

## 🔐 Segurança

### Variáveis de Ambiente Obrigatórias

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@host:port/database

# Session
SESSION_SECRET=gere-um-secret-aleatorio-forte-aqui

# OAuth Google (Opcional)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# Stripe (Opcional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

> ⚠️ **Nota Importante sobre NODE_ENV:**  
> **NÃO configure `NODE_ENV=production` manualmente** nas variáveis de ambiente do Railway/Render. As plataformas configuram isso automaticamente durante o runtime. Se você definir durante o build, as devDependencies (vite, esbuild, cross-env) não serão instaladas e o build falhará.

### Gerar SESSION_SECRET Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### Recomendações de Segurança

- ✅ Use senhas fortes em produção
- ✅ Configure rate limiting (já implementado)
- ✅ HTTPS automático (Railway/Render)
- ✅ CORS configurado adequadamente
- ✅ Variáveis de ambiente para todos os secrets
- ✅ Nunca commite `.env` ou secrets
- ✅ Altere senha do usuário teste em produção

---

## 🆘 Troubleshooting

### Erro de Conexão com Banco

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão localmente
npm run db:push

# Verificar se o banco está acessível
psql $DATABASE_URL
```

### Erro no Build

```bash
# Limpar cache e reinstalar
rm -rf node_modules dist
npm install
npm run build:production

# Verificar TypeScript
npm run check
```

### Erro de Session

Se sessões não persistem:
1. Verifique se `DATABASE_URL` está configurado
2. Verifique se a tabela `session` foi criada
3. Execute `npm run db:push` para criar tabelas

### WebSocket não conecta

1. Verifique se o servidor suporta WebSocket (Railway ✅, Render ✅)
2. Em produção, WebSocket usa wss:// automaticamente
3. Verifique logs do servidor

### Usuário Teste Não Funciona

```bash
# Restaurar backup
npm run db:restore backups/seu-backup.json

# Verificar se usuário existe
# Use interface do Railway/Render para acessar banco
```

---

## 📈 Monitoramento

### Railway

- Dashboard → Metrics
- CPU, Memory, Network em tempo real
- Logs com busca e filtros
- Alerts configuráveis

### Render

- Dashboard → Metrics
- Response time, throughput
- Logs em tempo real
- Email alerts para erros

### Recomendações

Monitor essencial:
- ✅ Logs de erro
- ✅ Performance do banco
- ✅ Uso de memória
- ✅ Tempo de resposta
- ✅ Taxa de erros

---

## 🚀 Deploy Checklist

Antes de fazer deploy em produção:

- [ ] Criar backup do banco de dados atual
- [ ] Configurar todas as variáveis de ambiente
- [ ] Gerar `SESSION_SECRET` forte e único
- [ ] Configurar Google OAuth (se necessário)
- [ ] Configurar Stripe (se necessário)
- [ ] Testar build localmente: `npm run build:production`
- [ ] Verificar que `DATABASE_URL` está correto
- [ ] Configurar domínio customizado
- [ ] Fazer deploy
- [ ] Verificar health check: `https://seu-dominio/api/health`
- [ ] Restaurar backup se necessário
- [ ] Testar login com usuário teste
- [ ] Testar todas as funcionalidades principais
- [ ] Configurar monitoramento e alerts
- [ ] Alterar/remover usuário teste

---

## 📞 Recursos e Documentação

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 🎉 Conclusão

Seu MIX App Digital está pronto para produção!

**Railway** e **Render** são plataformas modernas que simplificam deployment:
- ✅ Deploy automático via GitHub
- ✅ PostgreSQL gerenciado incluído
- ✅ SSL/HTTPS automático
- ✅ Escalabilidade automática
- ✅ Logs e métricas em tempo real
- ✅ Planos gratuitos generosos

Escolha a plataforma que melhor atende suas necessidades e faça deploy com confiança! 🚀

---

✅ **Tudo pronto para deploy no Railway ou Render!**
