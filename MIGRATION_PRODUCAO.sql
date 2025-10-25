-- ==========================================
-- MIGRAÇÃO PARA BANCO DE PRODUÇÃO
-- Execute este SQL no banco de PRODUÇÃO
-- ==========================================

-- 1. Adicionar coluna phone (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone'
    ) THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
        RAISE NOTICE 'Coluna phone adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna phone já existe';
    END IF;
END $$;

-- 2. Verificar resultado
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
