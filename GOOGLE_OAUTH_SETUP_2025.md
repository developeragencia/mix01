# Guia Completo de Configuração do Google OAuth 2025

## 📋 Visão Geral

Este aplicativo usa o **Google Sign-In** com a biblioteca `@react-oauth/google`, que implementa o método mais recente e seguro do Google Identity Services.

**Tipo de autenticação**: JWT Credential (ID Token)  
**Biblioteca**: @react-oauth/google v0.12.2  
**Método**: GoogleLogin component (popup-based)

---

## ✅ Configuração no Google Cloud Console

### Passo 1: Acesse o Google Cloud Console

1. Vá para: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Se você já tem o projeto "Mixapp", selecione-o no menu superior
   - Se não tem, clique em "**Criar projeto**" e nomeie como "Mixapp"

---

### Passo 2: Configure a Tela de Consentimento OAuth

1. No menu lateral, vá em: **APIs e Serviços** → **Tela de consentimento OAuth**

2. Se for a primeira vez:
   - Selecione **"Externo"** (para permitir qualquer usuário do Google fazer login)
   - Clique em **"CRIAR"**

3. Preencha os campos obrigatórios:
   - **Nome do app**: Mix App Digital
   - **Email de suporte do usuário**: seu email
   - **Logotipo do app** (opcional): adicione o logo do MIX se desejar
   - **Domínio autorizado do app**: `mixapp.digital`
   - **Email do desenvolvedor**: seu email

4. **Escopos**:
   - Clique em "Adicionar ou remover escopos"
   - Selecione apenas estes 3 escopos básicos:
     - `openid`
     - `profile`
     - `email`
   - Clique em "ATUALIZAR"

5. **Usuários de teste** (apenas necessário em modo desenvolvimento):
   - Adicione os emails dos usuários que podem testar
   - Em produção, você precisará publicar o app

6. Clique em **"SALVAR E CONTINUAR"** até finalizar

---

### Passo 3: Criar Credenciais OAuth 2.0

1. No menu lateral: **APIs e Serviços** → **Credenciais**

2. Clique em **"+ CRIAR CREDENCIAIS"** → **"ID do cliente OAuth 2.0"**

3. Configurações:
   - **Tipo de aplicativo**: **Aplicativo da Web**
   - **Nome**: Mix App Digital Web Client

4. **Origens JavaScript autorizadas**:
   
   Adicione estas URLs (clique em "+ ADICIONAR URI"):
   
   **Para desenvolvimento local:**
   ```
   http://localhost:5000
   ```
   
   **Para produção:**
   ```
   https://mixapp.digital
   ```

5. **URIs de redirecionamento autorizados**:
   
   ⚠️ **IMPORTANTE**: **DEIXE ESTE CAMPO VAZIO!**
   
   O método GoogleLogin usa popup e não precisa de redirect URIs. Se houver algum URI aqui, **remova todos**.

6. Clique em **"CRIAR"**

---

### Passo 4: Copiar as Credenciais

Após criar, você verá uma janela com:

- **ID do cliente**: `853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com`
- **Chave secreta do cliente**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`

✅ **Copie o ID do cliente** - você vai precisar dele

⚠️ **A chave secreta não é necessária** para este tipo de autenticação (frontend-only OAuth)

---

### Passo 5: Configurar Variáveis de Ambiente no Replit

No Replit, você já tem estas variáveis configuradas em **Secrets**:

```
GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
```

⚠️ **IMPORTANTE**: Ambas devem ter o **ID do cliente** (não a chave secreta!)

---

## 🔧 Como Funciona Tecnicamente

### Fluxo de Autenticação

```
1. Usuário clica em "Continuar com Google"
   ↓
2. GoogleLogin component abre popup do Google
   ↓
3. Usuário faz login e autoriza o app
   ↓
4. Google retorna um JWT credential (ID Token) diretamente para o JavaScript
   ↓
5. Frontend envia o credential para /api/auth/google
   ↓
6. Backend valida o JWT com google-auth-library.verifyIdToken()
   ↓
7. Backend verifica se o email já existe no banco de dados
   ↓
8. Se não existir, cria novo usuário; se existir, faz login
   ↓
