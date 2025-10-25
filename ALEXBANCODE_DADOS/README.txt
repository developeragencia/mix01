╔═══════════════════════════════════════════════════════════════════════════╗
║                     ALEXBANCODE_DADOS - MIX APP DIGITAL                   ║
║                     Variáveis de Ambiente e Configuração                  ║
╚═══════════════════════════════════════════════════════════════════════════╝

📁 CONTEÚDO DESTA PASTA:

1. VERCEL_ENV_VARIABLES.txt
   → Variáveis de ambiente para configurar na Vercel
   → Instruções passo a passo
   → Valores prontos para copiar e colar

2. NEON_DATABASE_SETUP.txt
   → Configuração completa do Neon PostgreSQL
   → Como criar e configurar o banco de dados
   → Comandos para sincronizar schema

3. ENV_TEMPLATE.env
   → Template do arquivo .env
   → Use para desenvolvimento local
   → Copie para .env e preencha com seus dados

4. mixapp-backup-2025-10-24T21-23-31-107Z.json (18 KB)
   → BACKUP COMPLETO DO BANCO DE DADOS
   → Contém todos os dados e tabelas
   → Use para restaurar o banco após deploy

5. README.txt (este arquivo)
   → Índice e instruções gerais

═══════════════════════════════════════════════════════════════════════════

🚀 INÍCIO RÁPIDO:

PARA DESENVOLVIMENTO LOCAL:
1. Copie ENV_TEMPLATE.env para .env
2. Configure sua DATABASE_URL do Neon
3. Execute: npm run dev
4. Restaure backup: npm run db:restore ALEXBANCODE_DADOS/mixapp-backup-2025-10-24T21-23-31-107Z.json

PARA DEPLOY NA VERCEL:
1. Leia VERCEL_ENV_VARIABLES.txt
2. Configure todas as variáveis no painel da Vercel
3. Faça o deploy
4. Restaure backup: npm run db:restore ALEXBANCODE_DADOS/mixapp-backup-2025-10-24T21-23-31-107Z.json

PARA CONFIGURAR NEON:
1. Leia NEON_DATABASE_SETUP.txt
2. Crie seu projeto no Neon
3. Copie a DATABASE_URL gerada

═══════════════════════════════════════════════════════════════════════════

🔑 INFORMAÇÕES IMPORTANTES:

SESSION_SECRET GERADA:
15300192c627734f2acf6dc6830918edc9e0f701c6cce095c39f90f83d39008d

⚠️ MANTENHA EM SEGREDO!
⚠️ Use esta chave tanto em desenvolvimento quanto em produção

═══════════════════════════════════════════════════════════════════════════

📊 USUÁRIO DE TESTE:

Email: teste@mixapp.com
Senha: 123456

Este usuário possui:
✓ Perfil completo com 3 fotos
✓ 2 matches ativos (Maria Silva e Ana Costa)
✓ 6 mensagens em conversas
✓ Todos os recursos disponíveis para teste

═══════════════════════════════════════════════════════════════════════════

💾 BACKUP DO BANCO DE DADOS:

📁 Arquivo: mixapp-backup-2025-10-24T21-23-31-107Z.json (18 KB)

Conteúdo:
✓ 5 usuários completos
✓ 5 perfis detalhados
✓ 2 matches criados
✓ 6 mensagens trocadas
✓ 5 swipes registrados
✓ 2 planos de assinatura (Premium e VIP)
✓ 19 tabelas completas do sistema

Como restaurar:
npm run db:restore ALEXBANCODE_DADOS/mixapp-backup-2025-10-24T21-23-31-107Z.json

⚠️ IMPORTANTE: Sempre restaure o backup APÓS configurar a DATABASE_URL e 
              executar npm run db:push para criar as tabelas!

═══════════════════════════════════════════════════════════════════════════

📋 CHECKLIST DE DEPLOY COMPLETO:

