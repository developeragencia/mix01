# 🚨 CORREÇÃO PARA PRODUÇÃO - PASSO A PASSO

## ⚡ EXECUTE ESTE SQL NO BANCO DE PRODUÇÃO

### **PASSO 1: ACESSAR BANCO DE PRODUÇÃO**

1. No Replit, clique em **"Database"** (barra lateral esquerda)
2. No topo da página, clique em **"Production"** (trocar de Development para Production)
3. Clique na aba **"SQL Editor"**

---

### **PASSO 2: EXECUTAR ESTA MIGRAÇÃO**

Cole este código SQL e clique em **"Run"**:

```sql
-- Adicionar coluna phone (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone'
    ) THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
        RAISE NOTICE 'Coluna phone adicionada';
    END IF;
END $$;
```

---

### **PASSO 3: VERIFICAR SE FUNCIONOU**

Execute este SQL para verificar:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'phone';
```

**Deve retornar:**
```
column_name
-----------
phone
```

---

### **PASSO 4: REPUBLICAR**

1. Clique em 🚀 **"Deployments"**
2. Clique em 🔄 **"Republish"**
3. Aguarde 2-3 minutos

---

### **PASSO 5: TESTAR**

Acesse: https://mixapp.digital/phone-auth

**Deve aparecer:**
- ✅ Página com formulário de telefone
- ✅ Toggle entre "Cadastrar" e "Entrar"
- ✅ Campos funcionando

---

## 📋 RESUMO RÁPIDO

```
1. Database → Production → SQL Editor
2. Cole o SQL de migração
3. Clique em "Run"
4. Deployments → Republish
5. Aguarde e teste
```

**É SÓ ISSO! 🎉**
