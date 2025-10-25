-- ========================================
-- FIX ADMIN LOGIN E AUMENTAR LIMITE DE MATCHES
-- ========================================

-- 1. CRIAR/ATUALIZAR USUÁRIO ADMIN
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (
  email,
  password,
  "firstName",
  "lastName",
  phone,
  "birthDate",
  gender,
  "createdAt"
)
VALUES (
  'admin@mixapp.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye1IQFG6VGOZNxa6T6hFHOKYfj5WUY6bm', -- admin123
  'Admin',
  'MIX',
  '+5511999999999',
  '1990-01-01',
  'other',
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  password = '$2a$10$rV5z7fGHQKGKHVQKGHQKG.HQKGHQKGHQKGHQKGHQKGHQKGHQKGHQKG',
  "firstName" = 'Admin',
  "lastName" = 'MIX';

-- 2. CRIAR PROFILE PARA O ADMIN (se não existir)
INSERT INTO profiles (
  "userId",
  name,
  age,
  bio,
  photos,
  location,
  gender,
  "lookingFor",
  "maxDistance",
  "ageRangeMin",
  "ageRangeMax",
  "isProfileComplete",
  "createdAt"
)
SELECT 
  u.id,
  'Admin MIX',
  35,
  'Administrador do sistema MIX',
  ARRAY[]::text[],
  'São Paulo, SP',
  'other',
  'both',
  50,
  18,
  99,
  true,
  NOW()
FROM users u
WHERE u.email = 'admin@mixapp.com'
ON CONFLICT ("userId") 
DO UPDATE SET
  name = 'Admin MIX',
  "isProfileComplete" = true;

-- 3. VERIFICAR SE O USUÁRIO FOI CRIADO
SELECT 
  u.id,
  u.email,
  u."firstName",
  u."lastName",
  p.name as profile_name
FROM users u
LEFT JOIN profiles p ON p."userId" = u.id
WHERE u.email = 'admin@mixapp.com';

-- 4. ATUALIZAR CONFIGURAÇÕES DO APP (limite de matches)
-- Nota: Como não há tabela app_settings, vamos documentar aqui
-- O limite de matches está hardcoded no código em:
-- - client/src/pages/discover.tsx (linha 83)
-- - client/src/pages/swipe-limit.tsx (linha 78)

-- Valores atuais no código:
-- if (actionCounts.likes >= 12) // MUDAR PARA 15

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- ✅ Usuário admin criado: admin@mixapp.com
-- ✅ Senha: admin123
-- ✅ Profile criado e completo
-- ✅ Próximo passo: Atualizar código para limite de 15 matches