PASSO 1 - CONFIGURAR NEON:
□ Criar conta no Neon (https://console.neon.tech)
□ Criar novo projeto "MIX App Digital"
□ Copiar DATABASE_URL gerada

PASSO 2 - CONFIGURAR VERCEL:
□ Acessar: https://vercel.com/dashboard
□ Criar novo projeto ou selecionar existente
□ Ir em: Settings → Environment Variables
□ Adicionar DATABASE_URL do Neon
□ Adicionar SESSION_SECRET (ver acima)
□ Adicionar GOOGLE_CLIENT_ID (opcional)
□ Adicionar GOOGLE_CLIENT_SECRET (opcional)
□ Adicionar NODE_ENV=production

PASSO 3 - FAZER DEPLOY:
□ Executar: vercel --prod
□ Aguardar build completar
□ Verificar se deploy foi bem-sucedido

PASSO 4 - SINCRONIZAR BANCO:
□ Executar: npm run db:push
□ Verificar se todas as 19 tabelas foram criadas

PASSO 5 - RESTAURAR DADOS:
□ Executar: npm run db:restore ALEXBANCODE_DADOS/mixapp-backup-2025-10-24T21-23-31-107Z.json
□ Verificar se dados foram importados (5 usuários)

PASSO 6 - TESTAR APLICAÇÃO:
□ Acessar URL do deploy
□ Fazer login com: teste@mixapp.com / 123456
□ Verificar perfil, matches e mensagens
□ Testar todas as funcionalidades

PASSO 7 - CONFIGURAR DOMÍNIO (OPCIONAL):
□ Ir em: Settings → Domains
□ Adicionar: mixapp.digital
□ Configurar DNS conforme instruções
□ Aguardar propagação (pode levar até 48h)

═══════════════════════════════════════════════════════════════════════════

🔐 SEGURANÇA:

⚠️ NUNCA compartilhe estes arquivos publicamente
⚠️ NUNCA commite .env no Git
⚠️ NUNCA exponha credenciais em código
⚠️ Adicione ALEXBANCODE_DADOS/ ao .gitignore
⚠️ Use diferentes credenciais para dev/prod
⚠️ Rotacione senhas periodicamente
⚠️ Mantenha SESSION_SECRET em segredo absoluto

Adicione ao .gitignore:
.env
ALEXBANCODE_DADOS/
backups/

═══════════════════════════════════════════════════════════════════════════

📞 SUPORTE E DOCUMENTAÇÃO:

Neon PostgreSQL:
- Documentação: https://neon.tech/docs
- Console: https://console.neon.tech
- Discord: https://discord.gg/neon

Vercel:
- Documentação: https://vercel.com/docs
- Dashboard: https://vercel.com/dashboard
- Suporte: https://vercel.com/support

Google Cloud Console:
- Credenciais OAuth: https://console.cloud.google.com/apis/credentials
- Documentação: https://cloud.google.com/docs

Stripe:
- Dashboard: https://dashboard.stripe.com
- API Keys: https://dashboard.stripe.com/apikeys
- Documentação: https://stripe.com/docs

═══════════════════════════════════════════════════════════════════════════

🔧 COMANDOS ÚTEIS:

# Desenvolvimento local
npm run dev                    # Iniciar servidor de desenvolvimento

# Build e produção
npm run build                  # Build para produção
npm run start                  # Iniciar servidor de produção

# Banco de dados
npm run db:push                # Sincronizar schema com banco
npm run db:push --force        # Forçar sincronização
npm run db:backup              # Criar novo backup
npm run db:restore <arquivo>   # Restaurar backup

# Deploy
vercel                         # Deploy preview
vercel --prod                  # Deploy produção

═══════════════════════════════════════════════════════════════════════════

📊 ESTRUTURA DO BANCO (19 TABELAS):

Core:
✓ users - Usuários do sistema
✓ profiles - Perfis detalhados
✓ swipes - Histórico de swipes
✓ matches - Matches entre usuários
✓ messages - Mensagens do chat

Pagamentos:
✓ subscription_plans - Planos disponíveis
✓ subscriptions - Assinaturas ativas
✓ payments - Histórico de pagamentos

Features:
✓ favorites - Perfis favoritos
✓ check_ins - Check-ins em locais
✓ establishments - Estabelecimentos parceiros
✓ boosts - Impulsos de perfil
✓ rewinds - Voltar última ação
✓ verifications - Verificação de perfil
✓ profile_views - Visualizações de perfil

Admin:
✓ reports - Denúncias
✓ app_settings - Configurações do app
✓ admin_users - Administradores
✓ notifications - Notificações push

═══════════════════════════════════════════════════════════════════════════

📅 INFORMAÇÕES DO DOCUMENTO:

Gerado em: 24 de Outubro de 2025
Projeto: MIX App Digital
Versão do Banco: PostgreSQL 16 (Neon)
Framework: React + Express + TypeScript
Backup incluído: mixapp-backup-2025-10-24T21-23-31-107Z.json (18 KB)

═══════════════════════════════════════════════════════════════════════════

✅ TUDO PRONTO PARA DEPLOY EM MIXAPP.DIGITAL!

Esta pasta contém TUDO que você precisa:
📄 Variáveis de ambiente (Vercel)
🗄️ Configuração do banco (Neon)
💾 Backup completo dos dados
🔑 Credenciais de teste
📋 Checklist passo a passo

Siga as instruções e faça o deploy com confiança! 🚀

═══════════════════════════════════════════════════════════════════════════
