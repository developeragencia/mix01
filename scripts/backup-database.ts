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

async function backupDatabase() {
  console.log('🔵 Iniciando backup completo do banco de dados...');
  
  try {
    const backup: any = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: 'mixapp',
      tables: {}
    };

    console.log('📊 Exportando tabela users...');
    backup.tables.users = await db.select().from(users);
    
    console.log('📊 Exportando tabela profiles...');
    backup.tables.profiles = await db.select().from(profiles);
    
    console.log('📊 Exportando tabela swipes...');
    backup.tables.swipes = await db.select().from(swipes);
    
    console.log('📊 Exportando tabela matches...');
    backup.tables.matches = await db.select().from(matches);
    
    console.log('📊 Exportando tabela messages...');
    backup.tables.messages = await db.select().from(messages);
    
    console.log('📊 Exportando tabela subscription_plans...');
    backup.tables.subscriptionPlans = await db.select().from(subscriptionPlans);
    
    console.log('📊 Exportando tabela subscriptions...');
    backup.tables.subscriptions = await db.select().from(subscriptions);
    
    console.log('📊 Exportando tabela payments...');
    backup.tables.payments = await db.select().from(payments);
    
    console.log('📊 Exportando tabela favorites...');
    backup.tables.favorites = await db.select().from(favorites);
    
    console.log('📊 Exportando tabela check_ins...');
    backup.tables.checkIns = await db.select().from(checkIns);
    
    console.log('📊 Exportando tabela establishments...');
    backup.tables.establishments = await db.select().from(establishments);
    
    console.log('📊 Exportando tabela boosts...');
    backup.tables.boosts = await db.select().from(boosts);
    
    console.log('📊 Exportando tabela rewinds...');
    backup.tables.rewinds = await db.select().from(rewinds);
    
    console.log('📊 Exportando tabela verifications...');
    backup.tables.verifications = await db.select().from(verifications);
    
    console.log('📊 Exportando tabela profile_views...');
    backup.tables.profileViews = await db.select().from(profileViews);
    
    console.log('📊 Exportando tabela reports...');
    backup.tables.reports = await db.select().from(reports);
    
    console.log('📊 Exportando tabela app_settings...');
    backup.tables.appSettings = await db.select().from(appSettings);
    
    console.log('📊 Exportando tabela admin_users...');
    backup.tables.adminUsers = await db.select().from(adminUsers);
    
    console.log('📊 Exportando tabela notifications...');
    backup.tables.notifications = await db.select().from(notifications);

    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `mixapp-backup-${timestamp}.json`);
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup completo criado com sucesso!');
    console.log(`📁 Arquivo: ${backupFile}`);
    console.log(`📊 Total de registros:`);
    console.log(`   - Users: ${backup.tables.users.length}`);
    console.log(`   - Profiles: ${backup.tables.profiles.length}`);
    console.log(`   - Swipes: ${backup.tables.swipes.length}`);
    console.log(`   - Matches: ${backup.tables.matches.length}`);
    console.log(`   - Messages: ${backup.tables.messages.length}`);
    console.log(`   - Subscription Plans: ${backup.tables.subscriptionPlans.length}`);
    console.log(`   - Total de tabelas: ${Object.keys(backup.tables).length}`);
    
    return backupFile;
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error);
    throw error;
  }
}

backupDatabase()
  .then(() => {
    console.log('✅ Processo de backup concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha no backup:', error);
    process.exit(1);
  });
