-- ==========================================
-- FIX URGENTE PARA PRODUÇÃO
-- Execute AGORA no banco de PRODUÇÃO
-- ==========================================

-- 1. Adicionar coluna phone se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone'
    ) THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
        RAISE NOTICE '✅ Coluna phone adicionada';
    ELSE
        RAISE NOTICE '⚠️ Coluna phone já existe';
    END IF;
END $$;

-- 2. Criar índice único para phone (prevenir duplicatas)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'users_phone_unique'
    ) THEN
        CREATE UNIQUE INDEX users_phone_unique ON users(phone) WHERE phone IS NOT NULL AND phone != '';
        RAISE NOTICE '✅ Índice único para phone criado';
    ELSE
        RAISE NOTICE '⚠️ Índice phone já existe';
    END IF;
END $$;

-- 3. Verificar estrutura da tabela users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 4. Limpar cadastros duplicados/problemáticos (se houver)
DELETE FROM users WHERE email = 'gruposafdigital@gmail.com' OR phone = '87991721190';

RAISE NOTICE '🎉 FIX CONCLUÍDO! Agora teste: https://mixapp.digital/phone-auth';
