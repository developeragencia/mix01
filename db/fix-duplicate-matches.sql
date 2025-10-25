-- ✅ CORREÇÃO: Remover matches duplicados e adicionar índice único
-- Execute este script no banco de dados Neon

-- 1. Verificar se há duplicatas ANTES
SELECT 
  user1_id, 
  user2_id, 
  COUNT(*) as duplicates
FROM matches
GROUP BY user1_id, user2_id
HAVING COUNT(*) > 1;

-- 2. Remover duplicatas mantendo apenas o mais antigo (menor ID)
DELETE FROM matches
WHERE id NOT IN (
  SELECT MIN(id)
  FROM matches
  GROUP BY 
    LEAST(user1_id, user2_id),
    GREATEST(user1_id, user2_id)
);

-- 3. Adicionar índice único para prevenir duplicatas futuras
-- (considerando que o match pode ser user1→user2 ou user2→user1)
CREATE UNIQUE INDEX IF NOT EXISTS idx_matches_unique_pair 
ON matches (
  LEAST(user1_id, user2_id), 
  GREATEST(user1_id, user2_id)
);

-- 4. Verificar resultado
SELECT 
  COUNT(*) as total_matches,
  COUNT(DISTINCT CONCAT(LEAST(user1_id, user2_id), '-', GREATEST(user1_id, user2_id))) as unique_pairs
FROM matches;

-- 5. Log de sucesso
SELECT 'Duplicatas removidas e índice único criado! ✅' as status;

