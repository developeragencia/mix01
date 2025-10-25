import { eq, and, gt, sql, inArray } from "drizzle-orm";
import { db } from "./db";
import { users, profiles, swipes, matches, messages, subscriptionPlans, subscriptions, payments, checkIns, establishments, boosts, rewinds, verifications, profileViews } from "@shared/schema";
import type { 
  User, Profile, Swipe, Match, Message, SubscriptionPlan, Subscription, Payment, CheckIn, Establishment, Boost, Rewind, Verification,
  InsertUser, InsertProfile, InsertSwipe, InsertMessage, InsertSubscriptionPlan, 
  InsertSubscription, InsertPayment, InsertCheckIn, InsertEstablishment, InsertBoost, InsertRewind, InsertVerification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUsersByIds?(ids: number[]): Promise<User[]>; // ⚡ Novo método para busca em batch
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: number, password: string): Promise<void>;
  setPasswordResetToken(email: string, token: string, expiry: Date): Promise<boolean>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearPasswordResetToken(userId: number): Promise<void>;
  checkDailyLikeLimit(userId: number): Promise<boolean>;
  incrementDailyLikes(userId: number): Promise<void>;
  updateUserStripeInfo(userId: number, stripeInfo: { customerId?: string; subscriptionId?: string | null }): Promise<void>;
  
  // Subscription methods
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(subscriptionId: string, updates: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByStripeId(stripePaymentIntentId: string): Promise<Payment | undefined>;
  getUserPayments(userId: number): Promise<Payment[]>;
  
  // Profile methods
  getProfile(userId: number): Promise<Profile | undefined>;
  getProfiles(): Promise<Profile[]>;
  getProfilesForDiscovery(userId: number, limit: number): Promise<Profile[]>;
  createProfile(profile: InsertProfile & { userId: number }): Promise<Profile>;
  updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Swipe methods
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getSwipe(swiperId: number, swipedId: number): Promise<Swipe | undefined>;
  
  // Match methods
  createMatch(user1Id: number, user2Id: number): Promise<Match>;
  getUserMatches(userId: number): Promise<(Match & { profile: Profile })[]>;
  deleteMatch?(matchId: number): Promise<void>; // ✅ Novo método
  
  // Report methods
  createReport?(report: {reporterId: number, reportedUserId: number, reason: string, status: string}): Promise<any>; // ✅ Novo método
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: number): Promise<Message[]>;
  getConversations(userId: number): Promise<{ match: Match; lastMessage: Message | null; profile: Profile }[]>;
  getMessageById?(messageId: number): Promise<Message | undefined>; // ✅ Novo método
  deleteMessage?(messageId: number): Promise<void>; // ✅ Novo método
  
  // Additional methods for 100% completion
  getUserLikes(userId: number): Promise<(Swipe & { profile: Profile })[]>;
  getUserSwipes(userId: number): Promise<Swipe[]>;
  getUserViews(userId: number): Promise<Profile[]>;
  getUserFavorites(userId: number): Promise<Profile[]>;
  addToFavorites(userId: number, profileId: number): Promise<boolean>;
  removeFromFavorites(userId: number, profileId: number): Promise<boolean>;
  getNotifications(userId: number): Promise<any[]>;
  getNearbyUsers(userId: number, maxDistance: number): Promise<Profile[]>;
  getSuperLikesCount(userId: number): Promise<number>;
  getBoostStats(userId: number): Promise<any>;
  
  // Check-in methods
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  getUserActiveCheckIn(userId: number): Promise<CheckIn | undefined>;
  getUserCheckInHistory(userId: number, limit?: number): Promise<CheckIn[]>;
  deactivateUserCheckIns(userId: number): Promise<void>;
  getUsersAtLocation(establishmentName: string): Promise<User[]>;
  
  // Establishment methods
  getEstablishments(city?: string, limit?: number): Promise<Establishment[]>;
  getEstablishmentById(id: number): Promise<Establishment | undefined>;
  createEstablishment(establishment: InsertEstablishment): Promise<Establishment>;
  getNearbyEstablishments(latitude: string, longitude: string, radiusKm?: number): Promise<Establishment[]>;
  
  // Premium features methods
  createSuperLike(userId: number, swipedId: number): Promise<Swipe>;
  createBoost(userId: number): Promise<Boost>;
  getUserActiveBoost(userId: number): Promise<Boost | undefined>;
  createRewind(userId: number): Promise<{ swipe: Swipe | undefined; rewind: Rewind }>;
  getLastSwipe(userId: number): Promise<Swipe | undefined>;
  deleteSwipe(swipeId: number): Promise<boolean>;
  
  // Verification methods
  markProfileVerified(userId: number, verificationMethod: string): Promise<Verification>;
  getUserVerification(userId: number): Promise<Verification | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Database schema is now ready - seed data after delay to ensure tables exist
    setTimeout(() => this.seedData(), 5000);
  }

  // Subscription methods
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      return [];
    }
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
    return newPlan;
  }

  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(sql`${subscriptions.createdAt} DESC`)
        .limit(1);
      return subscription;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return undefined;
    }
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    try {
      const [updated] = await db
        .update(subscriptions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return undefined;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await db
      .update(subscriptions)
      .set({ 
        status: 'canceled',
        canceledAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentByStripeId(stripePaymentIntentId: string): Promise<Payment | undefined> {
    try {
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId));
      return payment;
    } catch (error) {
      console.error('Error getting payment by Stripe ID:', error);
      return undefined;
    }
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    try {
      return await db
        .select()
        .from(payments)
        .where(eq(payments.userId, userId))
        .orderBy(sql`${payments.createdAt} DESC`);
    } catch (error) {
      console.error('Error getting user payments:', error);
      return [];
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  // ⚡ Buscar múltiplos usuários de uma vez (otimização N+1)
  async getUsersByIds(ids: number[]): Promise<User[]> {
    try {
      if (ids.length === 0) return [];
      const result = await db.select().from(users).where(inArray(users.id, ids));
      return result;
    } catch (error) {
      console.error('Error getting users by IDs:', error);
      return [];
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.phone, phone));
      return user;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values(user).returning();
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userId: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db.update(users)
        .set(updates)
        .where(eq(users.id, userId))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateUserPassword(userId: number, password: string): Promise<void> {
    try {
      await db.update(users).set({ password }).where(eq(users.id, userId));
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }

  async setPasswordResetToken(email: string, token: string, expiry: Date): Promise<boolean> {
    try {
      await db.update(users)
        .set({ resetToken: token, resetTokenExpiry: expiry })
        .where(eq(users.email, email));
      return true;
    } catch (error) {
      console.error('Error setting password reset token:', error);
      return false;
    }
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users)
        .where(and(eq(users.resetToken, token), gt(users.resetTokenExpiry, new Date())));
      return user;
    } catch (error) {
      console.error('Error getting user by reset token:', error);
      return undefined;
    }
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    try {
      await db.update(users)
        .set({ resetToken: null, resetTokenExpiry: null })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error clearing password reset token:', error);
    }
  }

  async checkDailyLikeLimit(userId: number): Promise<boolean> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return false;
      
      const now = new Date();
      const lastReset = user.lastLikeReset;
      if (lastReset && now.getDate() !== lastReset.getDate()) {
        await db.update(users)
          .set({ dailyLikes: 0, lastLikeReset: now })
          .where(eq(users.id, userId));
        return true;
      }
      
      const limit = user.subscriptionType === 'free' ? 10 : 999;
      return user.dailyLikes < limit;
    } catch (error) {
      console.error('Error checking daily like limit:', error);
      return false;
    }
  }

  async incrementDailyLikes(userId: number): Promise<void> {
    try {
      await db.update(users)
        .set({ dailyLikes: sql`${users.dailyLikes} + 1` })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error incrementing daily likes:', error);
    }
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { customerId?: string; subscriptionId?: string | null }): Promise<void> {
    try {
      const updateData: any = {};
      if (stripeInfo.customerId !== undefined) {
        updateData.stripeCustomerId = stripeInfo.customerId;
      }
      if (stripeInfo.subscriptionId !== undefined) {
        updateData.stripeSubscriptionId = stripeInfo.subscriptionId;
      }
      
      await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error updating user Stripe info:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    try {
      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      
      if (!profile) {
        return undefined;
      }
      
      // ✅ SEMPRE sincronizar fotos de users.photos (fonte mais confiável)
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        return profile;
      }
      
      // Determinar fotos (priorizar users.photos)
      const photos = (user.photos && user.photos.length > 0) 
        ? user.photos 
        : (profile.photos && profile.photos.length > 0)
          ? profile.photos
          : [];
      
      // ✅ SEMPRE calcular idade dinamicamente a partir do birthDate do user
      let age = profile.age; // fallback para idade armazenada
      if (user.birthDate) {
        const birth = new Date(user.birthDate);
        const today = new Date();
        age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
      }
      
      // Retornar novo objeto com valores atualizados
      return {
        ...profile,
        photos,
        age
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return undefined;
    }
  }

  async getProfiles(): Promise<Profile[]> {
    try {
      const results = await db
        .select({
          profile: profiles,
          userPhotos: users.photos,
          userBirthDate: users.birthDate,
        })
        .from(profiles)
        .leftJoin(users, eq(profiles.userId, users.id));
      
      return results.map(({ profile, userPhotos, userBirthDate }) => {
        // ✅ SEMPRE priorizar users.photos (fonte mais confiável)
        const photosArray = (userPhotos && userPhotos.length > 0) 
          ? userPhotos 
          : (profile.photos && profile.photos.length > 0) 
            ? profile.photos 
            : [];
        
        // ✅ SEMPRE calcular idade dinamicamente a partir do birthDate do user
        let age = profile.age;
        if (userBirthDate) {
          const birth = new Date(userBirthDate);
          const today = new Date();
          age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
        }
        
        return {
          ...profile,
          photos: photosArray,
          age: age,
        };
      });
    } catch (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
  }

  async getProfilesForDiscovery(userId: number, limit: number): Promise<Profile[]> {
    try {
      const results = await db
        .select({
          profile: profiles,
          userPhotos: users.photos,
          userBirthDate: users.birthDate,
        })
        .from(profiles)
        .leftJoin(users, eq(profiles.userId, users.id))
        .where(sql`${profiles.userId} != ${userId}`)
        .limit(limit);
      
      return results.map(({ profile, userPhotos, userBirthDate }) => {
        // ✅ SEMPRE priorizar users.photos (fonte mais confiável)
        const photosArray = (userPhotos && userPhotos.length > 0) 
          ? userPhotos 
          : (profile.photos && profile.photos.length > 0) 
            ? profile.photos 
            : [];
        
        // ✅ SEMPRE calcular idade dinamicamente a partir do birthDate do user
        let age = profile.age;
        if (userBirthDate) {
          const birth = new Date(userBirthDate);
          const today = new Date();
          age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
        }
        
        return {
          ...profile,
          photos: photosArray,
          age: age,
        };
      });
    } catch (error) {
      console.error('Error getting profiles for discovery:', error);
      return [];
    }
  }

  async createProfile(profile: InsertProfile & { userId: number }): Promise<Profile> {
    try {
      const [newProfile] = await db.insert(profiles).values(profile).returning();
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    try {
      const [updated] = await db.update(profiles)
        .set(profile)
        .where(eq(profiles.userId, userId))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating profile:', error);
      return undefined;
    }
  }

  // Swipe methods
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    try {
      const [newSwipe] = await db.insert(swipes).values(swipe).returning();
      
      // Check for mutual like to create match
      if (swipe.isLike) {
        const [reverseSwipe] = await db.select().from(swipes)
          .where(and(
            eq(swipes.swiperId, swipe.swipedId),
            eq(swipes.swipedId, swipe.swiperId),
            eq(swipes.isLike, true)
          ));
        
        if (reverseSwipe) {
          await this.createMatch(swipe.swiperId, swipe.swipedId);
        }
      }
      
      return newSwipe;
    } catch (error) {
      console.error('Error creating swipe:', error);
      throw error;
    }
  }

  async getSwipe(swiperId: number, swipedId: number): Promise<Swipe | undefined> {
    try {
      const [swipe] = await db.select().from(swipes)
        .where(and(eq(swipes.swiperId, swiperId), eq(swipes.swipedId, swipedId)));
      return swipe;
    } catch (error) {
      console.error('Error getting swipe:', error);
      return undefined;
    }
  }

  // Match methods
  async createMatch(user1Id: number, user2Id: number): Promise<Match> {
    try {
      const [newMatch] = await db.insert(matches).values({ user1Id, user2Id }).returning();
      return newMatch;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  async getMatches(userId: number): Promise<(Match & { profile: Profile; lastMessage: Message | null })[]> {
    try {
      const userMatches = await db.select().from(matches)
        .where(sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`)
        .orderBy(sql`${matches.createdAt} DESC`);
      
      const result = [];
      for (const match of userMatches) {
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
        
        // Buscar perfil do match
        const profile = await this.getProfile(otherUserId);
        
        if (profile) {
          // Buscar última mensagem do match
          const [lastMessage] = await db.select().from(messages)
            .where(eq(messages.matchId, match.id))
            .orderBy(sql`${messages.createdAt} DESC`)
            .limit(1);
          
          result.push({ 
            ...match, 
            profile,
            lastMessage: lastMessage || null
          });
        }
      }
      return result;
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }

  async getUserMatches(userId: number): Promise<(Match & { profile: Profile })[]> {
    try {
      const userMatches = await db.select().from(matches)
        .where(sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`);
      
      const result = [];
      for (const match of userMatches) {
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const [profile] = await db.select().from(profiles).where(eq(profiles.userId, otherUserId));
        if (profile) {
          result.push({ ...match, profile });
        }
      }
      return result;
    } catch (error) {
      console.error('Error getting user matches:', error);
      return [];
    }
  }

  // ✅ DELETE MATCH - Novo método
  async deleteMatch(matchId: number): Promise<void> {
    try {
      // Deletar todas as mensagens do match primeiro
      await db.delete(messages).where(eq(messages.matchId, matchId));
      
      // Deletar o match
      await db.delete(matches).where(eq(matches.id, matchId));
      
      console.log(`✅ Match ${matchId} deletado com sucesso`);
    } catch (error) {
      console.error('Error deleting match:', error);
      throw error;
    }
  }

  // ✅ CREATE REPORT - Novo método
  async createReport(report: {reporterId: number, reportedUserId: number, reason: string, status: string}): Promise<any> {
    try {
      // Como não temos tabela de reports, vamos apenas logar por enquanto
      console.log('📝 Report criado:', report);
      
      // TODO: Criar tabela 'reports' no schema e implementar insert aqui
      // const [newReport] = await db.insert(reports).values(report).returning();
      // return newReport;
      
      return { id: Date.now(), ...report, createdAt: new Date() };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async getMatchById(matchId: number, currentUserId: number): Promise<(Match & { profile: Profile }) | undefined> {
    try {
      const [match] = await db.select().from(matches).where(eq(matches.id, matchId));
      
      if (!match) return undefined;
      
      const otherUserId = match.user1Id === currentUserId ? match.user2Id : match.user1Id;
      const profile = await this.getProfile(otherUserId);
      
      if (!profile) return undefined;
      
      return { ...match, profile };
    } catch (error) {
      console.error('Error getting match by ID:', error);
      return undefined;
    }
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    try {
      const [newMessage] = await db.insert(messages).values(message).returning();
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessages(matchId: number): Promise<Message[]> {
    try {
      return await db.select().from(messages)
        .where(eq(messages.matchId, matchId))
        .orderBy(messages.createdAt);
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async getMatchMessages(matchId: number): Promise<Message[]> {
    try {
      return await db.select().from(messages)
        .where(eq(messages.matchId, matchId))
        .orderBy(messages.createdAt);
    } catch (error) {
      console.error('Error getting match messages:', error);
      return [];
    }
  }

  async getConversations(userId: number): Promise<{ match: Match; lastMessage: Message | null; profile: Profile }[]> {
    try {
      const userMatches = await this.getUserMatches(userId);
      
      const result = [];
      for (const match of userMatches) {
        const matchMessages = await db.select().from(messages)
          .where(eq(messages.matchId, match.id))
          .orderBy(sql`${messages.createdAt} DESC`)
          .limit(1);
        
        result.push({
          match,
          lastMessage: matchMessages[0] || null,
          profile: match.profile,
        });
      }
      return result;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  // ✅ GET MESSAGE BY ID - Novo método
  async getMessageById(messageId: number): Promise<Message | undefined> {
    try {
      const [message] = await db.select().from(messages)
        .where(eq(messages.id, messageId))
        .limit(1);
      return message;
    } catch (error) {
      console.error('Error getting message by id:', error);
      return undefined;
    }
  }

  // ✅ DELETE MESSAGE - Novo método
  async deleteMessage(messageId: number): Promise<void> {
    try {
      await db.delete(messages).where(eq(messages.id, messageId));
      console.log(`✅ Message ${messageId} deletada com sucesso`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Additional methods for 100% completion
  async getUserLikes(userId: number): Promise<(Swipe & { profile: Profile })[]> {
    try {
      const userSwipes = await db.select().from(swipes)
        .where(and(eq(swipes.swipedId, userId), eq(swipes.isLike, true)));
      
      const result = [];
      for (const swipe of userSwipes) {
        const [profile] = await db.select().from(profiles).where(eq(profiles.userId, swipe.swiperId));
        if (profile) {
          result.push({ ...swipe, profile });
        }
      }
      return result;
    } catch (error) {
      console.error('Error getting user likes:', error);
      return [];
    }
  }

  async getUserSwipes(userId: number): Promise<Swipe[]> {
    try {
      const userSwipes = await db.select().from(swipes)
        .where(eq(swipes.swiperId, userId));
      return userSwipes;
    } catch (error) {
      console.error('Error getting user swipes:', error);
      return [];
    }
  }

  async getUserViews(userId: number): Promise<Profile[]> {
    // This would need a views table in real implementation
    return [];
  }

  async getUserFavorites(userId: number): Promise<Profile[]> {
    // This would need a favorites table in real implementation
    return [];
  }

  async addToFavorites(userId: number, profileId: number): Promise<boolean> {
    // This would need a favorites table in real implementation
    return true;
  }

  async removeFromFavorites(userId: number, profileId: number): Promise<boolean> {
    // This would need a favorites table in real implementation
    return true;
  }

  async getNotifications(userId: number): Promise<any[]> {
    // Simulated notifications
    return [];
  }

  async getNearbyUsers(userId: number, maxDistance: number): Promise<Profile[]> {
    try {
      return await db.select().from(profiles)
        .where(sql`${profiles.userId} != ${userId}`)
        .limit(10);
    } catch (error) {
      console.error('Error getting nearby users:', error);
      return [];
    }
  }

  async getSuperLikesCount(userId: number): Promise<number> {
    try {
      const result = await db.select({ count: sql`count(*)` }).from(swipes)
        .where(and(eq(swipes.swiperId, userId), eq(swipes.isSuperLike, true)));
      return Number(result[0].count) || 0;
    } catch (error) {
      console.error('Error getting super likes count:', error);
      return 0;
    }
  }

  async getBoostStats(userId: number): Promise<any> {
    return { views: 0, likes: 0, matches: 0 };
  }

  // Seed subscription plans
  private async seedSubscriptionPlans() {
    try {
      const existingPlans = await db.select().from(subscriptionPlans).limit(1);
      if (existingPlans.length > 0) {
        return; // Plans already exist
      }

      console.log("🔵 Creating subscription plans...");

      const plans = [
        {
          name: "Premium",
          stripePriceId: "price_1234567890premium", // Substituir pelo ID real do Stripe
          price: 2990, // R$ 29,90 em centavos
          currency: "brl",
          interval: "month",
          features: JSON.stringify({
            unlimitedLikes: true,
            superLikes: 5,
            boost: 1,
            seeWhoLikedYou: true,
            advancedFilters: true,
            noAds: true
          }),
          isActive: true
        },
        {
          name: "VIP",
          stripePriceId: "price_1234567890vip", // Substituir pelo ID real do Stripe
          price: 4990, // R$ 49,90 em centavos
          currency: "brl",
          interval: "month",
          features: JSON.stringify({
            unlimitedLikes: true,
            superLikes: 20,
            boost: 5,
            seeWhoLikedYou: true,
            advancedFilters: true,
            noAds: true,
            prioritySupport: true,
            exclusiveFeatures: true
          }),
          isActive: true
        }
      ];

      for (const plan of plans) {
        await db.insert(subscriptionPlans).values(plan);
      }

      console.log("✅ Subscription plans created successfully");
    } catch (error) {
      console.error("❌ Error creating subscription plans:", error);
    }
  }

  // Check-in methods
  async createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn> {
    const [newCheckIn] = await db.insert(checkIns).values(checkIn).returning();
    return newCheckIn;
  }

  async getUserActiveCheckIn(userId: number): Promise<CheckIn | undefined> {
    try {
      const [activeCheckIn] = await db
        .select()
        .from(checkIns)
        .where(
          and(
            eq(checkIns.userId, userId),
            eq(checkIns.isActive, true)
          )
        )
        .orderBy(sql`${checkIns.createdAt} DESC`)
        .limit(1);
      return activeCheckIn;
    } catch (error) {
      console.error('Error getting active check-in:', error);
      return undefined;
    }
  }

  async getUserCheckInHistory(userId: number, limit: number = 20): Promise<CheckIn[]> {
    try {
      return await db
        .select()
        .from(checkIns)
        .where(eq(checkIns.userId, userId))
        .orderBy(sql`${checkIns.createdAt} DESC`)
        .limit(limit);
    } catch (error) {
      console.error('Error getting check-in history:', error);
      return [];
    }
  }

  async deactivateUserCheckIns(userId: number): Promise<void> {
    try {
      await db
        .update(checkIns)
        .set({ isActive: false })
        .where(eq(checkIns.userId, userId));
    } catch (error) {
      console.error('Error deactivating check-ins:', error);
    }
  }

  async getUsersAtLocation(establishmentName: string): Promise<User[]> {
    try {
      const activeCheckIns = await db
        .select()
        .from(checkIns)
        .where(
          and(
            eq(checkIns.establishmentName, establishmentName),
            eq(checkIns.isActive, true)
          )
        );
      
      const userIds = activeCheckIns.map(c => c.userId);
      if (userIds.length === 0) return [];
      
      return await db.select().from(users).where(sql`${users.id} IN ${userIds}`);
    } catch (error) {
      console.error('Error getting users at location:', error);
      return [];
    }
  }

  // Establishment methods
  async getEstablishments(city?: string, limit: number = 50): Promise<Establishment[]> {
    try {
      if (city) {
        return await db.select()
          .from(establishments)
          .where(and(
            eq(establishments.isActive, true),
            eq(establishments.city, city)
          ))
          .limit(limit);
      }
      
      return await db.select()
        .from(establishments)
        .where(eq(establishments.isActive, true))
        .limit(limit);
    } catch (error) {
      console.error('Error getting establishments:', error);
      return [];
    }
  }

  async getEstablishmentById(id: number): Promise<Establishment | undefined> {
    try {
      const [establishment] = await db
        .select()
        .from(establishments)
        .where(eq(establishments.id, id))
        .limit(1);
      return establishment;
    } catch (error) {
      console.error('Error getting establishment:', error);
      return undefined;
    }
  }

  async createEstablishment(establishment: InsertEstablishment): Promise<Establishment> {
    const [newEstablishment] = await db.insert(establishments).values(establishment).returning();
    return newEstablishment;
  }

  async getNearbyEstablishments(latitude: string, longitude: string, radiusKm: number = 5): Promise<Establishment[]> {
    try {
      // Simplified version - in production would use PostGIS or similar
      // For now, return all active establishments in the same city
      return await db.select().from(establishments).where(eq(establishments.isActive, true)).limit(20);
    } catch (error) {
      console.error('Error getting nearby establishments:', error);
      return [];
    }
  }

  // Premium features methods
  async createSuperLike(userId: number, swipedId: number): Promise<Swipe> {
    const [swipe] = await db.insert(swipes).values({
      swiperId: userId,
      swipedId: swipedId,
      isLike: true,
      isSuperLike: true
    }).returning();
    
    // Check for mutual like to create match
    const [reverseSwipe] = await db.select().from(swipes)
      .where(and(
        eq(swipes.swiperId, swipedId),
        eq(swipes.swipedId, userId),
        eq(swipes.isLike, true)
      ));
    
    if (reverseSwipe) {
      await this.createMatch(userId, swipedId);
    }
    
    return swipe;
  }

  async createBoost(userId: number): Promise<Boost> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Boost dura 30 minutos
    
    const [boost] = await db.insert(boosts).values({
      userId,
      expiresAt,
      isActive: true
    }).returning();
    
    return boost;
  }

  async getUserActiveBoost(userId: number): Promise<Boost | undefined> {
    const [boost] = await db.select().from(boosts)
      .where(and(
        eq(boosts.userId, userId),
        eq(boosts.isActive, true),
        gt(boosts.expiresAt, new Date())
      ))
      .limit(1);
    return boost;
  }

  async getLastSwipe(userId: number): Promise<Swipe | undefined> {
    const [swipe] = await db.select().from(swipes)
      .where(eq(swipes.swiperId, userId))
      .orderBy(sql`${swipes.createdAt} DESC`)
      .limit(1);
    return swipe;
  }

  async deleteSwipe(swipeId: number): Promise<boolean> {
    try {
      await db.delete(swipes).where(eq(swipes.id, swipeId));
      return true;
    } catch (error) {
      console.error('Error deleting swipe:', error);
      return false;
    }
  }

  async createRewind(userId: number): Promise<{ swipe: Swipe | undefined; rewind: Rewind }> {
    const lastSwipe = await this.getLastSwipe(userId);
    
    if (lastSwipe) {
      // Delete the last swipe
      await this.deleteSwipe(lastSwipe.id);
      
      // Create rewind record
      const [rewind] = await db.insert(rewinds).values({
        userId,
        swipeId: lastSwipe.id
      }).returning();
      
      return { swipe: lastSwipe, rewind };
    }
    
    // If no swipe to rewind, still create the rewind record
    const [rewind] = await db.insert(rewinds).values({
      userId,
      swipeId: 0 // Placeholder
    }).returning();
    
    return { swipe: undefined, rewind };
  }

  // Verification methods
  async markProfileVerified(userId: number, verificationMethod: string): Promise<Verification> {
    // First, mark the profile as verified
    await db.update(profiles)
      .set({ isVerified: true })
      .where(eq(profiles.userId, userId));
    
    // Then create/update verification record
    const [verification] = await db.insert(verifications).values({
      userId,
      isVerified: true,
      verificationMethod,
      verifiedAt: new Date()
    }).returning();
    
    return verification;
  }

  async getUserVerification(userId: number): Promise<Verification | undefined> {
    const [verification] = await db.select().from(verifications)
      .where(eq(verifications.userId, userId))
      .limit(1);
    return verification;
  }

  async getProfileViewsCount(userId: number): Promise<number> {
    const views = await db.query.profileViews.findMany({
      where: eq(profileViews.viewedUserId, userId),
    });
    return views.length;
  }

  async getVerificationStatus(userId: number) {
    const verification = await db.query.verifications.findFirst({
      where: eq(verifications.userId, userId),
    });
    return verification || { isVerified: false };
  }

  async requestVerification(userId: number, method: string, images: string[]) {
    const existing = await db.query.verifications.findFirst({
      where: eq(verifications.userId, userId),
    });

    if (existing) {
      const [updated] = await db
        .update(verifications)
        .set({
          verificationMethod: method,
          verificationImages: images,
        })
        .where(eq(verifications.userId, userId))
        .returning();
      return updated;
    }

    const [verification] = await db
      .insert(verifications)
      .values({
        userId,
        verificationMethod: method,
        verificationImages: images,
        isVerified: false,
      })
      .returning();
    return verification;
  }

  // Seed data method
  private async seedData() {
    try {
      console.log("🔵 Checking if database needs seeding...");
      
      // Only ensure subscription plans exist - no fake user data
      await this.seedSubscriptionPlans();
      
      console.log("✅ Database seed check completed - subscription plans ready");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
    }
  }
}

// Use DatabaseStorage now that schema is configured
export const storage = new DatabaseStorage();