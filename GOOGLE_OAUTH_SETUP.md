# 🔐 Google OAuth - Configuração OBRIGATÓRIA para Produção

## ⚠️ PROBLEMA ATUAL

✅ **FUNCIONA**: https://691a6e09-1d81-4028-ab66-5583a14ba75b-00-1m4ir1sblui66.spock.replit.dev  
❌ **NÃO FUNCIONA**: https://mixapp.digital

**MOTIVO**: O domínio `https://mixapp.digital` não está autorizado no Google Cloud Console.

---

## 🛠️ SOLUÇÃO - PASSO A PASSO EXATO

### **1. Acesse o Google Cloud Console**
🔗 **Link direto**: https://console.cloud.google.com/apis/credentials

### **2. Localize sua credencial OAuth 2.0**
- Client ID: `853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com`
- **CLIQUE** no nome da credencial para editar

### **3. ADICIONE os domínios autorizados**

Na seção **"Authorized JavaScript origins"** (Origens JavaScript autorizadas):

**ADICIONE EXATAMENTE ESTES 2 DOMÍNIOS:**

```
https://mixapp.digital
https://691a6e09-1d81-4028-ab66-5583a14ba75b-00-1m4ir1sblui66.spock.replit.dev
```

⚠️ **ATENÇÃO - REGRAS IMPORTANTES:**
- ✅ Use **HTTPS** (não HTTP)
- ✅ **NÃO** adicione barra no final (`/`)
- ✅ **NÃO** adicione paths como `/login` ou `/register`
- ✅ **NÃO** adicione portas (`:3000`, `:5000`, etc)

**EXEMPLOS:**
- ✅ CORRETO: `https://mixapp.digital`
- ❌ ERRADO: `https://mixapp.digital/`
- ❌ ERRADO: `https://mixapp.digital/login`
- ❌ ERRADO: `http://mixapp.digital`

### **4. Salve as alterações**
- Clique em **"SALVAR"** no topo da página
- Confirme que os domínios foram salvos

### **5. AGUARDE a propagação**
- ⏰ As mudanças do Google levam **5-10 MINUTOS** para propagar
- Seja paciente - NÃO tente testar imediatamente

### **6. Limpe o cache do navegador**

**Opção 1 (Recomendada):**
1. Pressione `F12` para abrir DevTools
2. Vá na aba "Application" (Chrome) ou "Storage" (Firefox)
3. Clique em "Clear storage" ou "Clear site data"
4. Marque tudo e clique em "Clear data"

**Opção 2:**
1. Pressione `Ctrl + Shift + Delete`
2. Marque "Cached images and files"
3. Clique em "Clear data"

### **7. Teste o login**
🔗 **Acesse**: https://mixapp.digital/login

**Clique em "Continue with Google"** e faça login normalmente.

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### Erro: "The given origin is not allowed for the given client ID"
**Causa**: Domínio não está nas origens autorizadas  
**Solução**: Volte ao passo 3 e adicione o domínio EXATAMENTE como indicado

### Erro: "origin_mismatch"
**Causa**: Domínio não bate exatamente com o registrado  
**Solução**: Verifique se não adicionou `/` no final ou se usou HTTP em vez de HTTPS

### As mudanças não funcionam
**Causa 1**: Cache do navegador  
**Solução**: Limpe o cache (passo 6)

**Causa 2**: Mudanças do Google não propagaram  
**Solução**: Aguarde mais 5-10 minutos

**Causa 3**: Domínio foi digitado incorretamente  
**Solução**: Verifique novamente - copie e cole os domínios exatos

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Antes de testar, confirme:
- [ ] Acessei https://console.cloud.google.com/apis/credentials
- [ ] Cliquei na credencial OAuth 2.0 correta
- [ ] Adicionei `https://mixapp.digital` em "Authorized JavaScript origins"
- [ ] Adicionei `https://691a6e09-1d81-4028-ab66-5583a14ba75b-00-1m4ir1sblui66.spock.replit.dev` em "Authorized JavaScript origins"
- [ ] **NÃO** adicionei nada em "Authorized redirect URIs" (não é necessário)
- [ ] Cliquei em "SALVAR"
- [ ] Aguardei pelo menos 5-10 minutos
- [ ] Limpei o cache do navegador
- [ ] Testei em https://mixapp.digital/login

---

## 💡 INFORMAÇÕES TÉCNICAS

### Como funciona o Google OAuth:
1. Usuário clica em "Continue with Google"
2. Google abre popup de autenticação
3. Google valida se o domínio está autorizado
4. Se autorizado: Google retorna JWT credential
5. Backend valida JWT e cria sessão
6. Usuário é redirecionado para `/discover` ou `/onboarding-flow`

### Por que não funciona em produção:
- O Google valida o **domínio de origem** (origin) da requisição
- Se o domínio não estiver em "Authorized JavaScript origins", o Google bloqueia
- **NÃO** é um problema de código - é configuração do Google Cloud Console

### Variáveis de ambiente necessárias:
✅ Já configuradas no Replit Secrets:
- `GOOGLE_CLIENT_ID` (backend)
- `VITE_GOOGLE_CLIENT_ID` (frontend)
- `GOOGLE_CLIENT_SECRET` (backend)

---

## 🎯 RESUMO

**O código está 100% funcional**. O único problema é que você precisa adicionar `https://mixapp.digital` nas origens autorizadas do Google Cloud Console.

**Tempo estimado**: 2 minutos para configurar + 10 minutos de espera para propagar = **12 minutos total**

**Após configurar**, o login com Google funcionará perfeitamente em ambos os domínios:
- ✅ https://mixapp.digital (PRODUÇÃO)
- ✅ https://691a6e09-1d81-4028-ab66-5583a14ba75b-00-1m4ir1sblui66.spock.replit.dev (DESENVOLVIMENTO)
