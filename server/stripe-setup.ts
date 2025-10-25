import Stripe from "stripe";
import { storage } from "./storage";

// Make Stripe optional for development
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    })
  : null;

export async function createStripeProducts() {
  if (!stripe) {
    console.log("⚠️  Stripe not configured - skipping product creation (development mode)");
    console.log("💡 To enable Stripe: Add STRIPE_SECRET_KEY to Replit Secrets");
    return { premiumPriceId: 'price_1234567890premium', vipPriceId: 'price_1234567890vip' };
  }
  
  console.log("🔵 Creating real Stripe products and prices...");
  
  try {
    // Create Premium Product
    const premiumProduct = await stripe.products.create({
      name: 'Mix Premium',
      description: 'Plano Premium do Mix App Digital - Likes ilimitados, Super Likes e mais!',
      metadata: {
        app: 'mix-dating',
        plan: 'premium'
      }
    });

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 2990, // R$ 29,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'premium'
      }
    });

    // Create VIP Product
    const vipProduct = await stripe.products.create({
      name: 'Mix VIP',
      description: 'Plano VIP do Mix App Digital - Todos os recursos Premium + Suporte prioritário e recursos exclusivos!',
      metadata: {
        app: 'mix-dating',
        plan: 'vip'
      }
    });

    const vipPrice = await stripe.prices.create({
      product: vipProduct.id,
      unit_amount: 4990, // R$ 49,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'vip'
      }
    });

    console.log("✅ Stripe products created successfully:");
    console.log(`Premium Price ID: ${premiumPrice.id}`);
    console.log(`VIP Price ID: ${vipPrice.id}`);

    // Update database with real price IDs
    await updateDatabasePriceIds(premiumPrice.id, vipPrice.id);

    return {
      premiumPriceId: premiumPrice.id,
      vipPriceId: vipPrice.id
    };

  } catch (error) {
    console.error("❌ Error creating Stripe products:", error);
    throw error;
  }
}

async function updateDatabasePriceIds(premiumPriceId: string, vipPriceId: string) {
  try {
    console.log("🔵 Updating database with real Price IDs...");
    
    // Get current plans
    const plans = await storage.getSubscriptionPlans();
    
    for (const plan of plans) {
      if (plan.name === 'Premium') {
        // Update Premium plan with real price ID
        const updatedPlan = await storage.createSubscriptionPlan({
          name: plan.name,
          stripePriceId: premiumPriceId,
          price: plan.price,
          currency: plan.currency,
          interval: plan.interval,
          features: JSON.stringify(plan.features),
          isActive: true
        });
        console.log(`✅ Updated Premium plan with price ID: ${premiumPriceId}`);
      } else if (plan.name === 'VIP') {
        // Update VIP plan with real price ID
        const updatedPlan = await storage.createSubscriptionPlan({
          name: plan.name,
          stripePriceId: vipPriceId,
          price: plan.price,
          currency: plan.currency,
          interval: plan.interval,
          features: JSON.stringify(plan.features),
          isActive: true
        });
        console.log(`✅ Updated VIP plan with price ID: ${vipPriceId}`);
      }
    }

    console.log("✅ Database updated with real Price IDs");
  } catch (error) {
    console.error("❌ Error updating database:", error);
    throw error;
  }
}