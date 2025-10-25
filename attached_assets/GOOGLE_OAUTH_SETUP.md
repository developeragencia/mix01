# 🔥 CONFIGURAÇÃO GOOGLE OAUTH PARA MIX.DIGITAL.COM

## ❌ PROBLEMA IDENTIFICADO:
- **Erro:** TokenError: Bad Request (invalid_grant)
- **Causa:** Callback URL não configurada no Google Console
- **Domínio:** mix.digital.com não autorizado

## ✅ SOLUÇÃO COMPLETA:

### 1. GOOGLE CLOUD CONSOLE:
Acesse: https://console.cloud.google.com/

### 2. CONFIGURAR DOMÍNIOS AUTORIZADOS:
- **Desenvolvimento:** `http://localhost:5000`
- **Produção:** `https://mix.digital.com`

### 3. URLS DE CALLBACK OBRIGATÓRIAS:
```
http://localhost:5000/api/auth/google/callback
https://mix.digital.com/api/auth/google/callback
```

### 4. CONFIGURAÇÃO NO PROJETO:
1. Vá para "APIs & Services" → "Credentials"
2. Edite seu OAuth 2.0 Client ID
3. Em "Authorized JavaScript origins":
   - Adicione: `http://localhost:5000`
   - Adicione: `https://mix.digital.com`
4. Em "Authorized redirect URIs":
   - Adicione: `http://localhost:5000/api/auth/google/callback`
   - Adicione: `https://mix.digital.com/api/auth/google/callback`

### 5. VERIFICAR CREDENCIAIS:
- **GOOGLE_CLIENT_ID:** Deve começar com numeros e terminar com `.apps.googleusercontent.com`
- **GOOGLE_CLIENT_SECRET:** String alfanumérica de ~24 caracteres

### 6. MESMO PROCESSO PARA FACEBOOK:
- Facebook App Settings → Basic → App Domains
- Adicione: `mix.digital.com`
- Valid OAuth Redirect URIs:
  - `http://localhost:5000/api/auth/facebook/callback`
  - `https://mix.digital.com/api/auth/facebook/callback`

## 🎯 TESTE APÓS CONFIGURAÇÃO:
1. Acesse: `https://mix.digital.com/register`
2. Clique: "Continuar com Google"
3. Deve funcionar sem erro "invalid_grant"

## 🚨 ERRO COMUM:
- **Problema:** Callback URL não configurada
- **Solução:** Adicionar EXATAMENTE as URLs listadas acima
- **Aguardar:** Mudanças podem demorar até 5 minutos para propagar

## ✅ CÓDIGO ATUALIZADO:
- Callback URL detecta automaticamente ambiente (dev/prod)
- Suporte completo para localhost e mix.digital.com
- Logs detalhados para debugging