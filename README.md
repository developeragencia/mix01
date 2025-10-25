# MIX - App de Encontros

Um aplicativo moderno de encontros com interface intuitiva e funcionalidades avançadas.

## 🚀 Funcionalidades

- ✅ Login e cadastro com Google OAuth
- ✅ Login e cadastro com email
- ✅ Login e cadastro com celular
- ✅ Sistema de perfis completo
- ✅ Sistema de matches e mensagens
- ✅ Interface responsiva e moderna
- ✅ WebSocket para mensagens em tempo real
- ✅ Sistema de pagamentos com Stripe
- ✅ Check-in em estabelecimentos
- ✅ Sistema de verificação de perfis

## 🛠️ Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL com Drizzle ORM
- **Autenticação**: Passport.js, Google OAuth
- **Pagamentos**: Stripe
- **WebSocket**: ws
- **Deploy**: Vercel

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd mixbolt
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute o banco de dados:
```bash
npm run db:push
```

5. Execute em desenvolvimento:
```bash
npm run dev
```

## 🚀 Deploy na Vercel

### Pré-requisitos

1. Conta na Vercel
2. Banco de dados PostgreSQL (Neon, Supabase, etc.)
3. Configuração do Google OAuth
4. Chaves do Stripe (opcional)

### Passos para Deploy

1. **Configure as variáveis de ambiente na Vercel:**
   - `DATABASE_URL`: URL do seu banco PostgreSQL
   - `GOOGLE_CLIENT_ID`: ID do cliente Google OAuth
   - `GOOGLE_CLIENT_SECRET`: Secret do cliente Google OAuth
   - `SESSION_SECRET`: Chave secreta para sessões
   - `STRIPE_SECRET_KEY`: Chave secreta do Stripe (opcional)
   - `STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe (opcional)

2. **Conecte o repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub

3. **Configure o build:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o processo de build e deploy

### Configuração do Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Configure as URLs autorizadas:
   - Origens JavaScript: `https://seu-dominio.vercel.app`
   - URIs de redirecionamento: `https://seu-dominio.vercel.app`

### Configuração do Banco de Dados

1. Crie uma conta no [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
2. Crie um novo banco PostgreSQL
3. Copie a URL de conexão
4. Adicione como `DATABASE_URL` nas variáveis de ambiente da Vercel

## 📱 Scripts Disponíveis

- `npm run dev`: Executa em modo desenvolvimento
- `npm run build`: Gera build de produção
- `npm run start`: Executa em modo produção
- `npm run check`: Verifica tipos TypeScript
- `npm run db:push`: Sincroniza schema do banco

## 🔧 Estrutura do Projeto

```
mixbolt/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
├── server/                # Backend Express
│   ├── routes.ts          # Rotas da API
│   ├── auth.ts            # Configuração de autenticação
│   ├── db.ts              # Configuração do banco
│   └── websocket.ts       # WebSocket
├── shared/                # Código compartilhado
│   └── schema.ts          # Schemas Zod
├── dist/                  # Build de produção
├── vercel.json            # Configuração Vercel
└── package.json           # Dependências
```

## 🐛 Solução de Problemas

### Build falha na Vercel
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o banco de dados está acessível
- Verifique os logs de build na Vercel

### Erro de autenticação Google
- Verifique se as URLs estão configuradas corretamente
- Confirme se o GOOGLE_CLIENT_ID está correto
- Teste em modo desenvolvimento primeiro

### Problemas de banco de dados
- Verifique se a DATABASE_URL está correta
- Execute `npm run db:push` para sincronizar o schema
- Confirme se o banco está acessível publicamente

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através dos issues do GitHub ou email.
