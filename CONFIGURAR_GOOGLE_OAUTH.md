# ⚠️ CONFIGURAÇÃO OBRIGATÓRIA - GOOGLE OAUTH

## 🚨 PROBLEMA ATUAL
O erro "Erro ao validar credencial do Google" acontece porque o domínio **https://mixapp.digital** não está autorizado no Google Cloud Console.

## ✅ SOLUÇÃO - PASSO A PASSO (5 MINUTOS)

### **PASSO 1: Acesse o Google Cloud Console**
1. Abra: https://console.cloud.google.com/apis/credentials
2. Faça login com sua conta Google

### **PASSO 2: Encontre sua credencial OAuth**
1. Procure por: `853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com`
2. Clique no nome da credencial para editá-la

### **PASSO 3: Adicione o domínio de produção**
1. Encontre a seção: **"Origens JavaScript autorizadas"** (Authorized JavaScript origins)
2. Clique em **"+ ADICIONAR URI"**
3. Digite EXATAMENTE (sem barra no final):
   ```
   https://mixapp.digital
   ```
4. ⚠️ **ATENÇÃO**: Use **HTTPS** (não HTTP)
5. ⚠️ **NÃO** adicione `/` no final
6. ⚠️ **NÃO** adicione paths como `/register` ou `/login`

### **PASSO 4: (Opcional) Adicione domínio de desenvolvimento**
Se quiser testar no Replit também:
```
https://c8ef9e65-2de8-44d3-b4ca-c0b1d3bfcc8b-00-28g5aats154ef.janeway.replit.dev
```

### **PASSO 5: Salvar**
1. Clique em **"SALVAR"** no topo da página
2. ⏰ **AGUARDE 5-10 MINUTOS** - As mudanças do Google levam tempo para propagar

### **PASSO 6: Limpe o cache do navegador**
1. Pressione: **Ctrl + Shift + Delete**
2. Marque: **"Cached images and files"** (Imagens em cache)
3. Clique em: **"Clear data"**
4. **Feche TODAS as abas** do site
5. **Abra uma nova aba**

### **PASSO 7: Teste**
1. Acesse: https://mixapp.digital/register
2. Clique em "Continuar com o Google"
3. ✅ Deve funcionar sem erros

---

## 📝 OBSERVAÇÕES IMPORTANTES

### ❌ Erros Comuns:
- **"Erro ao validar credencial do Google"** = Domínio não está nas origens autorizadas
- **"origin_mismatch"** = Domínio digitado incorretamente ou com `/` no final
- **"Mudanças não funcionam"** = Aguarde 10 minutos + limpe cache do navegador

### ✅ Formato Correto:
```
✅ CORRETO: https://mixapp.digital
❌ ERRADO:  http://mixapp.digital (sem S no HTTP)
❌ ERRADO:  https://mixapp.digital/ (com barra no final)
❌ ERRADO:  https://mixapp.digital/register (com path)
```

### 💡 Dicas:
- Se mudar o domínio do Replit, atualize a origem autorizada
- Não precisa configurar "URIs de redirecionamento" (não é usado)
- Apenas "Origens JavaScript autorizadas" é necessário

---

## 🔧 APÓS CONFIGURAR

Depois de seguir todos os passos, o login com Google funcionará perfeitamente em:
- ✅ https://mixapp.digital/login
- ✅ https://mixapp.digital/register

**Qualquer dúvida, verifique se seguiu TODOS os passos acima.**
