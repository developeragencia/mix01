import { users, profiles, swipes, matches, messages, favorites, type User, type InsertUser, type Profile, type InsertProfile, type Swipe, type InsertSwipe, type Match, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, not, inArray, gt, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  checkDailyLikeLimit(userId: number): Promise<boolean>;
  incrementDailyLikes(userId: number): Promise<void>;
  updateUserPassword(userId: number, password: string): Promise<void>;
  setPasswordResetToken(email: string, token: string, expiry: Date): Promise<boolean>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearPasswordResetToken(userId: number): Promise<void>;
  
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
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMatchMessages(matchId: number): Promise<Message[]>;
  getConversations(userId: number): Promise<{ match: Match; lastMessage: Message | null; profile: Profile }[]>;
  
  // Additional methods for 100% completion
  getUserLikes(userId: number): Promise<(Swipe & { profile: Profile })[]>;
  getUserViews(userId: number): Promise<Profile[]>;
  getUserFavorites(userId: number): Promise<Profile[]>;
  addToFavorites(userId: number, profileId: number): Promise<boolean>;
  removeFromFavorites(userId: number, profileId: number): Promise<boolean>;
  getNotifications(userId: number): Promise<any[]>;
  getNearbyUsers(userId: number, maxDistance: number): Promise<Profile[]>;
  getSuperLikesCount(userId: number): Promise<number>;
  getBoostStats(userId: number): Promise<any>;
  getUserByPhone(phone: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Database schema is now ready - seed data after delay to ensure tables exist
    setTimeout(() => this.seedData(), 5000);
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

  async checkDailyLikeLimit(userId: number): Promise<boolean> {
    try {
      const user = await this.getUser(userId);
      if (!user) return false;
      
      // Reset daily likes if a day has passed
      const now = new Date();
      const lastReset = user.lastLikeReset;
      if (lastReset && now.getDate() !== lastReset.getDate()) {
        await db.update(users).set({ 
          dailyLikes: 0,
          lastLikeReset: now 
        }).where(eq(users.id, userId));
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

  async clearPasswordResetToken(userId: number): Promise<void> {
    try {
      await db.update(users)
        .set({ resetToken: null, resetTokenExpiry: null })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error clearing password reset token:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    try {
      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      return profile;
    } catch (error) {
      console.error('Error getting profile:', error);
      return undefined;
    }
  }

  async getProfiles(): Promise<Profile[]> {
    try {
      return await db.select().from(profiles);
    } catch (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
  }

  async getProfilesForDiscovery(userId: number, limit: number): Promise<Profile[]> {
    try {
      return await db.select().from(profiles)
        .where(not(eq(profiles.userId, userId)))
        .limit(limit);
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
      const [updatedProfile] = await db.update(profiles)
        .set(profile)
        .where(eq(profiles.userId, userId))
        .returning();
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return undefined;
    }
  }

  // Swipe methods
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    try {
      const [newSwipe] = await db.insert(swipes).values(swipe).returning();
      
      // Check if this creates a match (mutual like)
      if (swipe.isLike) {
        const mutualSwipe = await db.select().from(swipes)
          .where(
            and(
              eq(swipes.swiperId, swipe.swipedId),
              eq(swipes.swipedId, swipe.swiperId),
              eq(swipes.isLike, true)
            )
          );
        
        if (mutualSwipe.length > 0) {
          // Create a match
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
      const [newMatch] = await db.insert(matches).values({
        user1Id: Math.min(user1Id, user2Id),
        user2Id: Math.max(user1Id, user2Id)
      }).returning();
      return newMatch;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  async getUserMatches(userId: number): Promise<(Match & { profile: Profile })[]> {
    try {
      const userMatches = await db.select({
        match: matches,
        profile: profiles,
      }).from(matches)
        .leftJoin(profiles, 
          or(
            and(eq(matches.user1Id, userId), eq(profiles.userId, matches.user2Id)),
            and(eq(matches.user2Id, userId), eq(profiles.userId, matches.user1Id))
          )
        )
        .where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)));
      
      return userMatches
        .filter(row => row.profile !== null)
        .map(row => ({
          ...row.match,
          profile: row.profile!
        }));
    } catch (error) {
      console.error('Error getting user matches:', error);
      return [];
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
      
      const conversations = await Promise.all(
        userMatches.map(async (match) => {
          const matchMessages = await this.getMatchMessages(match.id);
          const lastMessage = matchMessages.length > 0 ? matchMessages[matchMessages.length - 1] : null;
          
          return {
            match,
            lastMessage,
            profile: match.profile
          };
        })
      );
      
      return conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  private async seedData() {
    try {
      // Check if users already exist
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        console.log("Database already seeded, skipping seed data");
        return;
      }

      console.log("Seeding database with sample data...");

      // Create sample users
      const sampleUsers = [
        { username: "alex_developer", email: "alex@example.com", password: "password123", isOnline: true },
        { username: "carlos_santos", email: "carlos@example.com", password: "password123", isOnline: true },
        { username: "ana_silva", email: "ana@example.com", password: "password123", isOnline: false },
        { username: "ricardo_ferreira", email: "ricardo@example.com", password: "password123", isOnline: true },
        { username: "mariana_costa", email: "mariana@example.com", password: "password123", isOnline: true },
      ];

      const createdUsers = await Promise.all(
        sampleUsers.map(async (userData) => {
          const [user] = await db.insert(users).values(userData).returning();
          return user;
        })
      );

      // Create sample profiles
      const sampleProfiles = [
        { name: "Alex Developer", age: 40, bio: "Desenvolvedor de site, sistemas e aplicativos 💻. Entusiasta do esporte, da atividade física e da vida saudável. Adoraria conhecer alguém com os mesmos interesses, para nos motivarmos e encontrarmos nossa melhor versão. Comigo do seu lado, nenhum desafio será grande demais.", profession: "Desenvolvedor", location: "Petrolina, PE", interests: ["Tecnologia", "Desenvolvimento", "Inovação"], photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"] },
        { name: "Carlos", age: 29, bio: "Desenvolvedor apaixonado por tecnologia 💻. Entusiasta do esporte, da atividade física e da vida saudável. Adoraria conhecer alguém com os mesmos interesses, para nos motivarmos e encontrarmos nossa melhor versão. Comigo do seu lado, nenhum desafio será grande demais.", profession: "Desenvolvedor", location: "Rio de Janeiro, RJ", interests: ["Tecnologia", "Games", "Cinema"], photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face"] },
        { name: "Ana", age: 24, bio: "Artista e amante da natureza 🎨🌿. Entusiasta do esporte, da atividade física e da vida saudável. Adoraria conhecer alguém com os mesmos interesses, para nos motivarmos e encontrarmos nossa melhor versão. Comigo do seu lado, nenhum desafio será grande demais.", profession: "Artista", location: "Belo Horizonte, MG", interests: ["Arte", "Natureza", "Yoga"], photos: ["https://images.unsplash.com/photo-1494790108755-2616b9e85c2c?w=400&h=600&fit=crop&crop=face"] },
        { name: "Ricardo", age: 31, bio: "Professor de educação física 💪. Entusiasta do esporte, da atividade física e da vida saudável. Adoraria conhecer alguém com os mesmos interesses, para nos motivarmos e encontrarmos nossa melhor versão. Comigo do seu lado, nenhum desafio será grande demais.", profession: "Professor", location: "Porto Alegre, RS", interests: ["Esportes", "Academia", "Corrida"], photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"] },
        { name: "Mariana", age: 27, bio: "Chef de cozinha apaixonada por gastronomia 👩‍🍳. Entusiasta do esporte, da atividade física e da vida saudável. Adoraria conhecer alguém com os mesmos interesses, para nos motivarmos e encontrarmos nossa melhor versão. Comigo do seu lado, nenhum desafio será grande demais.", profession: "Chef", location: "Salvador, BA", interests: ["Culinária", "Vinhos", "Cultura"], photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face"] },
      ];

      await Promise.all(
        sampleProfiles.map(async (profileData, index) => {
          await db.insert(profiles).values({
            ...profileData,
            userId: createdUsers[index].id
          });
        })
      );

      // Create some sample matches
      await db.insert(matches).values([
        { user1Id: createdUsers[0].id, user2Id: createdUsers[1].id },
        { user1Id: createdUsers[0].id, user2Id: createdUsers[2].id },
        { user1Id: createdUsers[1].id, user2Id: createdUsers[3].id },
      ]);

      // Create some sample messages
      await db.insert(messages).values([
        { matchId: 1, senderId: createdUsers[0].id, content: "Olá! Como está?" },
        { matchId: 1, senderId: createdUsers[1].id, content: "Oi! Tudo bem! E você?" },
        { matchId: 2, senderId: createdUsers[2].id, content: "Que bom te encontrar aqui!" },
        { matchId: 3, senderId: createdUsers[1].id, content: "Seu perfil é muito interessante!" },
      ]);

      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // Additional methods implementation for 100% completion
  async getUserLikes(userId: number): Promise<(Swipe & { profile: Profile })[]> {
    try {
      const userSwipes = await db.select()
        .from(swipes)
        .where(and(eq(swipes.swipedId, userId), eq(swipes.isLike, true)));
      
      const likesWithProfiles = await Promise.all(
        userSwipes.map(async (swipe) => {
          const profile = await this.getProfile(swipe.swiperId);
          return { ...swipe, profile };
        })
      );
      
      return likesWithProfiles.filter(like => like.profile);
    } catch (error) {
      console.error('Error getting user likes:', error);
      return [];
    }
  }

  async getUserViews(userId: number): Promise<Profile[]> {
    try {
      // For now, return profiles that swiped on the user (viewed their profile)
      const viewSwipes = await db.select()
        .from(swipes)
        .where(eq(swipes.swipedId, userId));
      
      const viewProfiles = await Promise.all(
        viewSwipes.map(async (swipe) => {
          return await this.getProfile(swipe.swiperId);
        })
      );
      
      return viewProfiles.filter(profile => profile);
    } catch (error) {
      console.error('Error getting user views:', error);
      return [];
    }
  }

  async getUserFavorites(userId: number): Promise<Profile[]> {
    try {
      // Query from favorites table
      const userFavorites = await db.select()
        .from(favorites)
        .where(eq(favorites.userId, userId));
      
      const favoriteProfiles = await Promise.all(
        userFavorites.map(async (fav) => {
          return await this.getProfile(fav.profileId);
        })
      );
      
      return favoriteProfiles.filter(profile => profile);
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }

  async addToFavorites(userId: number, profileId: number): Promise<boolean> {
    try {
      await db.insert(favorites).values({ userId, profileId });
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  async removeFromFavorites(userId: number, profileId: number): Promise<boolean> {
    try {
      await db.delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.profileId, profileId)));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  async getNotifications(userId: number): Promise<any[]> {
    try {
      // Return recent matches and messages as notifications
      const recentMatches = await this.getUserMatches(userId);
      const notifications = recentMatches.slice(0, 10).map(match => ({
        id: `match_${match.id}`,
        type: 'match',
        title: 'Novo Match!',
        message: `Você e ${match.profile.name} deram match!`,
        createdAt: match.createdAt,
        read: false
      }));
      
      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async getNearbyUsers(userId: number, maxDistance: number = 50): Promise<Profile[]> {
    try {
      // For now, return random profiles as "nearby"
      const allProfiles = await this.getProfiles();
      return allProfiles.filter(p => p.userId !== userId).slice(0, 10);
    } catch (error) {
      console.error('Error getting nearby users:', error);
      return [];
    }
  }

  async getSuperLikesCount(userId: number): Promise<number> {
    try {
      const superLikes = await db.select()
        .from(swipes)
        .where(and(eq(swipes.swiperId, userId), eq(swipes.isSuperLike, true)));
      return superLikes.length;
    } catch (error) {
      console.error('Error getting super likes count:', error);
      return 0;
    }
  }

  async getBoostStats(userId: number): Promise<any> {
    try {
      const profile = await this.getProfile(userId);
      const views = await this.getUserViews(userId);
      const likes = await this.getUserLikes(userId);
      
      return {
        profileViews: views.length,
        newLikes: likes.length,
        matches: (await this.getUserMatches(userId)).length,
        boostActive: false,
        boostEndTime: null
      };
    } catch (error) {
      console.error('Error getting boost stats:', error);
      return {
        profileViews: 0,
        newLikes: 0,
        matches: 0,
        boostActive: false,
        boostEndTime: null
      };
    }
  }
}

// Use MemStorage temporarily while database is being configured
export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private profiles: Map<number, Profile> = new Map();
  private swipes: Map<string, Swipe> = new Map();
  private matches: Map<number, Match> = new Map();
  private messages: Map<number, Message> = new Map();
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers = [
      { id: 1, username: "alex_developer", email: "alex@example.com", password: "password123", isOnline: true, resetToken: null, resetTokenExpiry: null, lastSeen: new Date(), createdAt: new Date() },
      { id: 2, username: "maria_silva", email: "maria@example.com", password: "password123", isOnline: true, resetToken: null, resetTokenExpiry: null, lastSeen: new Date(), createdAt: new Date() },
      { id: 3, username: "ana_costa", email: "ana@example.com", password: "password123", isOnline: false, resetToken: null, resetTokenExpiry: null, lastSeen: new Date(), createdAt: new Date() },
      { id: 4, username: "carlos_santos", email: "carlos@example.com", password: "password123", isOnline: true, resetToken: null, resetTokenExpiry: null, lastSeen: new Date(), createdAt: new Date() },
      { id: 5, username: "bruno_oliveira", email: "bruno@example.com", password: "password123", isOnline: true, resetToken: null, resetTokenExpiry: null, lastSeen: new Date(), createdAt: new Date() },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Create sample profiles
    const sampleProfiles = [
      { id: 1, userId: 1, name: "Alex Developer", age: 40, bio: "Desenvolvedor de aplicativos", profession: "Desenvolvedor", location: "Petrolina, PE", interests: ["Tecnologia"], photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"], maxDistance: 50, ageRangeMin: 18, ageRangeMax: 99, isActive: true, createdAt: new Date() },
      { id: 2, userId: 2, name: "Maria Silva", age: 28, bio: "Designer gráfica", profession: "Designer", location: "São Paulo, SP", interests: ["Design"], photos: ["https://images.unsplash.com/photo-1494790108755-2616b9e85c2c?w=400&h=600&fit=crop&crop=face"], maxDistance: 50, ageRangeMin: 18, ageRangeMax: 99, isActive: true, createdAt: new Date() },
      { id: 3, userId: 3, name: "Ana Costa", age: 25, bio: "Artista", profession: "Artista", location: "Rio de Janeiro, RJ", interests: ["Arte"], photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face"], maxDistance: 50, ageRangeMin: 18, ageRangeMax: 99, isActive: true, createdAt: new Date() },
      { id: 4, userId: 4, name: "Carlos Santos", age: 30, bio: "Engenheiro", profession: "Engenheiro", location: "Belo Horizonte, MG", interests: ["Tecnologia"], photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face"], maxDistance: 50, ageRangeMin: 18, ageRangeMax: 99, isActive: true, createdAt: new Date() },
      { id: 5, userId: 5, name: "Bruno Oliveira", age: 32, bio: "Professor", profession: "Professor", location: "Porto Alegre, RS", interests: ["Educação"], photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"], maxDistance: 50, ageRangeMin: 18, ageRangeMax: 99, isActive: true, createdAt: new Date() },
    ];

    sampleProfiles.forEach(profile => this.profiles.set(profile.userId, profile));

    // Create sample matches
    const sampleMatches = [
      { id: 1, user1Id: 1, user2Id: 2, createdAt: new Date() },
      { id: 2, user1Id: 1, user2Id: 3, createdAt: new Date() },
      { id: 3, user1Id: 1, user2Id: 4, createdAt: new Date() },
    ];

    sampleMatches.forEach(match => this.matches.set(match.id, match));

    // Create sample messages
    const sampleMessages = [
      { id: 1, matchId: 1, senderId: 2, content: "Olá! Como você está?", isRead: false, createdAt: new Date(Date.now() - 3600000) },
      { id: 2, matchId: 1, senderId: 1, content: "Oi! Estou bem, obrigado! E você?", isRead: false, createdAt: new Date(Date.now() - 3000000) },
      { id: 3, matchId: 2, senderId: 3, content: "Que bom te encontrar aqui!", isRead: false, createdAt: new Date(Date.now() - 2400000) },
      { id: 4, matchId: 3, senderId: 4, content: "Seu perfil é muito interessante!", isRead: false, createdAt: new Date(Date.now() - 1800000) },
    ];

    sampleMessages.forEach(message => this.messages.set(message.id, message));
    this.currentId = 6;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser: User = {
      ...user,
      id,
      resetToken: null,
      resetTokenExpiry: null,
      isOnline: true,
      lastSeen: new Date(),
      subscriptionType: user.subscriptionType || 'free',
      dailyLikes: user.dailyLikes || 0,
      lastLikeReset: user.lastLikeReset || new Date(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImage: user.profileImage || null,
      phone: user.phone || null,
      birthDate: user.birthDate || null,
      gender: user.gender || null,
      sexualOrientation: user.sexualOrientation || [],
      interestedIn: user.interestedIn || [],
      city: user.city || null,
      location: user.location || null,
      education: user.education || null,
      company: user.company || null,
      school: user.school || null,
      interests: user.interests || [],
      bio: user.bio || null,
      photos: user.photos || [],
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUserPassword(userId: number, password: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = password;
      this.users.set(userId, user);
    }
  }

  async setPasswordResetToken(email: string, token: string, expiry: Date): Promise<boolean> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiry = expiry;
      this.users.set(user.id, user);
      return true;
    }
    return false;
  }

  async checkDailyLikeLimit(userId: number): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    
    const now = new Date();
    const lastReset = user.lastLikeReset;
    if (lastReset && now.getDate() !== lastReset.getDate()) {
      user.dailyLikes = 0;
      user.lastLikeReset = now;
      this.users.set(userId, user);
      return true;
    }
    
    const limit = user.subscriptionType === 'free' ? 10 : 999;
    return user.dailyLikes < limit;
  }

  async incrementDailyLikes(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.dailyLikes++;
      this.users.set(userId, user);
    }
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => 
      u.resetToken === token && 
      u.resetTokenExpiry && 
      u.resetTokenExpiry > new Date()
    );
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      this.users.set(userId, user);
    }
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    return this.profiles.get(userId);
  }

  async getProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfilesForDiscovery(userId: number, limit: number): Promise<Profile[]> {
    return Array.from(this.profiles.values())
      .filter(p => p.userId !== userId)
      .slice(0, limit);
  }

  async createProfile(profile: InsertProfile & { userId: number }): Promise<Profile> {
    const id = this.currentId++;
    const newProfile: Profile = {
      ...profile,
      id,
      createdAt: new Date(),
    };
    this.profiles.set(profile.userId, newProfile);
    return newProfile;
  }

  async updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(userId);
    if (existing) {
      const updated = { ...existing, ...profile };
      this.profiles.set(userId, updated);
      return updated;
    }
    return undefined;
  }

  // Swipe methods
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const id = this.currentId++;
    const newSwipe: Swipe = {
      ...swipe,
      id,
      createdAt: new Date(),
    };
    this.swipes.set(id, newSwipe);
    return newSwipe;
  }

  async getSwipe(swiperId: number, swipedId: number): Promise<Swipe | undefined> {
    return Array.from(this.swipes.values()).find(s => 
      s.swiperId === swiperId && s.swipedId === swipedId
    );
  }

  // Match methods
  async createMatch(user1Id: number, user2Id: number): Promise<Match> {
    const id = this.currentId++;
    const newMatch: Match = {
      id,
      user1Id,
      user2Id,
      createdAt: new Date(),
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async getUserMatches(userId: number): Promise<(Match & { profile: Profile })[]> {
    const userMatches = Array.from(this.matches.values())
      .filter(m => m.user1Id === userId || m.user2Id === userId);
    
    return userMatches.map(match => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const profile = this.profiles.get(otherUserId);
      return { ...match, profile: profile! };
    }).filter(m => m.profile);
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const newMessage: Message = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMatchMessages(matchId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getConversations(userId: number): Promise<{ match: Match; lastMessage: Message | null; profile: Profile }[]> {
    const matches = await this.getUserMatches(userId);
    return matches.map(match => {
      const messages = Array.from(this.messages.values())
        .filter(m => m.matchId === match.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return {
        match,
        lastMessage: messages[0] || null,
        profile: match.profile
      };
    });
  }

  // Additional methods for 100% completion
  async getUserLikes(userId: number): Promise<(Swipe & { profile: Profile })[]> {
    const likes = Array.from(this.swipes.values())
      .filter(s => s.swipedId === userId && s.isLike);
    
    return likes.map(like => {
      const profile = this.profiles.get(like.swiperId);
      return { ...like, profile: profile! };
    }).filter(l => l.profile);
  }

  async getUserViews(userId: number): Promise<Profile[]> {
    // Simulated views - return random profiles
    return Array.from(this.profiles.values())
      .filter(p => p.userId !== userId)
      .slice(0, 5);
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
    // Simulated nearby users - return random profiles
    return Array.from(this.profiles.values())
      .filter(p => p.userId !== userId)
      .slice(0, 10);
  }

  async getSuperLikesCount(userId: number): Promise<number> {
    return Array.from(this.swipes.values())
      .filter(s => s.swiperId === userId && s.isSuperLike).length;
  }

  async getBoostStats(userId: number): Promise<any> {
    return { views: 0, likes: 0, matches: 0 };
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.resetToken === token && 
      user.resetTokenExpiry && 
      user.resetTokenExpiry > new Date()
    );
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.resetToken = null;
      user.resetTokenExpiry = null;
      this.users.set(userId, user);
    }
  }

  // Profile methods
  async getProfile(userId: number): Promise<Profile | undefined> {
    return this.profiles.get(userId);
  }

  async getProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfilesForDiscovery(userId: number, limit: number): Promise<Profile[]> {
    return Array.from(this.profiles.values())
      .filter(profile => profile.userId !== userId)
      .slice(0, limit);
  }

  async createProfile(profile: InsertProfile & { userId: number }): Promise<Profile> {
    const id = this.currentId++;
    const newProfile: Profile = {
      ...profile,
      id,
      bio: profile.bio || null,
      profession: profile.profession || null,
      photos: profile.photos || [],
      location: profile.location || null,
      interests: profile.interests || null,
      maxDistance: profile.maxDistance || null,
      ageRangeMin: profile.ageRangeMin || null,
      ageRangeMax: profile.ageRangeMax || null,
      isActive: profile.isActive !== undefined ? profile.isActive : true,
      createdAt: new Date(),
    };
    this.profiles.set(profile.userId, newProfile);
    return newProfile;
  }

  async updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(userId);
    if (!existing) return undefined;

    const updated = { ...existing, ...profile };
    this.profiles.set(userId, updated);
    return updated;
  }

  // Swipe methods
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const id = this.currentId++;
    const newSwipe: Swipe = {
      ...swipe,
      id,
      isSuperLike: swipe.isSuperLike || false,
      createdAt: new Date(),
    };
    
    const key = `${swipe.swiperId}-${swipe.swipedId}`;
    this.swipes.set(key, newSwipe);

    // Check for mutual like to create match
    if (swipe.isLike) {
      const reverseKey = `${swipe.swipedId}-${swipe.swiperId}`;
      const reverseSwipe = this.swipes.get(reverseKey);
      
      if (reverseSwipe && reverseSwipe.isLike) {
        await this.createMatch(swipe.swiperId, swipe.swipedId);
      }
    }

    return newSwipe;
  }

  async getSwipe(swiperId: number, swipedId: number): Promise<Swipe | undefined> {
    const key = `${swiperId}-${swipedId}`;
    return this.swipes.get(key);
  }

  // Match methods
  async createMatch(user1Id: number, user2Id: number): Promise<Match> {
    const id = this.currentId++;
    const match: Match = {
      id,
      user1Id,
      user2Id,
      createdAt: new Date(),
    };
    this.matches.set(id, match);
    return match;
  }

  async getUserMatches(userId: number): Promise<(Match & { profile: Profile })[]> {
    const userMatches = Array.from(this.matches.values())
      .filter(match => match.user1Id === userId || match.user2Id === userId);

    return userMatches.map(match => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
      const profile = this.profiles.get(otherUserId);
      
      return {
        ...match,
        profile: profile!,
      };
    }).filter(match => match.profile);
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const newMessage: Message = {
      ...message,
      id,
      isRead: message.isRead || false,
      createdAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMatchMessages(matchId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getConversations(userId: number): Promise<{ match: Match; lastMessage: Message | null; profile: Profile }[]> {
    const userMatches = await this.getUserMatches(userId);
    
    return userMatches.map(match => {
      const matchMessages = Array.from(this.messages.values())
        .filter(message => message.matchId === match.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return {
        match,
        lastMessage: matchMessages[0] || null,
        profile: match.profile,
      };
    });
  }
}

// Use DatabaseStorage now that schema is configured
export const storage = new DatabaseStorage();