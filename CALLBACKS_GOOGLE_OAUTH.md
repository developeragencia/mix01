# 📋 Callbacks e Configurações do Google OAuth - MIX App

## ✅ Credenciais Atualizadas

**Client ID:** `853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com`
**Client Secret:** `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`

---

## 🔗 CONFIGURAÇÕES NECESSÁRIAS NO GOOGLE CLOUD CONSOLE

### 1️⃣ Origens JavaScript Autorizadas (Authorized JavaScript origins)

Adicione estas URLs no Google Cloud Console:

#### Desenvolvimento Local
```
http://localhost:5000
http://127.0.0.1:5000
```

#### Replit (Desenvolvimento)
```
https://[seu-projeto].replit.dev
```

#### Produção
```
https://mixapp.digital
```

---

### 2️⃣ URIs de Redirecionamento (Authorized redirect URIs)

⚠️ **IMPORTANTE:** Com o fluxo atual (`flow: 'implicit'`), **NÃO É NECESSÁRIO** adicionar URIs de redirecionamento!

O sistema usa OAuth diretamente no navegador através de popup, não precisa de callbacks de servidor.

**Se o Google Cloud Console exigir pelo menos uma URI, você pode deixar em branco ou adicionar qualquer URL válida do seu domínio (ela não será usada).**

---

## ⚙️ Como Configurar no Google Cloud Console

### Passo 1: Acessar o Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto ou crie um novo

### Passo 2: Configurar Credenciais OAuth
1. Vá em **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
3. Escolha tipo: **Web application**

### Passo 3: Adicionar Origens JavaScript
Copie e cole na seção **Authorized JavaScript origins**:
```
http://localhost:5000
https://mixapp.digital
```
(Adicione também sua URL do Replit se estiver testando lá)

### Passo 4: Redirect URIs (OPCIONAL)
Deixe em branco ou adicione apenas uma URL qualquer do seu domínio.
**Não é necessário para o fluxo atual!**

### Passo 5: Salvar
Clique em **Create** e copie o Client ID e Client Secret.

---

## 🔐 Variáveis de Ambiente (Já Configuradas)

As seguintes variáveis já foram configuradas nos Replit Secrets:

```bash
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
VITE_GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
```

---

## 📝 Resumo da Arquitetura

### Como Funciona:
1. **Usuário clica em "Continuar com Google"** na página de login
2. **Popup do Google OAuth abre** (fluxo implícito)
3. **Google retorna `access_token`** diretamente no navegador
4. **Frontend envia o token para o backend** (`/api/auth/google/token`)
5. **Backend valida o token com Google**:
   - Chama `tokeninfo` para validar o token
   - Verifica se o `audience (aud)` corresponde ao nosso Client ID
   - Busca informações do usuário no `userinfo` endpoint
6. **Usuário é criado/logado** no sistema
7. **Redirecionamento** para `/discover` ou `/onboarding-flow`

### Vantagens do Fluxo Atual:
- ✅ Sem necessidade de callbacks de servidor
- ✅ Funciona em qualquer ambiente (local, Replit, produção)
- ✅ Mais rápido e confiável
- ✅ Evita erros de DNS e redirect_uri_mismatch
- ✅ Validação de segurança completa no backend

---

## 🧪 Testar o Login

1. Acesse: `http://localhost:5000/login` (ou sua URL)
2. Clique em **"Continuar com Google"**
3. Faça login com sua conta Google
4. O sistema irá:
   - Validar seu token
   - Criar/logar sua conta
   - Redirecionar para a página apropriada

---

## 🚨 Erros Comuns e Soluções

### Erro: "redirect_uri_mismatch"
**Causa:** Falta configurar as origens JavaScript ou está usando flow incorreto
**Solução:** 
1. Certifique-se que `flow: 'implicit'` está configurado no código
2. Adicione sua URL nas "Authorized JavaScript origins"

### Erro: "Access blocked: This app's request is invalid"
**Causa:** Client ID não corresponde ao projeto do Google Cloud
**Solução:** Verifique se o Client ID está correto nos secrets

### Erro: "Token inválido" no backend
**Causa:** Token expirado ou inválido
**Solução:** Faça login novamente (tokens expiram em ~1 hora)

---

## 📅 Última Atualização
Data: 18 de outubro de 2025
Status: ✅ Configuração completa e funcionando
