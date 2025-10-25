# 🔐 Credenciais de Teste - MIX App Digital

## Usuário Principal de Teste

### Login
- **Email:** `teste@mixapp.com`
- **Senha:** `123456`
- **Username:** `teste`

### Informações do Perfil
- **Nome:** Usuário Teste
- **Idade:** 29 anos
- **Profissão:** Desenvolvedor de Software
- **Cargo:** Desenvolvedor Full Stack
- **Empresa:** MIX App Digital
- **Localização:** São Paulo, SP
- **Plano:** Free (pode testar upgrade para Premium/VIP)

### Funcionalidades Disponíveis
✅ **Autenticação**
- Login com email/senha
- Google OAuth (se configurado)

✅ **Perfil Completo**
- 3 fotos de perfil
- Todos os campos preenchidos
- Bio completa
- Interesses configurados

✅ **Matches Ativos (2)**
1. **Maria Silva** (maria.silva@example.com)
   - Fotógrafa, 28 anos
   - Plano Premium
   - Conversa ativa

2. **Ana Costa** (ana.costa@example.com)
   - Designer Gráfica, 26 anos
   - Plano Free
   - Conversa ativa

✅ **Mensagens**
- 6 mensagens trocadas
- 2 conversas diferentes
- Histórico completo

✅ **Descoberta**
- 1 perfil disponível para swipe (Julia Santos)
- Sistema de likes/dislikes funcionando

## Outros Usuários de Teste

### Maria Silva
- **Email:** maria.silva@example.com
- **Senha:** 123456
- **Plano:** Premium

### Ana Costa
- **Email:** ana.costa@example.com
- **Senha:** 123456
- **Plano:** Free

### Julia Santos
- **Email:** julia.santos@example.com
- **Senha:** 123456
- **Plano:** VIP

## 📊 Estatísticas do Banco

- **Total de Usuários:** 5
- **Perfis Completos:** 5
- **Matches Criados:** 2
- **Mensagens:** 6
- **Swipes:** 5
- **Planos de Assinatura:** 2 (Premium e VIP)

## 🔒 Hash da Senha

O hash bcrypt usado para a senha `123456`:
```
$2b$10$uHkBvjkqYW0F4kZ.dxgKBuaLA5FoYpTeTlhXn/63q.lRzzMyFzZdu
```

## ⚠️ Importante para Produção

**Este arquivo contém credenciais de teste.** Para produção:

1. ❌ **NÃO** use a senha `123456`
2. ❌ **NÃO** commite este arquivo no repositório público
3. ✅ Altere as senhas para valores seguros
4. ✅ Use variáveis de ambiente
5. ✅ Remova ou desative usuários de teste

## 🚀 Como Testar

1. Acesse o aplicativo
2. Faça login com `teste@mixapp.com` / `123456`
3. Explore todas as funcionalidades:
   - Ver perfil
   - Editar perfil
   - Swipe em perfis (Julia Santos disponível)
   - Ver matches (Maria e Ana)
   - Enviar mensagens
   - Testar upgrade de plano
   - Ver configurações

## 📱 Funciona Em

- ✅ localhost:5000
- ✅ Domínios Replit
- ✅ mixapp.digital
- ✅ Qualquer domínio configurado

---

**Última atualização:** 24 de Outubro de 2025
**Backup disponível em:** `backups/mixapp-backup-*.json`
