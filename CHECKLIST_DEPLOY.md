# ✅ CHECKLIST DE DEPLOY - MIX APP DIGITAL

## 📋 EXECUTE NESTA ORDEM EXATA:

### ☐ **ETAPA 1: MIGRAÇÃO DO BANCO**

1. ☐ Abra o Replit
2. ☐ Clique em **"Database"** (barra lateral esquerda)
3. ☐ Clique em **"Production"** (botão no topo para trocar)
4. ☐ Clique em **"SQL Editor"** (aba)
5. ☐ Cole o conteúdo do arquivo **`SQL_MIGRACAO_PRODUCAO.sql`**
6. ☐ Clique em **"Run"** ou **"Execute"**
7. ☐ Verifique a mensagem: "✅ Coluna phone adicionada" ou "✅ já existe"

---

### ☐ **ETAPA 2: REPUBLICAR DEPLOY**

1. ☐ Clique em **"Deployments"** (barra lateral esquerda)
2. ☐ Clique em **"Republish"** (botão grande)
3. ☐ **AGUARDE 2-3 MINUTOS** (não feche a página)
4. ☐ Verifique que o status mudou para "Running" ou "Success"

---

### ☐ **ETAPA 3: VERIFICAR LOGS**

1. ☐ Ainda em "Deployments", clique na aba **"Logs"**
2. ☐ Role até o final dos logs
3. ☐ Procure por **erros em vermelho**
4. ☐ Se encontrar erro "column phone does not exist":
   - ☐ Volte para ETAPA 1 e execute a migração novamente

---

### ☐ **ETAPA 4: TESTAR EM PRODUÇÃO**

1. ☐ Abra uma **aba anônima/privada** no navegador
2. ☐ Acesse: **https://mixapp.digital/phone-auth**
3. ☐ Verifique se a página carrega corretamente
4. ☐ Teste o **toggle** "Cadastrar" ↔ "Entrar"
5. ☐ Teste **cadastro** com um telefone
6. ☐ Teste **login** com o mesmo telefone
7. ☐ Confirme que tudo funciona

---

### ☐ **ETAPA 5: TESTE COMPLETO**

1. ☐ Cadastre um novo usuário
2. ☐ Faça login
3. ☐ Complete o onboarding
4. ☐ Acesse /discover
5. ☐ Confirme que tudo funciona

---

## ✅ QUANDO MARCAR COMO CONCLUÍDO

- ☐ Migração executada sem erros
- ☐ Deploy republicado com sucesso
- ☐ Logs sem erros
- ☐ Testes em produção funcionando
- ☐ Cadastro e login com telefone OK

---

## ⚠️ SE ALGO DER ERRADO

| Problema | Solução |
|----------|---------|
| "column phone does not exist" | Execute migração SQL novamente |
| Página não atualiza | Teste em modo anônimo + limpe cache |
| Deploy falha | Verifique logs em Deployments → Logs |
| Formulário não envia | Verifique console do navegador (F12) |

---

**🎯 TEMPO ESTIMADO: 10-15 MINUTOS**
