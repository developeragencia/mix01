import { db } from '../server/db';
import { 
  users, profiles, swipes, matches, messages, 
  subscriptionPlans, subscriptions, payments,
  favorites, checkIns, establishments, boosts,
  rewinds, verifications, profileViews, reports,
  appSettings, adminUsers, notifications
} from '../shared/schema';
import fs from 'fs';
import path from 'path';

async function restoreDatabase(backupFilePath: string) {
  console.log('🔵 Iniciando restauração do banco de dados...');
  console.log(`📁 Arquivo: ${backupFilePath}`);
  
  try {
    if (!fs.existsSync(backupFilePath)) {
      throw new Error(`Arquivo de backup não encontrado: ${backupFilePath}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));
    console.log(`📊 Backup criado em: ${backupData.timestamp}`);
    console.log(`📊 Versão: ${backupData.version}`);

    console.log('\n⚠️  ATENÇÃO: Este processo irá SUBSTITUIR todos os dados existentes!');
    console.log('⚠️  Certifique-se de ter um backup antes de continuar.\n');

    if (backupData.tables.subscriptionPlans && backupData.tables.subscriptionPlans.length > 0) {
      console.log('📊 Restaurando subscription_plans...');
      for (const plan of backupData.tables.subscriptionPlans) {
        await db.insert(subscriptionPlans).values(plan).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.subscriptionPlans.length} planos restaurados`);
    }

    if (backupData.tables.users && backupData.tables.users.length > 0) {
      console.log('📊 Restaurando users...');
      for (const user of backupData.tables.users) {
        await db.insert(users).values(user).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.users.length} usuários restaurados`);
    }

    if (backupData.tables.profiles && backupData.tables.profiles.length > 0) {
      console.log('📊 Restaurando profiles...');
      for (const profile of backupData.tables.profiles) {
        await db.insert(profiles).values(profile).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.profiles.length} perfis restaurados`);
    }

    if (backupData.tables.swipes && backupData.tables.swipes.length > 0) {
      console.log('📊 Restaurando swipes...');
      for (const swipe of backupData.tables.swipes) {
        await db.insert(swipes).values(swipe).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.swipes.length} swipes restaurados`);
    }

    if (backupData.tables.matches && backupData.tables.matches.length > 0) {
      console.log('📊 Restaurando matches...');
      for (const match of backupData.tables.matches) {
        await db.insert(matches).values(match).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.matches.length} matches restaurados`);
    }

    if (backupData.tables.messages && backupData.tables.messages.length > 0) {
      console.log('📊 Restaurando messages...');
      for (const message of backupData.tables.messages) {
        await db.insert(messages).values(message).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.messages.length} mensagens restauradas`);
    }

    if (backupData.tables.subscriptions && backupData.tables.subscriptions.length > 0) {
      console.log('📊 Restaurando subscriptions...');
      for (const subscription of backupData.tables.subscriptions) {
        await db.insert(subscriptions).values(subscription).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.subscriptions.length} assinaturas restauradas`);
    }

    if (backupData.tables.payments && backupData.tables.payments.length > 0) {
      console.log('📊 Restaurando payments...');
      for (const payment of backupData.tables.payments) {
        await db.insert(payments).values(payment).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.payments.length} pagamentos restaurados`);
    }

    if (backupData.tables.checkIns && backupData.tables.checkIns.length > 0) {
      console.log('📊 Restaurando check_ins...');
      for (const checkIn of backupData.tables.checkIns) {
        await db.insert(checkIns).values(checkIn).onConflictDoNothing();
      }
      console.log(`✅ ${backupData.tables.checkIns.length} check-ins restaurados`);
    }

    console.log('\n✅ Restauração completa do banco de dados concluída!');
    console.log('📊 Todos os dados foram restaurados com sucesso.');
    
  } catch (error) {
    console.error('❌ Erro ao restaurar backup:', error);
    throw error;
  }
}

const backupFile = process.argv[2];
if (!backupFile) {
  console.error('❌ Por favor, forneça o caminho do arquivo de backup');
  console.log('Uso: npm run db:restore <caminho-do-arquivo>');
  process.exit(1);
}

restoreDatabase(backupFile)
  .then(() => {
    console.log('✅ Processo de restauração concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na restauração:', error);
    process.exit(1);
  });