9. Backend cria sessão e retorna isProfileComplete
   ↓
10. Frontend redireciona para /discover ou /onboarding-flow
```

### Por que não precisa de Redirect URI?

O método **GoogleLogin** usa **popup OAuth flow**:
- Abre uma janela popup do Google
- Não há redirecionamento da página principal
- O token JWT é retornado diretamente via JavaScript
- Por isso, não precisa configurar "URIs de redirecionamento"

### Segurança

✅ **JWT Validation**: O backend usa `google-auth-library` para validar o JWT  
✅ **Audience Check**: Verifica se o token foi emitido para nosso Client ID  
✅ **Session Management**: Cria sessão segura com Chrome CHIPS  
✅ **HTTPS Only**: Produção obrigatoriamente usa HTTPS

---

## 🧪 Como Testar

### 1. Teste em Desenvolvimento (localhost)

1. Certifique-se de que o servidor está rodando em `http://localhost:5000`
2. Abra o navegador e vá para `http://localhost:5000/login`
3. Clique em "Continuar com Google"
4. Faça login com uma conta Google
5. Você deve ser redirecionado para `/onboarding-flow` (novo usuário) ou `/discover` (perfil completo)

### 2. Teste em Produção

1. Acesse `https://mixapp.digital/login`
2. Clique em "Continuar com Google"
3. Faça login
4. Verifique se o redirecionamento funciona

---

## 🐛 Solução de Problemas

### Erro: "redirect_uri_mismatch"

**Causa**: Configuração incorreta no Google Cloud Console

**Solução**:
1. Vá para Google Cloud Console → Credenciais
2. Clique no Client ID que você criou
3. **Verifique "Origens JavaScript autorizadas"**:
   - Deve ter exatamente: `http://localhost:5000` e `https://mixapp.digital`
   - Sem `/` no final
   - HTTP vs HTTPS deve estar correto
4. **Verifique "URIs de redirecionamento autorizados"**:
   - **Deve estar VAZIO** (sem nenhum URI)
5. Salve e aguarde 5-10 minutos (cache do Google)

---

### Erro: "Invalid token" ou "401 Unauthorized"

**Causa**: Client ID incorreto ou token expirado

**Solução**:
1. Verifique se `VITE_GOOGLE_CLIENT_ID` está correto nos Secrets
2. Verifique se `GOOGLE_CLIENT_ID` no backend está correto
3. Limpe o cache do navegador
4. Tente fazer logout do Google e login novamente

---

### Popup não abre ou fecha imediatamente

**Causa**: Bloqueador de popup do navegador

**Solução**:
1. Permita popups para `localhost:5000` ou `mixapp.digital`
2. Teste em modo anônimo
3. Desative extensões do navegador temporariamente

---

### Erro: "This app is blocked"

**Causa**: Aplicativo não publicado e usuário não está na lista de teste

**Solução**:
1. Se estiver testando:
   - Adicione o email do usuário em "Usuários de teste" na tela de consentimento
2. Se estiver em produção:
   - Publique o app no Google Cloud Console (processo de verificação do Google)

---

## 📚 Recursos Adicionais

- **Documentação oficial**: https://developers.google.com/identity/gsi/web
- **Biblioteca @react-oauth/google**: https://www.npmjs.com/package/@react-oauth/google
- **Google Cloud Console**: https://console.cloud.google.com/

---

## ✅ Checklist de Configuração

- [ ] Projeto criado no Google Cloud Console
- [ ] Tela de consentimento OAuth configurada
- [ ] ID do cliente OAuth 2.0 criado
- [ ] "Origens JavaScript autorizadas" configuradas: `http://localhost:5000` e `https://mixapp.digital`
- [ ] "URIs de redirecionamento autorizados" **VAZIO**
- [ ] Variáveis `GOOGLE_CLIENT_ID` e `VITE_GOOGLE_CLIENT_ID` configuradas no Replit
- [ ] Teste de login funcionando em desenvolvimento
- [ ] Teste de login funcionando em produção

---

## 🎉 Tudo Pronto!

Após completar este guia, o Google OAuth estará funcionando corretamente. Usuários poderão fazer login e cadastro usando suas contas Google de forma rápida e segura!
