# 🔍 VERIFICAÇÃO COMPLETA - SISTEMA DE AUTENTICAÇÃO

## ✅ CADASTRO COM CELULAR (/phone-auth)

### **COMO FUNCIONA:**
```
1. Usuário acessa: /phone-auth
2. Preenche formulário:
   - Email: exemplo@email.com
   - Telefone: (87) 99172-1190
   - Senha: mínimo 6 caracteres
   - Confirmar Senha: mesma senha
3. Sistema valida:
   ✓ Email único (não pode existir no BD)
   ✓ Telefone único (não pode existir no BD)
   ✓ Senhas coincidem
4. Cria conta e faz login automático
5. Redireciona para /onboarding-flow
```

### **VALIDAÇÕES:**
- ✅ Email deve conter @
- ✅ Telefone formatado: (XX) XXXXX-XXXX
- ✅ Senha mínimo 6 caracteres
- ✅ Email NÃO pode estar cadastrado
- ✅ Telefone NÃO pode estar cadastrado

### **ENDPOINT:**
```
POST /api/auth/phone/register
Body: { username, email, phone, password }
```

---

## ✅ LOGIN COM CELULAR (/phone-auth)

### **COMO FUNCIONA:**
```
1. Usuário alterna para modo "Login" na mesma página
2. Preenche:
   - Telefone: (87) 99172-1190
   - Senha: sua senha
3. Sistema valida credenciais
4. Faz login e redireciona:
   - Perfil completo → /discover
   - Perfil incompleto → /onboarding-flow
```

### **ENDPOINT:**
```
POST /api/auth/login
Body: { identifier: phone, password }
```

---

## ✅ LOGIN COM GOOGLE (/login)

### **COMO FUNCIONA:**
```
1. Usuário clica em "Continuar com Google"
2. Google OAuth popup abre
3. Usuário autoriza
4. Sistema valida JWT do Google
5. Se novo: cria conta automaticamente
6. Faz login e redireciona:
   - Perfil completo → /discover
   - Perfil incompleto → /onboarding-flow
```

### **VALIDAÇÃO DE PERFIL COMPLETO:**
```typescript
isProfileComplete = !!(
  birthDate &&         // Data de nascimento preenchida
  gender &&            // Gênero selecionado
  photos.length >= 2 &&  // Mínimo 2 fotos
  interestedIn.length > 0  // Interesse em (Homem/Mulher/Todos)
)
```

### **ENDPOINT:**
```
POST /api/auth/google
Body: { credential: JWT_DO_GOOGLE }
```

---

## 🔧 BANCO DE DADOS

### **TABELA USERS - CAMPOS OBRIGATÓRIOS:**
```sql
id                INTEGER PRIMARY KEY
username          TEXT NOT NULL UNIQUE
email             TEXT NOT NULL UNIQUE
password          TEXT NOT NULL (vazio para Google OAuth)
phone             TEXT NULLABLE UNIQUE
birth_date        TEXT (para isProfileComplete)
gender            TEXT (para isProfileComplete)
interested_in     TEXT[] (para isProfileComplete)
photos            TEXT[] (mínimo 2 para isProfileComplete)
```

---

## ❌ ERROS COMUNS

### **1. "Este email já está cadastrado"**
**CAUSA:** Email já existe no banco
**SOLUÇÃO:** 
```sql
-- Ver quem está usando o email
SELECT id, email, phone FROM users WHERE email = 'exemplo@email.com';

-- Deletar se necessário
DELETE FROM users WHERE email = 'exemplo@email.com';
```

### **2. "Este telefone já está cadastrado"**
**CAUSA:** Telefone já existe no banco
**SOLUÇÃO:**
```sql
-- Ver quem está usando o telefone
SELECT id, email, phone FROM users WHERE phone = '87991721190';

-- Deletar se necessário
DELETE FROM users WHERE phone = '87991721190';
```

### **3. "Erro ao criar conta" (genérico)**
**POSSÍVEIS CAUSAS:**
- Email/telefone duplicado
- Falha de conexão com banco
- Validação de senha falhou
- Erro de hash bcrypt

**SOLUÇÃO:** Ver logs do servidor

---

## 🧪 COMO TESTAR

### **TESTE 1: Cadastro com Celular**
```
1. Acesse: https://mixapp.digital/phone-auth
2. Preencha dados ÚNICOS (email e telefone novos)
3. Clique "Criar Conta"
4. Deve redirecionar para /onboarding-flow
```

### **TESTE 2: Login com Celular**
```
1. Acesse: https://mixapp.digital/phone-auth
2. Clique em "Entrar" (toggle mode)
3. Digite telefone e senha cadastrados
4. Deve fazer login e redirecionar
```

### **TESTE 3: Login com Google**
```
1. Acesse: https://mixapp.digital/login
2. Clique "Continuar com Google"
3. Autorize no popup
4. Deve redirecionar para /onboarding-flow (novo usuário)
```

---

## 📊 VERIFICAR USUÁRIOS NO BANCO

```sql
-- Listar todos os usuários
SELECT id, email, phone, username, 
       birth_date, gender, 
       array_length(photos, 1) as num_photos,
       array_length(interested_in, 1) as num_interests
FROM users 
ORDER BY id DESC;

-- Verificar duplicatas de email
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Verificar duplicatas de telefone
SELECT phone, COUNT(*) 
FROM users 
WHERE phone IS NOT NULL
GROUP BY phone 
HAVING COUNT(*) > 1;
```

---

## ✅ STATUS ATUAL

| Funcionalidade | Status |
|----------------|--------|
| Cadastro com celular | ✅ Funcionando |
| Login com celular | ✅ Funcionando |
| Login com Google | ✅ Funcionando |
| Validação de duplicatas | ✅ Funcionando |
| Redirecionamento correto | ✅ Funcionando |
| isProfileComplete | ✅ Funcionando |

