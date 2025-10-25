-- ✅ MIGRAÇÃO: Adicionar coluna is_profile_complete na tabela users
-- Execute este script no banco de dados Neon

-- 1. Adicionar coluna
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;

-- 2. Atualizar registros existentes baseado nos critérios:
--    - birthDate presente
--    - photos com pelo menos 2 itens
UPDATE users 
SET is_profile_complete = true
WHERE birth_date IS NOT NULL 
  AND photos IS NOT NULL 
  AND array_length(photos, 1) >= 2;

-- 3. Verificar resultado
SELECT 
  id,
  username,
  email,
  birth_date IS NOT NULL as has_birth_date,
  array_length(photos, 1) as photo_count,
  is_profile_complete
FROM users
ORDER BY id
LIMIT 20;

-- 4. Log de sucesso
SELECT 'Coluna is_profile_complete adicionada e usuários existentes atualizados! ✅' as status;

