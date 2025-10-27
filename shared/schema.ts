import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  isOnline: boolean("is_online").default(false).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(),
  subscriptionType: text("subscription_type").default("free").notNull(), // free, premium, vip
  dailyLikes: integer("daily_likes").default(0).notNull(), // contador de likes diários
  lastLikeReset: timestamp("last_like_reset").defaultNow(), // data do último reset
  stripeCustomerId: text("stripe_customer_id"), // ID do cliente no Stripe
  stripeSubscriptionId: text("stripe_subscription_id"), // ID da assinatura no Stripe
  firstName: text("first_name").default("").notNull(),
  lastName: text("last_name").default("").notNull(),
  profileImage: text("profile_image"),
  phone: text("phone"),
  birthDate: text("birth_date"),
  gender: text("gender"),
  sexualOrientation: text("sexual_orientation").array().default([]),
  interestedIn: text("interested_in").array().default([]),
  city: text("city"),
  location: text("location"),
  education: text("education"),
  company: text("company"),
  school: text("school"),
  interests: text("interests").array().default([]),
  bio: text("bio"),
  photos: text("photos").array().default([]),
  isProfileComplete: boolean("is_profile_complete").default(false), // ✅ NOVO: Flag de perfil completo
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  profession: text("profession"),
  photos: text("photos").array().notNull().default([]),
  location: text("location"),
  interests: text("interests").array().default([]),
  
  // Mix-style fields
  job: text("job"),
  company: text("company"),
  school: text("school"),
  height: integer("height"), // em centímetros
  relationshipGoals: text("relationship_goals"), // "long-term", "short-term", "figuring-out", "friends"
  languages: text("languages").array().default([]),
  starSign: text("star_sign"),
  educationLevel: text("education_level"),
  familyPlans: text("family_plans"), // "want-children", "dont-want", "open-to", "have-children"
  personalityType: text("personality_type"), // MBTI types
  communicationStyle: text("communication_style"),
  loveStyle: text("love_style"),
  instagram: text("instagram"),
  spotify: text("spotify"),
  
  // Lifestyle fields
  pronouns: text("pronouns"),
  pets: text("pets"),
  drinking: text("drinking"),
  smoking: text("smoking"),
  exercise: text("exercise"),
  diet: text("diet"),
  sleepSchedule: text("sleep_schedule"),
  
  // Settings
  maxDistance: integer("max_distance").default(50),
  ageRangeMin: integer("age_range_min").default(18),
  ageRangeMax: integer("age_range_max").default(99),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  swiperId: integer("swiper_id").references(() => users.id).notNull(),
  swipedId: integer("swiped_id").references(() => users.id).notNull(),
  isLike: boolean("is_like").notNull(),
  isSuperLike: boolean("is_super_like").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").references(() => users.id).notNull(),
  user2Id: integer("user2_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de planos de assinatura
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Premium", "VIP"
  description: text("description"), // Descrição do plano
  stripePriceId: text("stripe_price_id").notNull(), // ID do price no Stripe
  price: integer("price").notNull(), // Preço em centavos
  currency: text("currency").default("brl").notNull(),
  interval: text("interval").notNull(), // "month", "year"
  features: jsonb("features").notNull(), // JSON com features do plano
  paymentMethods: text("payment_methods").array().default(['card', 'pix']), // Formas de pagamento aceitas
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de assinaturas
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").notNull(), // "active", "canceled", "past_due", etc
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de pagamentos
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  amount: integer("amount").notNull(), // Em centavos
  currency: text("currency").default("brl").notNull(),
  status: text("status").notNull(), // "succeeded", "failed", "pending"
  paymentMethod: text("payment_method"), // "card", "pix", etc
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  profileId: integer("profile_id").references(() => profiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de check-ins
export const checkIns = pgTable("check_ins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  establishmentName: text("establishment_name").notNull(),
  establishmentType: text("establishment_type"), // Bar, Restaurante, Café, etc
  city: text("city").default("São Paulo").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  qrCodeData: text("qr_code_data"), // Dados originais do QR Code
  checkInMethod: text("check_in_method").notNull(), // "qr", "manual", "establishment"
  isActive: boolean("is_active").default(true), // Check-in ativo ou já expirou
  expiresAt: timestamp("expires_at"), // Check-in expira após X horas
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de estabelecimentos parceiros (futura integração)
export const establishments = pgTable("establishments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Bar, Restaurante, Café, etc
  neighborhood: text("neighborhood"),
  city: text("city").default("São Paulo").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  qrCodeData: text("qr_code_data"), // QR Code único do estabelecimento
  isPremium: boolean("is_premium").default(false), // Estabelecimento premium/parceiro
  isActive: boolean("is_active").default(true),
  images: text("images").array().default([]),
  description: text("description"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de boosts (impulsos de perfil)
export const boosts = pgTable("boosts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(), // Boost dura 30 minutos
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de rewinds (voltar última ação)
export const rewinds = pgTable("rewinds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  swipeId: integer("swipe_id").references(() => swipes.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de verificações de perfil
export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  isVerified: boolean("is_verified").default(false),
  verificationMethod: text("verification_method"), // "selfie", "document", "manual"
  verifiedAt: timestamp("verified_at"),
  verificationImages: text("verification_images").array().default([]),
  status: text("status").default("none"), // "none", "pending", "approved", "rejected"
  rejectionReason: text("rejection_reason"),
  submittedAt: timestamp("submitted_at"),
  documentImage: text("document_image"),
  selfieImage: text("selfie_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de visualizações de perfil
export const profileViews = pgTable("profile_views", {
  id: serial("id").primaryKey(),
  viewedUserId: integer("viewed_user_id").references(() => users.id).notNull(),
  viewerUserId: integer("viewer_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de denúncias (reports)
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").references(() => users.id).notNull(),
  reportedUserId: integer("reported_user_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(), // harassment, fake_profile, inappropriate_content, spam, other
  description: text("description"),
  status: text("status").default("pending").notNull(), // pending, reviewing, resolved, dismissed
  action: text("action"), // banned, warned, no_action
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ✅ Tabela de bloqueios entre usuários
export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  blockerId: integer("blocker_id").references(() => users.id).notNull(), // Quem bloqueou
  blockedUserId: integer("blocked_user_id").references(() => users.id).notNull(), // Quem foi bloqueado
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de configurações do app
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").default("string").notNull(), // string, number, boolean, json
  category: text("category").notNull(), // general, limits, security, features, notifications
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de usuários admin
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  role: text("role").default("moderator").notNull(), // super_admin, admin, moderator
  permissions: text("permissions").array().default([]), // users, matches, messages, reports, settings, analytics
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de notificações push
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(), // match, message, like, super_like, boost, system
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  isSent: boolean("is_sent").default(false),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Schema simplificado para registro com email e password
export const registerUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertSwipeSchema = createInsertSchema(swipes).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertCheckInSchema = createInsertSchema(checkIns).omit({
  id: true,
  createdAt: true,
});

export const insertEstablishmentSchema = createInsertSchema(establishments).omit({
  id: true,
  createdAt: true,
});

export const insertBoostSchema = createInsertSchema(boosts).omit({
  id: true,
  createdAt: true,
});

export const insertRewindSchema = createInsertSchema(rewinds).omit({
  id: true,
  createdAt: true,
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertAppSettingSchema = createInsertSchema(appSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  swipesGiven: many(swipes, {
    relationName: "swiper",
  }),
  swipesReceived: many(swipes, {
    relationName: "swiped",
  }),
  matchesAsUser1: many(matches, {
    relationName: "user1",
  }),
  matchesAsUser2: many(matches, {
    relationName: "user2",
  }),
  messagesSent: many(messages, {
    relationName: "sender",
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  swiper: one(users, {
    fields: [swipes.swiperId],
    references: [users.id],
    relationName: "swiper",
  }),
  swiped: one(users, {
    fields: [swipes.swipedId],
    references: [users.id],
    relationName: "swiped",
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: "user1",
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: "user2",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, {
    fields: [messages.matchId],
    references: [matches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type Establishment = typeof establishments.$inferSelect;
export type InsertEstablishment = z.infer<typeof insertEstablishmentSchema>;
export type Boost = typeof boosts.$inferSelect;
export type InsertBoost = z.infer<typeof insertBoostSchema>;
export type Rewind = typeof rewinds.$inferSelect;
export type InsertRewind = z.infer<typeof insertRewindSchema>;
export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Block = typeof blocks.$inferSelect; // ✅ Novo tipo
export type AppSetting = typeof appSettings.$inferSelect;
export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
