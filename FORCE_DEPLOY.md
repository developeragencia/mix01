# 🚨 INSTRUÇÃO URGENTE - FORÇAR DEPLOY

## O PROBLEMA:
O código está atualizado em desenvolvimento mas NÃO em produção.
mixapp.digital ainda está com código antigo.

## SOLUÇÃO DEFINITIVA:

### OPÇÃO 1: REPUBLICAR COM "FORCE REBUILD"
1. Replit → Aba "Deployments"
2. Clique nos 3 pontinhos (⋮) ao lado de "Republish"
3. Selecione "Force Rebuild" ou "Rebuild"
4. Aguarde 3-5 minutos

### OPÇÃO 2: CRIAR NOVO DEPLOY
1. Replit → Aba "Deployments"
2. Clique em "Create deployment"
3. Aguarde o novo deploy finalizar
4. O novo deploy vai ter um URL novo
5. Configure mixapp.digital para apontar para o novo deploy

### OPÇÃO 3: USAR A SHELL (MAIS RÁPIDO)
1. Replit → Abra a aba "Shell"
2. Cole este comando EXATO:
```bash
touch .force-rebuild-$(date +%s)
```
3. Pressione ENTER
4. Vá em "Deployments" → "Republish"

## APÓS QUALQUER OPÇÃO:
Aguarde 3-5 minutos e teste:
→ https://mixapp.digital/phone-auth

🎯 O cadastro e login com celular DEVEM funcionar!
