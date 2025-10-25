-- ⚡ OTIMIZAÇÕES DE PERFORMANCE - ÍNDICES ADICIONAIS
-- Execute este script no banco de dados Neon via MCP para melhorar a performance

-- ✅ 1. Índice composto para matches (melhora queries de conversas)
CREATE INDEX IF NOT EXISTS idx_matches_user1_created 
ON matches(user1_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_matches_user2_created 
ON matches(user2_id, created_at DESC);

-- ✅ 2. Índice para messages com match_id e timestamp (melhora queries de chat)
CREATE INDEX IF NOT EXISTS idx_messages_match_timestamp 
ON messages(match_id, created_at DESC);

-- ✅ 3. Índice para last message lookup (melhora lista de conversas)
CREATE INDEX IF NOT EXISTS idx_messages_match_sender 
ON messages(match_id, sender_id, created_at DESC);

-- ✅ 4. Índice para profiles lookup (melhora discover)
CREATE INDEX IF NOT EXISTS idx_profiles_user_active 
ON profiles(user_id) WHERE user_id IS NOT NULL;

-- ✅ 5. Índice para swipes por data (melhora filtros temporais)
CREATE INDEX IF NOT EXISTS idx_swipes_swiped_date 
ON swipes(swiped_id, created_at DESC);

-- ✅ 6. Índice para users online status (melhora queries de presença)
CREATE INDEX IF NOT EXISTS idx_users_online 
ON users(last_seen DESC) WHERE last_seen IS NOT NULL;

-- ✅ 7. Índice para verificação de usuários
CREATE INDEX IF NOT EXISTS idx_users_verified 
ON users(is_verified) WHERE is_verified = true;

-- ✅ 8. Índice para blocks (melhora filtros de bloqueados)
CREATE INDEX IF NOT EXISTS idx_blocks_blocker 
ON blocks(blocker_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blocks_blocked 
ON blocks(blocked_user_id);

-- ✅ 9. Índice composto para swipes (evita duplicatas e melhora queries)
CREATE UNIQUE INDEX IF NOT EXISTS idx_swipes_unique 
ON swipes(swiper_id, swiped_id);

-- ✅ 10. Índice para mensagens não lidas
CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON messages(match_id, is_read, created_at DESC) 
WHERE is_read = false;

-- ✅ VACUUM ANALYZE para atualizar estatísticas
VACUUM ANALYZE matches;
VACUUM ANALYZE messages;
VACUUM ANALYZE profiles;
VACUUM ANALYZE swipes;
VACUUM ANALYZE users;
VACUUM ANALYZE blocks;

-- ✅ Resultado
SELECT 'Performance indexes criados com sucesso! ⚡' as status;

