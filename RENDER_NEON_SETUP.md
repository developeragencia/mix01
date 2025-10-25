# 🚀 Configuração Render + Neon Database - MIX App Digital

## 📋 Configuração Automática do Neon no Render

### 1. ✅ Arquivo MCP Configurado (.mcp-config.json)

**Servidores MCP Configurados:**
- ✅ **Render MCP**: Deploy, logs, métricas
- ✅ **Neon MCP**: Database, queries, migrations, backups

**Configuração Neon MCP:**
```json
"neon": {
  "command": "npx",
  "args": ["-y", "mcp-remote@latest", "https://mcp.neon.tech/mcp"],
  "description": "Servidor MCP para integração com Neon Database",
  "capabilities": ["database", "queries", "migrations", "backups"]
}
```

### 2. ✅ Arquivo render.yaml Atualizado

O arquivo `render.yaml` foi configurado com:
- ✅ **Auto-deploy** habilitado
- ✅ **Variáveis de ambiente** organizadas
- ✅ **Configurações de performance** otimizadas
- ✅ **Descrições** para cada variável

### 2. 🔧 Variáveis de Ambiente Necessárias

#### Banco de Dados Neon (OBRIGATÓRIO)
```env
DATABASE_URL=postgresql://usuario:senha@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

#### Autenticação Google (OPCIONAL)
```env
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=sua-chave-secreta-google
```

#### Autenticação Facebook (OPCIONAL)
```env
FACEBOOK_APP_ID=seu-facebook-app-id
FACEBOOK_APP_SECRET=seu-facebook-app-secret
```

#### Pagamentos Stripe (OPCIONAL)
```env
STRIPE_SECRET_KEY=sk_test_sua-chave-secreta-stripe
STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-publica-stripe
```

### 3. 🎯 Como Configurar no Render

#### Passo 1: Criar Serviço no Render
1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Selecione "Web Service"
4. Render detectará automaticamente o `render.yaml`

#### Passo 2: Configurar Variáveis de Ambiente
1. No painel do Render, vá para "Environment"
2. Adicione cada variável conforme necessário:

**DATABASE_URL (OBRIGATÓRIO):**
- Obtenha em: https://console.neon.tech
- Formato: `postgresql://usuario:senha@host/database?sslmode=require`

**SESSION_SECRET:**
- Será gerado automaticamente pelo Render
- Ou gere manualmente: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### Passo 3: Deploy Automático
- ✅ **Auto-deploy** está habilitado
- ✅ **Branch main** será usado
- ✅ **Build** e **start** comandos configurados

### 4. 🔍 Verificação da Configuração

#### Health Check
- ✅ Endpoint: `/api/health`
- ✅ Render verificará automaticamente

#### Logs
- Acesse "Logs" no painel Render
- Verifique se `DATABASE_URL` está sendo carregada
- Confirme conexão com Neon

### 5. 🚨 Troubleshooting

#### Problema: "DATABASE_URL must be set"
**Solução:**
1. Verifique se a variável está configurada no Render
2. Confirme se a URL do Neon está correta
3. Teste a conexão no console Neon

#### Problema: "Connection timeout"
**Solução:**
1. Verifique se o Neon está ativo (não suspenso)
2. Confirme se `sslmode=require` está na URL
3. Teste com connection pooling

#### Problema: "OAuth não funciona"
**Solução:**
1. Configure `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
2. Adicione domínio Render nas origens JavaScript autorizadas
3. Para Facebook: configure `FACEBOOK_APP_ID` e `FACEBOOK_APP_SECRET`

### 6. 📊 Monitoramento

#### Métricas Disponíveis
- ✅ **CPU Usage**
- ✅ **Memory Usage**
- ✅ **Response Time**
- ✅ **Error Rate**

#### Alertas Recomendados
- CPU > 80%
- Memory > 90%
- Error rate > 5%
- Response time > 2s

### 7. 🔄 Backup e Recuperação

#### Neon Database
- ✅ **Backup automático** habilitado
- ✅ **Point-in-time restore** disponível
- ✅ **Retenção**: 7 dias (free tier)

#### Render Service
- ✅ **Deploy rollback** disponível
- ✅ **Environment variables** versionadas
- ✅ **Build logs** mantidos

### 8. 🤖 Integração MCP Neon

#### Funcionalidades Disponíveis
- ✅ **Database Management**: Criar, listar, deletar databases
- ✅ **Query Execution**: Executar SQL queries diretamente
- ✅ **Migration Management**: Aplicar e reverter migrations
- ✅ **Backup Operations**: Criar e restaurar backups

#### Como Usar MCP Neon
```bash
# Instalar dependências MCP
npm install -g @modelcontextprotocol/cli

# Conectar ao Neon via MCP
mcp connect neon

# Exemplos de comandos:
# - Listar databases
# - Executar queries
# - Aplicar migrations
# - Criar backups
```

#### Benefícios da Integração MCP
- ✅ **Automação**: Operações de database via comandos
- ✅ **Integração**: Conexão direta com Neon API
- ✅ **Monitoramento**: Status e métricas em tempo real
- ✅ **Backup**: Operações de backup automatizadas

---

## 🎉 Configuração Completa!

Sua aplicação MIX App Digital está configurada para:
- ✅ **Deploy automático** no Render
- ✅ **Conexão automática** com Neon Database
- ✅ **Variáveis de ambiente** organizadas
- ✅ **Monitoramento** e **logs** habilitados
- ✅ **Backup** e **recuperação** configurados

**Próximos passos:**
1. Configure as variáveis de ambiente no Render
2. Faça o primeiro deploy
3. Teste todas as funcionalidades
4. Configure monitoramento e alertas
