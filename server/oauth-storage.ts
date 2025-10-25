import { type User, type InsertUser, type Profile, type InsertProfile } from "@shared/schema";

// Temporary OAuth storage for users not yet registered
export class OAuthStorage {
  private static tempUsers: Map<string, any> = new Map();
  private static userIdCounter = 10000; // Start from 10000 to avoid conflicts

  static storeTempUser(email: string, oauthData: any): string {
    const tempId = `temp_${Date.now()}_${email}`;
    this.tempUsers.set(tempId, {
      ...oauthData,
      tempId,
      createdAt: new Date()
    });
    console.log("🔵 Stored temp OAuth user:", tempId);
    return tempId;
  }

  static getTempUser(tempId: string): any {
    return this.tempUsers.get(tempId);
  }

  static createRealUser(tempId: string, additionalData: any): User {
    const tempUser = this.getTempUser(tempId);
    if (!tempUser) {
      throw new Error("Temp user not found");
    }

    const realUser: User = {
      id: this.userIdCounter++,
      email: tempUser.email,
      password: null, // OAuth users don't have passwords
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      profileImage: tempUser.profileImage,
      emailVerified: true, // OAuth users are automatically verified
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData
    };

    // Clean up temp user
    this.tempUsers.delete(tempId);
    console.log("🔵 Created real user from temp:", realUser.id);
    return realUser;
  }

  static cleanupExpiredUsers() {
    const now = new Date();
    const expiredKeys: string[] = [];
    
    this.tempUsers.forEach((user, key) => {
      const createdAt = new Date(user.createdAt);
      const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (diffHours > 24) { // Clean up after 24 hours
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.tempUsers.delete(key));
    if (expiredKeys.length > 0) {
      console.log("🔵 Cleaned up expired temp users:", expiredKeys.length);
    }
  }
}

// Clean up expired users every hour
setInterval(() => {
  OAuthStorage.cleanupExpiredUsers();
}, 60 * 60 * 1000);