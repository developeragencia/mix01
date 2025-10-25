-- Migration script for MIX App Database
-- This script creates all necessary tables for the MIX dating app

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP,
    is_online BOOLEAN DEFAULT false NOT NULL,
    last_seen TIMESTAMP DEFAULT NOW(),
    subscription_type TEXT DEFAULT 'free' NOT NULL,
    daily_likes INTEGER DEFAULT 0 NOT NULL,
    last_like_reset TIMESTAMP DEFAULT NOW(),
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
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    bio TEXT,
    profession TEXT,
    photos TEXT[] NOT NULL DEFAULT '{}',
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
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
    id SERIAL PRIMARY KEY,
    swiper_id INTEGER REFERENCES users(id) NOT NULL,
    swiped_id INTEGER REFERENCES users(id) NOT NULL,
    is_like BOOLEAN NOT NULL,
    is_super_like BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id) NOT NULL,
    user2_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) NOT NULL,
    sender_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    stripe_price_id TEXT NOT NULL,
    price INTEGER NOT NULL,
    currency TEXT DEFAULT 'brl' NOT NULL,
    interval TEXT NOT NULL,
    features JSONB NOT NULL,
    payment_methods TEXT[] DEFAULT '{card,pix}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    plan_id INTEGER REFERENCES subscription_plans(id) NOT NULL,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    subscription_id INTEGER REFERENCES subscriptions(id),
    stripe_payment_intent_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'brl' NOT NULL,
    status TEXT NOT NULL,
    payment_method TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    profile_id INTEGER REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    establishment_name TEXT NOT NULL,
    establishment_type TEXT,
    city TEXT DEFAULT 'São Paulo' NOT NULL,
    address TEXT,
    latitude TEXT,
    longitude TEXT,
    qr_code_data TEXT,
    check_in_method TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Establishments table
CREATE TABLE IF NOT EXISTS establishments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    neighborhood TEXT,
    city TEXT DEFAULT 'São Paulo' NOT NULL,
    address TEXT,
    latitude TEXT,
    longitude TEXT,
    qr_code_data TEXT,
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    images TEXT[] DEFAULT '{}',
    description TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Boosts table
CREATE TABLE IF NOT EXISTS boosts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Rewinds table
CREATE TABLE IF NOT EXISTS rewinds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    swipe_id INTEGER REFERENCES swipes(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT false,
    verification_method TEXT,
    verified_at TIMESTAMP,
    verification_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Profile views table
CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    viewed_user_id INTEGER REFERENCES users(id) NOT NULL,
    viewer_user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id) NOT NULL,
    reported_user_id INTEGER REFERENCES users(id) NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    action TEXT,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string' NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE,
    role TEXT DEFAULT 'moderator' NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiper_id ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped_id ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_boosts_user_id ON boosts(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_user_id ON profile_views(viewed_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_user_id ON profile_views(viewer_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, stripe_price_id, price, currency, interval, features) VALUES
('Premium', 'Plano Premium com recursos avançados', 'price_premium_monthly', 1999, 'brl', 'month', '{"unlimited_likes": true, "super_likes": 5, "boosts": 1, "rewinds": 3}'),
('VIP', 'Plano VIP com todos os recursos', 'price_vip_monthly', 3999, 'brl', 'month', '{"unlimited_likes": true, "super_likes": 10, "boosts": 3, "rewinds": 5, "priority_support": true}')
ON CONFLICT (stripe_price_id) DO NOTHING;

-- Insert default app settings
INSERT INTO app_settings (key, value, type, category, description) VALUES
('max_daily_likes', '100', 'number', 'limits', 'Maximum likes per day for free users'),
('max_daily_super_likes', '1', 'number', 'limits', 'Maximum super likes per day for free users'),
('boost_duration_minutes', '30', 'number', 'features', 'Duration of profile boost in minutes'),
('check_in_expiry_hours', '24', 'number', 'features', 'Check-in expiry time in hours'),
('verification_required', 'false', 'boolean', 'security', 'Whether profile verification is required'),
('maintenance_mode', 'false', 'boolean', 'general', 'Whether the app is in maintenance mode')
ON CONFLICT (key) DO NOTHING;

-- Create a function to reset daily likes
CREATE OR REPLACE FUNCTION reset_daily_likes()
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET daily_likes = 0, last_like_reset = NOW()
    WHERE last_like_reset < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Create a function to expire boosts
CREATE OR REPLACE FUNCTION expire_boosts()
RETURNS void AS $$
BEGIN
    UPDATE boosts 
    SET is_active = false
    WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create a function to expire check-ins
CREATE OR REPLACE FUNCTION expire_check_ins()
RETURNS void AS $$
BEGIN
    UPDATE check_ins 
    SET is_active = false
    WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

COMMIT;
