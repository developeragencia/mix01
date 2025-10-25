-- =====================================================
-- RECRIAR BANCO DE PRODUÇÃO COMPLETO
-- Execute TODO este código no SQL Editor do banco de PRODUÇÃO
-- =====================================================

-- ATENÇÃO: Isso vai APAGAR TODOS OS DADOS!
-- Se você tem dados importantes, faça backup antes!

-- 1. DROPAR TODAS AS TABELAS
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. RECRIAR TABELA USERS COM TODAS AS COLUNAS CORRETAS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expiry TIMESTAMP,
  is_online BOOLEAN DEFAULT false NOT NULL,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subscription_type TEXT DEFAULT 'free' NOT NULL,
  daily_likes INTEGER DEFAULT 0 NOT NULL,
  last_like_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  first_name TEXT DEFAULT '' NOT NULL,
  last_name TEXT DEFAULT '' NOT NULL,
  profile_image TEXT,
  phone TEXT,
  birth_date TEXT,
  gender TEXT,
  sexual_orientation TEXT[] DEFAULT '{}',
  interested_in TEXT[] DEFAULT '{}',
  city TEXT,
  location TEXT,
  education TEXT,
  company TEXT,
  school TEXT,
  interests TEXT[] DEFAULT '{}',
  bio TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. CRIAR ÍNDICES IMPORTANTES
CREATE UNIQUE INDEX users_phone_unique ON users(phone) WHERE phone IS NOT NULL AND phone != '';
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_username_idx ON users(username);

-- 4. RECRIAR TABELA PROFILES
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  bio TEXT,
  profession TEXT,
  photos TEXT[] DEFAULT '{}' NOT NULL,
  location TEXT,
  interests TEXT[] DEFAULT '{}',
  job TEXT,
  company TEXT,
  school TEXT,
  height INTEGER,
  relationship_goals TEXT,
  languages TEXT[] DEFAULT '{}',
  star_sign TEXT,
  education_level TEXT,
  family_plans TEXT,
  personality_type TEXT,
  communication_style TEXT,
  love_style TEXT,
  instagram TEXT,
  spotify TEXT,
  pronouns TEXT,
  pets TEXT,
  drinking TEXT,
  smoking TEXT,
  exercise TEXT,
  diet TEXT,
  sleep_schedule TEXT,
  max_distance INTEGER DEFAULT 50,
  age_range_min INTEGER DEFAULT 18,
  age_range_max INTEGER DEFAULT 99,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. RECRIAR TABELA SWIPES
CREATE TABLE swipes (
  id SERIAL PRIMARY KEY,
  swiper_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  swiped_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL,
  is_super_like BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. RECRIAR TABELA MATCHES
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. RECRIAR TABELA MESSAGES
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. RECRIAR TABELA SUBSCRIPTION_PLANS
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'brl' NOT NULL,
  interval TEXT NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. RECRIAR TABELA SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. MENSAGEM FINAL
DO $$ BEGIN
  RAISE NOTICE '✅ BANCO DE DADOS RECRIADO COM SUCESSO!';
  RAISE NOTICE '📝 Agora teste: https://mixapp.digital/phone-auth';
END $$;
