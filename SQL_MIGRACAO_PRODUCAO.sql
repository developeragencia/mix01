-- ==========================================
-- MIGRAÇÃO COMPLETA PARA BANCO DE PRODUÇÃO
-- Mix App Digital - https://mixapp.digital
-- ==========================================

-- INSTRUÇÃO: Cole TODO este arquivo no SQL Editor do banco de PRODUÇÃO

-- 1. Adicionar coluna phone
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone'
    ) THEN
        ALTER TABLE users ADD COLUMN phone TEXT;
        RAISE NOTICE '✅ Coluna phone adicionada';
    ELSE
        RAISE NOTICE '✅ Coluna phone já existe';
    END IF;
END $$;

-- 2. Verificar e adicionar outras colunas críticas
DO $$ 
DECLARE
    missing_columns TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- birth_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'birth_date'
    ) THEN
        ALTER TABLE users ADD COLUMN birth_date TEXT;
        missing_columns := array_append(missing_columns, 'birth_date');
    END IF;
    
    -- gender
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'gender'
    ) THEN
        ALTER TABLE users ADD COLUMN gender TEXT;
        missing_columns := array_append(missing_columns, 'gender');
    END IF;
    
    -- interested_in
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'interested_in'
    ) THEN
        ALTER TABLE users ADD COLUMN interested_in TEXT[] DEFAULT ARRAY[]::TEXT[];
        missing_columns := array_append(missing_columns, 'interested_in');
    END IF;
    
    -- photos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'photos'
    ) THEN
        ALTER TABLE users ADD COLUMN photos TEXT[] DEFAULT ARRAY[]::TEXT[];
        missing_columns := array_append(missing_columns, 'photos');
    END IF;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE NOTICE '✅ Colunas adicionadas: %', array_to_string(missing_columns, ', ');
    ELSE
        RAISE NOTICE '✅ Todas as colunas críticas já existem';
    END IF;
END $$;

-- 3. Verificar resultado
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('phone', 'birth_date', 'gender', 'interested_in', 'photos')
ORDER BY column_name;

-- 4. Mensagem final
DO $$ 
BEGIN
    RAISE NOTICE '🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!';
    RAISE NOTICE '📝 Próximo passo: Deployments → Republish';
END $$;
