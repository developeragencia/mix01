# Configuração Google OAuth para MIX App (mixapp.digital)

## Como configurar o Google OAuth Console

### 1. Acessar Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Criar ou Selecionar Projeto
- Se não tem projeto: clique em "Criar Projeto"
- Nome sugerido: "MIX Dating App"
- Se já tem projeto: selecione o projeto desejado

### 3. Ativar Google+ API
- No menu lateral: "APIs e Serviços" → "Biblioteca"
- Procure por "Google+ API" e ative
- Procure por "Google People API" e ative (recomendado)

### 4. Criar Credenciais OAuth 2.0
- Vá em "APIs e Serviços" → "Credenciais"
- Clique em "+ CRIAR CREDENCIAIS"
- Selecione "ID do cliente OAuth 2.0"

### 5. Configurar Tela de Consentimento OAuth
Se for primeira vez:
- Clique em "CONFIGURAR TELA DE CONSENTIMENTO"
- Escolha "Externo" (para qualquer usuário Google)
- Preencha:
  - Nome do app: **MIX - Dating App**
  - Email de suporte: seu email
  - Logo: (opcional)
  - Domínio autorizado: **mixapp.digital**
  - Email do desenvolvedor: seu email

### 6. Criar ID do Cliente OAuth
- Tipo de aplicativo: **Aplicativo da Web**
- Nome: **MIX App Production**

#### Origens JavaScript autorizadas:
```
https://mixapp.digital
http://localhost:5000
```

#### URIs de redirecionamento autorizados:
```
https://mixapp.digital/api/auth/google/callback
http://localhost:5000/api/auth/google/callback
```

### 7. Copiar Credenciais
Após criar, você receberá:
- **ID do cliente**: começa com números e termina com `.apps.googleusercontent.com`
- **Chave secreta do cliente**: string aleatória

### 8. Configurar Variáveis de Ambiente
No arquivo `.env.local`:
```
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=sua_client_secret_aqui
```

### 9. Testar OAuth
1. Acesse: http://localhost:5000/login
2. Clique em "Entrar com Google"
3. Autorize o app
4. Deve redirecionar para /discover

## URLs Importantes

### Desenvolvimento:
- Login: http://localhost:5000/login
- OAuth: http://localhost:5000/api/auth/google
- Callback: http://localhost:5000/api/auth/google/callback

### Produção:
- Login: https://mixapp.digital/login  
- OAuth: https://mixapp.digital/api/auth/google
- Callback: https://mixapp.digital/api/auth/google/callback

## Resolução de Problemas

### Erro "redirect_uri_mismatch"
- Verifique se as URIs de redirecionamento estão exatas no Google Console
- Certifique-se que não há espaços ou caracteres extras

### Erro "access_denied"
- Usuário cancelou a autorização
- Normal, não é erro do sistema

### Erro "invalid_client"
- GOOGLE_CLIENT_ID incorreto
- Verifique se copiou corretamente

### Erro "invalid_grant"
- GOOGLE_CLIENT_SECRET incorreto
- Ou código de autorização expirado

## Configurações de Segurança

### Produção:
- Sempre usar HTTPS (https://mixapp.digital)
- Verificar domínio no Google Console
- Usar variáveis de ambiente seguras

### Desenvolvimento:
- HTTP permitido apenas para localhost
- Mesmas credenciais podem ser usadas

## Status Atual
✅ Callback configurado para: https://mixapp.digital/api/auth/google/callback
✅ Fallback para desenvolvimento: http://localhost:5000/api/auth/google/callback
✅ Sistema OAuth simplificado - cria usuário direto no banco
✅ Redirecionamento automático para /discover após login