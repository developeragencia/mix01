# 🔧 Como Corrigir o Google OAuth - Passo a Passo

## ❌ Erro Atual

```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

**Causa**: O domínio do Replit não está autorizado no Google Cloud Console.

---

## ✅ SOLUÇÃO - Siga Este Passo a Passo

### Passo 1: Acesse o Google Cloud Console

1. Abra: **https://console.cloud.google.com/**
2. Faça login com sua conta Google
3. Selecione o projeto "Mixapp" no menu superior

---

### Passo 2: Vá para Credenciais

1. No menu lateral esquerdo, clique em: **"APIs e Serviços"**
2. Depois clique em: **"Credenciais"**

---

### Passo 3: Edite o Client ID OAuth

1. Na lista de credenciais, procure por:
   ```
   ID do cliente OAuth 2.0
   Nome: Mix App Digital Web Client (ou similar)
   ID: 853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com
   ```

2. **Clique no ícone de lápis (editar)** ao lado do Client ID

---

### Passo 4: Configure as Origens JavaScript

Na seção **"Origens JavaScript autorizadas"**, você precisa adicionar **3 URLs**:

#### 1. Para desenvolvimento local:
```
http://localhost:5000
```

#### 2. Para Replit (desenvolvimento):
```
https://c8ef9e65-2de8-44d3-b4ca-c0b1d3bfcc8b-00-28g5aats154ef.janeway.replit.dev
```

#### 3. Para produção:
```
https://mixapp.digital
```

**IMPORTANTE:**
- Clique em **"+ ADICIONAR URI"** para cada URL
- Copie e cole exatamente como está acima
- Sem `/` no final
- Sem `www.`
- Respeite http vs https exatamente como mostrado

---

### Passo 5: URIs de Redirecionamento

Na seção **"URIs de redirecionamento autorizados"**:

⚠️ **DEIXE VAZIO!** Não adicione nenhum URI aqui.

Se houver algum URI, **remova todos**.

---

### Passo 6: Salvar

1. Clique em **"SALVAR"** no final da página
2. Aguarde 5-10 minutos para as alterações propagarem (cache do Google)

---

## 🧪 Testar

Depois de configurar:

1. Aguarde 5 minutos
2. Abra uma aba anônima no navegador
3. Acesse a aplicação no Replit
4. Clique em "Continue with Google" na página de login
5. O popup do Google deve abrir sem erros

---

## 📸 Como Deve Ficar

Sua configuração no Google Cloud Console deve ficar assim:

```
Cliente OAuth 2.0 da Web
──────────────────────────────

Nome: Mix App Digital Web Client

ID do cliente: 853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com

Origens JavaScript autorizadas:
  ✓ http://localhost:5000
  ✓ https://c8ef9e65-2de8-44d3-b4ca-c0b1d3bfcc8b-00-28g5aats154ef.janeway.replit.dev
  ✓ https://mixapp.digital

URIs de redirecionamento autorizados:
  (vazio - nenhum URI)
```

---

## ❓ Perguntas Frequentes

### Por que preciso adicionar o domínio do Replit?

O Google OAuth só funciona em domínios que você autorizar. Como você está testando no Replit, precisa adicionar o domínio dele.

### O domínio do Replit pode mudar?

Sim, se você recriar o Repl. Se isso acontecer, você precisará atualizar a lista novamente com o novo domínio.

### Posso deixar http://localhost:5000?

Sim! Mantenha ele para poder testar localmente no seu computador se precisar.

### Por que não preciso de redirect URIs?

Porque estamos usando o método **GoogleLogin** (popup), que não faz redirecionamento de página. O token é retornado diretamente via JavaScript.

---

## 🎉 Pronto!

Após seguir estes passos, o Google OAuth funcionará perfeitamente! 

Se ainda tiver problemas após 10 minutos, limpe o cache do navegador ou teste em modo anônimo.
