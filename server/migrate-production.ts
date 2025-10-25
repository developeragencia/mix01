import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Migration automática para produção
 * Executa automaticamente quando o app inicia em produção
 */
export async function migrateProduction() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('⏭️  Skipping production migration (not in production mode)');
    return;
  }

  console.log('🔄 Running production database migration...');

  try {
    // 1. Verificar se coluna phone existe
    const phoneExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone'
      ) as exists
    `);

    const hasPhone = (phoneExists.rows[0] as any)?.exists;

    if (!hasPhone) {
      console.log('📝 Adding phone column to users table...');
      await db.execute(sql`ALTER TABLE users ADD COLUMN phone TEXT`);
      console.log('✅ Phone column added');
    } else {
      console.log('✅ Phone column already exists');
    }

    // 2. Criar índice único para phone
    console.log('📝 Creating unique index for phone...');
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS users_phone_unique 
      ON users(phone) WHERE phone IS NOT NULL AND phone != ''
    `);
    console.log('✅ Phone index created');

    // 3. Verificar todas as colunas necessárias
    const requiredColumns = [
      'birth_date',
      'gender',
      'sexual_orientation',
      'interested_in',
      'city',
      'location',
      'education',
      'company',
      'school',
      'interests',
      'bio',
      'photos'
    ];

    for (const column of requiredColumns) {
      const exists = await db.execute(sql.raw(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = '${column}'
        ) as exists
      `));

      const hasColumn = (exists.rows[0] as any)?.exists;

      if (!hasColumn) {
        console.log(`📝 Adding column: ${column}...`);
        
        // Determinar o tipo da coluna
        if (['sexual_orientation', 'interested_in', 'interests', 'photos'].includes(column)) {
          await db.execute(sql.raw(`ALTER TABLE users ADD COLUMN ${column} TEXT[] DEFAULT '{}'`));
        } else {
          await db.execute(sql.raw(`ALTER TABLE users ADD COLUMN ${column} TEXT`));
        }
        
        console.log(`✅ Column ${column} added`);
      }
    }

    console.log('🎉 Production migration completed successfully!');
  } catch (error) {
    console.error('❌ Production migration failed:', error);
    // Não bloquear o app se a migração falhar
    console.error('⚠️  App will continue, but database may need manual migration');
  }
}
