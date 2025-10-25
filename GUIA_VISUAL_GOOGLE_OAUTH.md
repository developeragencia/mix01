# 🎯 GUIA VISUAL: Corrigir Google OAuth em 5 Minutos

## ❌ Erro que você está vendo:
```
Acesso bloqueado: erro de autorização
Erro 400: origin_mismatch
```

## ✅ SOLUÇÃO EM 5 PASSOS SIMPLES

---

### 📍 PASSO 1: Abrir Google Cloud Console

1. Acesse: **https://console.cloud.google.com/**
2. Faça login com sua conta Google
3. No menu superior, selecione o projeto **"Mixapp"**

---

### 📍 PASSO 2: Ir para Credenciais

1. No menu lateral esquerdo (☰), clique em:
   ```
   APIs e Serviços
   ```

2. Depois clique em:
   ```
   Credenciais
   ```

---

### 📍 PASSO 3: Encontrar seu Client ID

Na página de Credenciais, você verá uma lista. Procure por:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 ID do cliente OAuth 2.0
Nome: Mix App Digital Web Client
ID: 853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
                                                    ✏️ [Editar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**CLIQUE NO ÍCONE DE LÁPIS (✏️) para editar**

---

### 📍 PASSO 4: Adicionar os Domínios Autorizados

Você verá uma página de edição. Role até encontrar:

```
╔════════════════════════════════════════╗
║  Origens JavaScript autorizadas        ║
╚════════════════════════════════════════╝
```

**Adicione estas 3 URLs** (clique em **"+ ADICIONAR URI"** para cada uma):

#### ✅ URL 1 - Desenvolvimento Local:
```
http://localhost:5000
```

#### ✅ URL 2 - Replit (COPIE EXATAMENTE):
```
https://c8ef9e65-2de8-44d3-b4ca-c0b1d3bfcc8b-00-28g5aats154ef.janeway.replit.dev
```

#### ✅ URL 3 - Produção:
```
https://mixapp.digital
```

**⚠️ ATENÇÃO:**
- Copie e cole EXATAMENTE como está
- SEM barra `/` no final
- Respeite http vs https
- Não adicione `www.`

---

### 📍 PASSO 5: Verificar Redirect URIs

Na mesma página, role um pouco mais e encontre:

```
╔════════════════════════════════════════╗
║  URIs de redirecionamento autorizados  ║
╚════════════════════════════════════════╝
```

**⚠️ IMPORTANTE: Este campo deve estar VAZIO!**

Se houver algum URI aqui, clique no **"X"** para remover todos.

---

### 💾 SALVAR

1. Role até o final da página
2. Clique no botão azul **"SALVAR"**
3. Aguarde a mensagem de confirmação

---

## ⏰ Aguardar Propagação

Após salvar, **aguarde 5-10 minutos** para o Google atualizar o cache.

Durante esse tempo, você pode:
- Tomar um café ☕
- Verificar outros detalhes do projeto
- Aguardar pacientemente 😊

---

## 🧪 TESTAR

Depois de 10 minutos:

1. **Abra uma aba ANÔNIMA** no navegador (Ctrl+Shift+N ou Cmd+Shift+N)
2. Acesse seu aplicativo no Replit
3. Vá para a página de Login
4. Clique em **"Continue with Google"**
5. **Deve funcionar!** 🎉

---

## 📋 CHECKLIST

Antes de salvar, verifique:

- [ ] Adicionei `http://localhost:5000`
- [ ] Adicionei `https://c8ef9e65-2de8-44d3-b4ca-c0b1d3bfcc8b-00-28g5aats154ef.janeway.replit.dev`
- [ ] Adicionei `https://mixapp.digital`
- [ ] Campo "URIs de redirecionamento" está VAZIO
- [ ] Cliquei em SALVAR
- [ ] Aguardei 10 minutos

---

## ❓ PERGUNTAS FREQUENTES

### Por que preciso adicionar o domínio do Replit?

O Google OAuth só funciona em domínios que você autorizar explicitamente. Como está testando no Replit, precisa adicionar o domínio dele.

### O que é "origin_mismatch"?

Significa que o site (origin) que está tentando usar o Google OAuth não está na lista de domínios autorizados.

### Posso usar um domínio diferente?

Sim, mas você precisa adicionar CADA domínio onde quer usar o Google OAuth.

### E se mudar o Repl?

Se recriar o projeto no Replit, o domínio mudará. Você precisará adicionar o novo domínio.

---

## 🆘 AINDA NÃO FUNCIONA?

Se após 10 minutos ainda não funcionar:

1. **Limpe o cache do navegador**:
   - Chrome: Ctrl+Shift+Delete → Limpar dados de navegação
   - Selecione "Cookies" e "Cache"
   - Clique em "Limpar dados"

2. **Teste em modo anônimo** (sempre recomendado para OAuth)

3. **Verifique novamente** se copiou os domínios EXATAMENTE como mostrado

4. **Aguarde mais 5 minutos** (o cache do Google pode demorar)

---

## ✅ RESUMO VISUAL

```
Google Cloud Console
    ↓
APIs e Serviços → Credenciais
    ↓
Editar Client ID (✏️)
    ↓
Origens JavaScript autorizadas:
    ✓ http://localhost:5000
    ✓ https://c8ef9e65-2de8-44d3-b4ca-c0b1d3bfcc8b-00-28g5aats154ef.janeway.replit.dev
    ✓ https://mixapp.digital
    ↓
URIs de redirecionamento: (VAZIO)
    ↓
SALVAR
    ↓
Aguardar 10 minutos
    ↓
TESTAR em aba anônima
    ↓
🎉 FUNCIONA!
```

---

## 🎉 PRONTO!

Após seguir estes passos, o Google OAuth funcionará perfeitamente!

O código do aplicativo está **100% correto** - só precisa dessa configuração no Google Cloud Console.

**Boa sorte!** 🚀
