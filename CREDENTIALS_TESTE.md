# 🔐 Credenciais de Teste - MixApp Digital

## Usuário de Teste Principal

**Email:** `teste@mixapp.com`  
**Senha:** `123456`

Este usuário foi criado diretamente no banco de dados e está totalmente configurado para testar TODAS as funcionalidades do aplicativo.

---

## ✅ Recursos Disponíveis para Teste

### 1. **Perfil Completo**
- ✅ Nome: Teste MixApp
- ✅ Idade: 29 anos
- ✅ Profissão: Desenvolvedor de Software
- ✅ 3 fotos de perfil
- ✅ Bio completa
- ✅ Perfil verificado
- ✅ Todos os campos preenchidos (altura, interesses, idiomas, etc.)

### 2. **Matches Ativos (2)**
O usuário de teste já tem 2 matches criados:
- **Maria Silva** - Designer de Produto
- **Ana Costa** - Engenheira de Software (Google)

### 3. **Conversas com Mensagens**
Ambos os matches têm conversas ativas com mensagens de teste para você visualizar e interagir.

### 4. **Swipes Realizados**
- ✅ 2 likes enviados (com match mútuo)
- ✅ 1 super like enviado
- ✅ 2 likes recebidos

### 5. **Outros Usuários para Descobrir**
- **Julia Santos** - Estudante de Marketing (disponível para swipe)

---

## 📱 Como Fazer Login

### Opção 1: Login com Email (Recomendado para Teste)
1. Acesse a página de login: `/login`
2. Clique na aba **"Email"**
3. Digite:
   - Email: `teste@mixapp.com`
   - Senha: `123456`
4. Clique em **"Entrar"**

### Opção 2: Login com Google
- Requer configuração de credenciais OAuth válidas
- Atualmente com erro de origem (desenvolvimento)

---

## 🎯 Funcionalidades que Você Pode Testar

### ✅ Já Funcionais:
1. **Login/Autenticação** - Email + Senha
2. **Visualizar Perfil** - Perfil completo com fotos
3. **Descobrir Pessoas** - Swipe em novos perfis
4. **Ver Matches** - 2 matches pré-criados (Maria e Ana)
5. **Chat/Mensagens** - Conversas ativas com mensagens
6. **Enviar Mensagens** - Criar novas mensagens
7. **Visualizar Fotos** - Galeria de fotos do perfil
8. **Editar Perfil** - Atualizar informações pessoais
9. **Configurações** - Ajustar preferências

### 🚀 Próximos Passos:
- Check-ins em estabelecimentos
- Sistema de boost/rewind
- Upgrade de assinatura (Premium/VIP)
- Verificação de perfil
- Notificações push

---

## 🌐 Domínios Compatíveis

Este usuário funcionará em:
- ✅ **Desenvolvimento Local**: `http://localhost:5000`
- ✅ **Replit Preview**: `https://[repl-id].repl.co`
- ✅ **Produção**: `https://mixapp.digital` (quando publicado)

A senha está hasheada com bcrypt no banco de dados, garantindo segurança em todos os ambientes.

---

## 🔧 Detalhes Técnicos

### Tabelas Populadas:
- `users` - Usuário principal + 3 usuários adicionais
- `profiles` - 4 perfis completos
- `swipes` - 4 registros de swipes
- `matches` - 2 matches
- `messages` - 6 mensagens de teste

### Hash da Senha:
```
$2b$10$vyhuJ65e0l0Xz2gbtYiss.QBSyQjP7NDayerypyeK1OjlJDrq2xN2
```
(bcrypt hash de "123456" com 10 rounds - ✅ CORRIGIDO)

---

## 📊 Status do Banco de Dados

```sql
-- Verificar o usuário
SELECT id, username, email, first_name, subscription_type, is_online 
FROM users 
WHERE email = 'teste@mixapp.com';

-- Verificar matches
SELECT COUNT(*) as total_matches 
FROM matches 
WHERE user1_id = 1 OR user2_id = 1;

-- Verificar mensagens
SELECT COUNT(*) as total_messages 
FROM messages 
WHERE sender_id = 1;
```

---

## ⚠️ Notas Importantes

1. **Senha Simples**: A senha "123456" é apenas para testes. Em produção, use senhas fortes.
2. **Fotos Placeholder**: As fotos usam o serviço Pravatar (avatares genéricos).
3. **Dados de Teste**: Todos os dados são fictícios para fins de demonstração.
4. **Google OAuth**: Requer configuração de credenciais válidas para funcionar.

---

**Último Update:** 24 de Outubro de 2025  
**Status:** ✅ Usuário criado e totalmente funcional
