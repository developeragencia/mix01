# Configuração dos Price IDs do Stripe - MIX Dating App

## ❌ Status Atual: Price IDs Placeholder (Sistema NÃO funcional para produção)

Os price IDs no banco de dados são placeholders e precisam ser substituídos pelos IDs reais do Stripe Dashboard.

**Price IDs atuais (PLACEHOLDER - NÃO FUNCIONAM):**
- Premium: `price_1234567890premium`
- VIP: `price_1234567890vip`

## ✅ Como Configurar Price IDs Reais

### 1. Acesse o Stripe Dashboard
1. Vá para [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Faça login com sua conta Stripe

### 2. Crie o Produto Premium
1. Clique em "Add product"
2. Nome: `MIX Premium`
3. Descrição: `Plano Premium do MIX Dating App`
4. Pricing model: `Recurring`
5. Price: `R$ 29,90`
6. Billing period: `Monthly`
7. Currency: `BRL (Brazilian Real)`
8. Clique em "Save product"
9. **COPIE O PRICE ID** (começa com `price_`) que aparece na página

### 3. Crie o Produto VIP
1. Clique em "Add product"
2. Nome: `MIX VIP`
3. Descrição: `Plano VIP do MIX Dating App`
4. Pricing model: `Recurring`
5. Price: `R$ 49,90`
6. Billing period: `Monthly`
7. Currency: `BRL (Brazilian Real)`
8. Clique em "Save product"
9. **COPIE O PRICE ID** (começa com `price_`) que aparece na página

### 4. Atualize o Banco de Dados
Execute os comandos SQL abaixo no banco PostgreSQL para atualizar os price IDs:

```sql
-- Substitua price_XXXXXXXXXXX pelos price IDs reais copiados do Stripe
UPDATE subscription_plans 
SET stripe_price_id = 'price_XXXXXXXXXXX' 
WHERE name = 'Premium';

UPDATE subscription_plans 
SET stripe_price_id = 'price_YYYYYYYYYYY' 
WHERE name = 'VIP';
```

## 🔧 Status dos Price IDs no Sistema

**Planos configurados no banco:**
- ✅ Premium: R$ 29,90/mês - Recursos: Likes ilimitados, 5 Super Likes, 1 Boost, Ver quem curtiu
- ✅ VIP: R$ 49,90/mês - Recursos: Likes ilimitados, 20 Super Likes, 5 Boosts, Suporte prioritário

**Status da integração:**
- ✅ Tabelas do banco criadas
- ✅ APIs Stripe implementadas
- ✅ Frontend de pagamento configurado
- ❌ **Price IDs reais do Stripe PENDENTES**

## 🚀 Após Configurar os Price IDs

1. Os planos Premium e VIP funcionarão com pagamentos reais
2. Usuários poderão assinar mensalmente via cartão de crédito
3. Sistema de cancelamento funcionará automaticamente
4. Renovação automática ativa por padrão

## ⚠️ IMPORTANTE

**SEM os price IDs reais do Stripe, o sistema de pagamento NÃO funcionará em produção.**

Após configurar os price IDs, o aplicativo estará 100% pronto para aceitar pagamentos reais de usuários.