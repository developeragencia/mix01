import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketManager } from "./websocket";
import { registerAdminRoutes } from "./admin-routes";
import { createStripeProducts } from "./stripe-setup";
import { insertUserSchema, registerUserSchema, insertProfileSchema, insertSwipeSchema, insertMessageSchema, type Swipe, type Match } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import passport from "passport";
import { setupAuth, requireAuth } from "./auth";
import { OAuthStorage } from "./oauth-storage";
import Stripe from "stripe";
import { OAuth2Client } from 'google-auth-library';

// Initialize Stripe (optional for development)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    })
  : null;

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server first
  const httpServer = createServer(app);
  
  // Initialize WebSocket manager early so routes can use it
  const wsManager = new WebSocketManager(httpServer);
  console.log('🔗 WebSocket server initialized');

  // Health check endpoint for Railway/Render
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "MIX App Digital"
    });
  });

  // Setup authentication with OAuth
  setupAuth(app);

  // ✅ Google OAuth Configuration
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("❌ GOOGLE_CLIENT_ID não configurado!");
  }
  
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  );

  // ✅ Google OAuth Login/Register Endpoint
  app.post("/api/auth/google", async (req, res) => {
    try {
      console.log("🔵 ========================================");
      console.log("🔵 GOOGLE OAUTH REQUEST");
      console.log("🔵 ========================================");
      
      const { credential } = req.body;

      if (!credential) {
        console.error("❌ Credencial não fornecida");
        return res.status(400).json({ 
          success: false, 
          message: "Credencial do Google não fornecida" 
        });
      }

      console.log("🔵 Verificando token do Google...");

      // Verify the JWT token from Google
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        console.error("❌ Payload inválido ou email não encontrado");
        return res.status(401).json({ 
          success: false, 
          message: "Erro ao validar credencial do Google" 
        });
      }

      const { email, given_name, family_name, picture, email_verified } = payload;
      
      console.log("🔵 ========================================");
      console.log("🔵 DADOS DO GOOGLE:");
      console.log("🔵 Email:", email);
      console.log("🔵 Nome:", given_name, family_name);
      console.log("🔵 Email verificado:", email_verified);
      console.log("🔵 ========================================");

      // Check if user exists
      let user = await storage.getUserByEmail(email);
      const isNewUser = !user;

      if (!user) {
        console.log("🔵 Usuário não existe, criando novo usuário...");
        
        // Create new user
        user = await storage.createUser({
          email: email,
          firstName: given_name || "User",
          lastName: family_name || "",
          profileImage: picture || "",
          password: "", // OAuth users don't need passwords
          username: (given_name || "user").toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substring(2, 5),
          phone: "",
          birthDate: "",
          gender: "",
          sexualOrientation: [],
          interestedIn: [],
          city: "",
          location: "",
          education: "",
          company: "",
          school: "",
          interests: [],
          bio: "",
          photos: [],
          isOnline: false,
          subscriptionType: "free",
          dailyLikes: 0,
        });
        
        console.log("✅ Novo usuário criado com ID:", user.id);
      } else {
        console.log("🔵 Usuário já existe, ID:", user.id);
        
        // Atualizar foto de perfil se mudou
        if (picture && picture !== user.profileImage) {
          console.log("🔵 Atualizando foto de perfil...");
          await storage.updateUser(user.id, { profileImage: picture });
        }
      }

      console.log("🔵 Fazendo login do usuário...");

      // Login user
      req.login(user, async (err) => {
        if (err) {
          console.error("❌ Erro ao criar sessão:", err);
          return res.status(500).json({ 
            success: false, 
            message: "Erro ao criar sessão" 
          });
        }

        console.log("✅ Login realizado com sucesso");

        // Get fresh user data
        const freshUser = await storage.getUserByEmail(email);
        
        if (!freshUser) {
          console.error("❌ Erro ao buscar dados do usuário");
          return res.status(500).json({ 
            success: false, 
            message: "Erro ao buscar dados do usuário" 
          });
        }

        // Check if profile is complete
        const isProfileComplete = !!(
          freshUser.birthDate &&
          freshUser.gender &&
          freshUser.photos &&
          freshUser.photos.length >= 2 &&
          freshUser.interestedIn &&
          freshUser.interestedIn.length > 0
        );

        console.log("🔵 ========================================");
        console.log("🔵 VERIFICAÇÃO DE PERFIL:");
        console.log("🔵 birthDate:", !!freshUser.birthDate, freshUser.birthDate);
        console.log("🔵 gender:", !!freshUser.gender, freshUser.gender);
        console.log("🔵 photos:", freshUser.photos?.length || 0);
        console.log("🔵 interestedIn:", freshUser.interestedIn?.length || 0);
        console.log("🔵 Perfil completo:", isProfileComplete);
        console.log("🔵 ========================================");

        // Save session
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("❌ Erro ao salvar sessão:", saveErr);
          } else {
            console.log("✅ Sessão salva com sucesso");
          }
          
          console.log("🔵 ========================================");
          console.log("🔵 RESPOSTA ENVIADA:");
          console.log("🔵 success: true");
          console.log("🔵 isNewUser:", isNewUser);
          console.log("🔵 isProfileComplete:", isProfileComplete);
          console.log("🔵 ========================================");
          
          return res.json({
            success: true,
            message: "Login realizado com sucesso",
            user: {
              id: freshUser.id,
              email: freshUser.email,
              firstName: freshUser.firstName,
              username: freshUser.username,
            },
            isNewUser: isNewUser,
            isProfileComplete: isProfileComplete,
          });
        });
      });
    } catch (error: any) {
      console.error("🔵 ========================================");
      console.error("❌ ERRO GOOGLE OAUTH:");
      console.error("❌ Tipo:", error.name);
      console.error("❌ Mensagem:", error.message);
      console.error("❌ Stack:", error.stack);
      console.error("🔵 ========================================");
      
      return res.status(500).json({ 
        success: false, 
        message: `Erro ao processar login com Google: ${error.message}`,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Helper function to check if profile is complete
  function isProfileComplete(user: any): boolean {
    // ✅ Perfil completo = birthDate + pelo menos 2 fotos
    // Gender e interestedIn são opcionais - usuário pode definir depois
    return !!(
      user.birthDate &&
      user.photos && user.photos.length >= 2
    );
  }

  // Check authentication status
  app.get("/api/auth/user", async (req, res) => {
    if (req.isAuthenticated() && req.user) {
      const sessionUser = req.user as any;
      
      // ✅ CRÍTICO: Buscar dados atualizados do banco ao invés de confiar na sessão
      const freshUser = await storage.getUser(sessionUser.id);
      
      if (!freshUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const profileComplete = isProfileComplete(freshUser);
      
      // ✅ CORREÇÃO CRÍTICA: Garantir que isProfileComplete é sempre booleano
      const result = {
        ...freshUser,
        isProfileComplete: !!profileComplete // Forçar conversão para boolean
      };
      
      res.json(result);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Update user data (e.g., photos)
  app.patch("/api/user/update", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as any;
      const userId = user.id;
      const { photos, ...otherData } = req.body;

      const updateData: any = { ...otherData };
      
      // ✅ SINCRONIZAR: se photos foi atualizado, atualizar profileImage também
      if (photos !== undefined && Array.isArray(photos)) {
        updateData.photos = photos;
        // Se há fotos, usar a primeira. Se não há fotos, limpar profileImage
        updateData.profileImage = photos.length > 0 ? photos[0] : "";
        console.log(`🔵 ✅ Sincronizando profileImage: ${photos.length > 0 ? 'photos[0]' : 'vazio'}`);
      }

      // Update user in database
      const updatedUser = await storage.updateUser(userId, updateData);

      // Update session with new data
      req.user = { ...req.user, ...updatedUser };
      
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Create account from OAuth session
  app.post("/api/auth/create-oauth-account", async (req, res) => {
    try {
      console.log("🔵 /api/auth/create-oauth-account called");
      console.log("🔵 req.isAuthenticated():", req.isAuthenticated());
      
      if (!req.isAuthenticated() || !req.user) {
        console.log("🔴 User not authenticated or no user object");
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as any;
      console.log("🔵 User metadata:", {
        id: user.id,
        email: user.email,
        isNewUser: user.isNewUser,
        tempId: user.tempId
      });
      
      if (!user.isNewUser || !user.tempId) {
        console.log("🔴 Invalid OAuth session - not new user or no tempId");
        console.log("🔴 user.isNewUser:", user.isNewUser);
        console.log("🔴 user.tempId:", user.tempId);
        return res.status(400).json({ message: "Invalid OAuth session" });
      }

      console.log("🔵 Creating OAuth account from tempId:", user.tempId);

      // Get temp user data
      const tempUser = OAuthStorage.getTempUser(user.tempId);
      if (!tempUser) {
        return res.status(400).json({ message: "Invalid or expired temp user" });
      }

      // Create actual user account
      const newUser = await storage.createUser({
        email: tempUser.email,
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        profileImage: tempUser.profileImage,
        password: "", // OAuth users don't have passwords
        username: tempUser.firstName?.toLowerCase() || "user"
      });

      console.log("🔵 OAuth account created successfully:", newUser.id);

      // Update session with real user data
      req.login({ ...newUser, isOAuthUser: true, isNewUser: false }, (err) => {
        if (err) {
          console.error("🔴 Error setting up session:", err);
          return res.status(500).json({ message: "Session error" });
        }
        res.json({ 
          success: true, 
          message: "Account created successfully", 
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            profileImage: newUser.profileImage
          }
        });
      });
    } catch (error) {
      console.error("🔴 Error creating OAuth account:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });


  // Test Facebook OAuth system
  app.get("/api/test-facebook-oauth", (req, res) => {
    try {
      console.log("🔵 Testing Facebook OAuth system");
      
      // Create a test temp user for Facebook
      const tempId = OAuthStorage.storeTempUser("test@facebook.local", {
        provider: "facebook",
        email: "test@facebook.local",
        firstName: "Facebook",
        lastName: "User",
        profileImage: "https://graph.facebook.com/123456789/picture?type=large"
      });
      
      // Create a temp user session
      const tempUser = {
        isOAuthUser: true,
        isNewUser: true,
        tempId,
        provider: "facebook",
        email: "test@facebook.local",
        firstName: "Facebook",
        lastName: "User",
        profileImage: "https://graph.facebook.com/123456789/picture?type=large"
      };
      
      // Login the temp user
      req.login(tempUser, (err) => {
        if (err) {
          console.error("🔴 Error logging in Facebook temp user:", err);
          return res.status(500).json({ message: "Login error" });
        }
        console.log("🔵 Test Facebook OAuth user logged in successfully");
        res.json({ 
          message: "Facebook OAuth test successful",
          tempId,
          redirectTo: "/discover"
        });
      });
    } catch (error) {
      console.error("🔴 Test Facebook OAuth error:", error);
      res.status(500).json({ message: "Test failed" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Check authentication status
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ authenticated: false, message: "Not authenticated" });
      }

      const user = req.user as any;
      
      // Get user profile if exists
      let profile = null;
      if (user.id) {
        profile = await storage.getProfile(user.id);
      }

      res.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        profile: profile ? {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          photos: profile.photos,
        } : null
      });
    } catch (error) {
      console.error("🔴 Error checking auth:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Traditional auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Aceitar email, password, username (opcional) e phone (opcional)
      const { email, password, username: providedUsername, phone } = req.body;
      
      // Validar password (mínimo 6 caracteres)
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Senha deve ter pelo menos 6 caracteres" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      // Usar username fornecido ou gerar baseado no email
      let username = providedUsername;
      if (!username) {
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        username = baseUsername;
        let attempts = 0;
        
        while (attempts < 10) {
          const existingUsername = await storage.getUserByUsername(username);
          if (!existingUsername) break;
          
          username = baseUsername + Math.floor(Math.random() * 9999).toString();
          attempts++;
        }
      }
      
      // Hash da senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Criar usuário com dados mínimos + valores padrão
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        username,
        firstName: "",
        lastName: "",
        profileImage: "",
        phone: phone || "",
        birthDate: "",
        gender: "",
        sexualOrientation: [],
        interestedIn: [],
        city: "",
        location: "",
        education: "",
        company: "",
        school: "",
        interests: [],
        bio: "",
        photos: [],
        isOnline: false,
        subscriptionType: "free",
        dailyLikes: 0,
      });
      
      // Não criar perfil automaticamente - usuário vai preencher depois
      console.log("🔵 ✅ Usuário registrado:", user.email, "| Phone:", phone || "N/A");
      
      // Fazer login automático após registro usando req.login
      req.login(user, (err) => {
        if (err) {
          console.error("🔴 Erro no login automático após registro:", err);
          return res.json({ user: { id: user.id, username: user.username, email: user.email }, loginError: true });
        }
        
        // ✅ Perfil nunca está completo logo após registro
        const profileComplete = false;
        
        console.log("🔵 ✅ Usuário logado automaticamente após registro:", user.email);
        res.json({ 
          user: { id: user.id, username: user.username, email: user.email },
          loggedIn: true,
          isProfileComplete: profileComplete,
          message: "Conta criada e login realizado com sucesso"
        });
      });
    } catch (error) {
      console.error("🔴 Erro no registro:", error);
      if (error instanceof Error && error.message.includes('duplicate key')) {
        res.status(400).json({ message: "Usuário já existe" });
      } else {
        res.status(400).json({ message: "Dados inválidos" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, email, password } = req.body;
      const loginIdentifier = identifier || email; // Aceitar ambos os campos
      
      console.log("🔵 Login attempt for:", loginIdentifier);
      console.log("🔵 Request body received:", { identifier, email, hasPassword: !!password });
      
      // Validar se senha foi fornecida
      if (!password) {
        console.log("🔴 Password not provided in request");
        return res.status(400).json({ message: "Senha é obrigatória" });
      }
      
      // Tentar buscar por email OU por telefone
      let user = await storage.getUserByEmail(loginIdentifier);
      
      // Se não encontrar por email, tentar por telefone
      if (!user) {
        console.log("🔵 Not found by email, trying phone...");
        user = await storage.getUserByPhone(loginIdentifier); // O campo pode conter telefone
      }
      
      if (!user) {
        console.log("🔴 User not found (email/phone):", loginIdentifier);
        return res.status(404).json({ 
          message: "Usuário não encontrado", 
          userNotFound: true 
        });
      }
      
      console.log("🔵 User found, checking password");
      console.log("🔵 Stored password hash exists:", !!user.password);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("🔴 Password mismatch for:", loginIdentifier);
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      
      // Fazer login usando sessão
      req.login(user, (err) => {
        if (err) {
          console.error("🔴 Erro no login:", err);
          return res.status(500).json({ message: "Login session error" });
        }
        
        // Salvar sessão explicitamente antes de responder
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("🔴 Erro ao salvar sessão:", saveErr);
            return res.status(500).json({ message: "Session save error" });
          }
          
          // ✅ Verificar se perfil está completo
          const profileComplete = isProfileComplete(user);
          
          console.log("🔵 ✅ Usuário logado e sessão salva:", user.email);
          console.log("🔵 Profile complete:", profileComplete);
          
          res.json({ 
            user: { id: user.id, username: user.username, email: user.email },
            loggedIn: true,
            isProfileComplete: profileComplete,
            message: "Login realizado com sucesso"
          });
        });
      });
    } catch (error) {
      console.error("🔴 Erro no login:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Phone registration route
  app.post("/api/auth/phone/register", async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      
      console.log("🔵 Phone registration attempt:", { username, email, phone });
      
      // Validações básicas (username é gerado automaticamente pelo frontend)
      if (!email || !phone || !password) {
        return res.status(400).json({ message: "Email, telefone e senha são obrigatórios" });
      }
      
      if (!email.includes('@')) {
        return res.status(400).json({ message: "Email inválido" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ message: "Senha deve ter pelo menos 6 caracteres" });
      }
      
      // Verificar se email já existe
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Este email já está cadastrado" });
      }
      
      // Verificar se telefone já existe
      const existingPhone = await storage.getUserByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ message: "Este telefone já está cadastrado" });
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Criar usuário
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        username: username || email.split('@')[0],
        firstName: "",
        lastName: "",
        phone,
        isOnline: false,
        subscriptionType: "free",
        dailyLikes: 0,
      });
      
      // Fazer login automático
      req.login(user, (err) => {
        if (err) {
          console.error("🔴 Erro no auto-login após cadastro:", err);
          return res.status(500).json({ message: "Erro ao fazer login automático" });
        }
        
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("🔴 Erro ao salvar sessão:", saveErr);
            return res.status(500).json({ message: "Erro ao salvar sessão" });
          }
          
          console.log("🔵 ✅ Usuário cadastrado e logado com telefone:", phone);
          res.json({
            user: { id: user.id, username: user.username, phone: user.phone },
            message: "Cadastro realizado com sucesso"
          });
        });
      });
    } catch (error) {
      console.error("🔴 Erro no cadastro com telefone:", error);
      res.status(500).json({ message: "Erro ao criar conta" });
    }
  });

  // Password reset routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "Email não encontrado" });
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token
      const success = await storage.setPasswordResetToken(email, resetToken, resetTokenExpiry);
      
      if (!success) {
        return res.status(500).json({ message: "Erro ao gerar token de redefinição" });
      }

      // In a real app, send email here
      console.log(`Reset token for ${email}: ${resetToken}`);
      console.log(`Reset link: http://localhost:5000/reset-password?token=${resetToken}`);
      
      res.json({ message: "Link de redefinição enviado para seu email" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token e nova senha são obrigatórios" });
      }

      // Find user by token
      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
      }

      // Update password
      await storage.updateUserPassword(user.id, newPassword);
      
      // Clear reset token
      await storage.clearPasswordResetToken(user.id);
      
      res.json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao redefinir senha" });
    }
  });

  app.get("/api/auth/validate-token/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ valid: false, message: "Token inválido ou expirado" });
      }
      
      res.json({ valid: true, message: "Token válido" });
    } catch (error) {
      res.status(500).json({ valid: false, message: "Erro ao validar token" });
    }
  });

  // Profile routes
  // IMPORTANT: Specific routes must come BEFORE parameterized routes
  
  // Discovery route for location page
  app.get("/api/profiles/discovery", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const profiles = await storage.getProfiles();
      
      // Return limited profiles for discovery
      const limitedProfiles = profiles.slice(0, limit).map(profile => ({
        ...profile,
        isOnline: false, // TODO: Add real-time online status
      }));
      
      res.json(limitedProfiles);
    } catch (error) {
      console.error("Error getting discovery profiles:", error);
      res.status(500).json({ message: "Failed to get discovery profiles" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      // Pegar userId da sessão ao invés do body
      const currentUserId = (req.user as any)?.id;
      
      if (!currentUserId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      
      // Verificar se já existe perfil para este usuário
      const existingProfile = await storage.getProfile(currentUserId);
      if (existingProfile) {
        return res.status(400).json({ message: "Perfil já existe para este usuário" });
      }
      
      const profileData = insertProfileSchema.parse(req.body);
      const newProfile = await storage.createProfile({ ...profileData, userId: currentUserId });
      
      console.log("🔵 ✅ Perfil criado com sucesso para userId:", currentUserId);
      res.json(newProfile);
    } catch (error: any) {
      console.error("🔴 Erro ao criar perfil:", error);
      
      // Return detailed error message for better debugging
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Dados do perfil inválidos", 
          errors: error.errors 
        });
      }
      
      res.status(400).json({ 
        message: error.message || "Dados do perfil inválidos" 
      });
    }
  });

  // GET /api/profiles/:userId - Removido (duplicado - versão com logs mantida abaixo)

  app.put("/api/profiles/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Verify user is updating their own profile
      const currentUserId = (req.user as any)?.id;
      if (currentUserId !== userId) {
        return res.status(403).json({ message: "Não autorizado a editar este perfil" });
      }
      
      // ✅ SINCRONIZAR: Se photos foi atualizado, sincronizar com users.profileImage
      if (req.body.photos !== undefined && Array.isArray(req.body.photos)) {
        await storage.updateUser(userId, {
          photos: req.body.photos,
          profileImage: req.body.photos.length > 0 ? req.body.photos[0] : ""
        });
        console.log(`🔵 ✅ Sincronizando photos e profileImage em users table: ${req.body.photos.length > 0 ? 'photos[0]' : 'vazio'}`);
      }
      
      const profileData = insertProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage.updateProfile(userId, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      console.log("🔵 ✅ Perfil atualizado com sucesso para userId:", userId);
      res.json(updatedProfile);
    } catch (error: any) {
      console.error("🔴 Error updating profile:", error);
      
      // Return detailed error message for better debugging
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Dados do perfil inválidos", 
          errors: error.errors 
        });
      }
      
      res.status(400).json({ 
        message: error.message || "Failed to update profile" 
      });
    }
  });

  // PATCH endpoint for onboarding flow - creates or updates profile (UPSERT)
  app.patch("/api/profiles/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Verify user is updating their own profile
      const currentUserId = (req.user as any)?.id;
      if (currentUserId !== userId) {
        return res.status(403).json({ message: "Não autorizado a editar este perfil" });
      }
      
      console.log("🔵 ========================================");
      console.log("🔵 PATCH /api/profiles/:userId");
      console.log("🔵 User ID:", userId);
      console.log("🔵 ========================================");
      
      // Verificar se o usuário existe
      const user = await storage.getUser(userId);
      if (!user) {
        console.log("🔴 Usuário não encontrado:", userId);
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // ✅ VALIDAÇÃO E LOG DE FOTOS COM LIMITE DE TAMANHO
      if (req.body.photos !== undefined && Array.isArray(req.body.photos)) {
        console.log("🔵 ========================================");
        console.log("🔵 PROCESSANDO FOTOS:");
        console.log(`🔵 Total de fotos recebidas: ${req.body.photos.length}`);
        
        const MAX_PHOTO_SIZE_KB = 300;
        const oversizedPhotos: number[] = [];
        
        req.body.photos.forEach((photo: string, idx: number) => {
          if (photo && photo.startsWith('data:image/')) {
            const sizeKB = Math.round((photo.length * 0.75) / 1024);
            const mimeType = photo.substring(0, photo.indexOf(';'));
            console.log(`🔵 Foto ${idx + 1}: ${sizeKB} KB, tipo: ${mimeType}`);
            
            if (sizeKB > MAX_PHOTO_SIZE_KB) {
              oversizedPhotos.push(idx + 1);
              console.error(`🔴 Foto ${idx + 1} excede limite: ${sizeKB} KB > ${MAX_PHOTO_SIZE_KB} KB`);
            }
          } else {
            console.warn(`⚠️ Foto ${idx + 1}: Formato inválido`);
          }
        });
        
        console.log("🔵 ========================================");
        
        // ✅ REJEITAR se alguma foto exceder o limite
        if (oversizedPhotos.length > 0) {
          return res.status(400).json({ 
            error: "PHOTO_TOO_LARGE",
            message: `Fotos muito grandes: #${oversizedPhotos.join(', #')}. Máximo permitido: ${MAX_PHOTO_SIZE_KB} KB por foto.`,
            oversizedPhotos,
            maxSizeKB: MAX_PHOTO_SIZE_KB
          });
        }
      }
      
      // CRÍTICO: Atualizar dados do usuário também (birthDate, gender, photos, interestedIn, firstName)
      const userUpdateData: any = {};
      if (req.body.firstName) userUpdateData.firstName = req.body.firstName;
      if (req.body.name && !req.body.firstName) userUpdateData.firstName = req.body.name;
      if (req.body.birthDate) userUpdateData.birthDate = req.body.birthDate;
      if (req.body.gender) userUpdateData.gender = req.body.gender;
      if (req.body.photos !== undefined && Array.isArray(req.body.photos)) {
        userUpdateData.photos = req.body.photos;
        // ✅ SINCRONIZAR: primeira foto do array vira profileImage, ou limpa se vazio
        userUpdateData.profileImage = req.body.photos.length > 0 ? req.body.photos[0] : "";
        
        const firstPhotoSize = req.body.photos.length > 0 
          ? Math.round((req.body.photos[0].length * 0.75) / 1024) 
          : 0;
        
        console.log("🔵 ========================================");
        console.log("🔵 SINCRONIZAÇÃO DE FOTOS:");
        console.log(`🔵 Total fotos: ${req.body.photos.length}`);
        console.log(`🔵 ProfileImage: ${req.body.photos.length > 0 ? `Definida (${firstPhotoSize} KB)` : 'Vazio'}`);
        console.log("🔵 ========================================");
      }
      if (req.body.interestedIn) userUpdateData.interestedIn = req.body.interestedIn;
      if (req.body.sexualOrientation) userUpdateData.sexualOrientation = req.body.sexualOrientation;
      
      if (Object.keys(userUpdateData).length > 0) {
        console.log("🔵 ========================================");
        console.log("🔵 ATUALIZANDO DADOS DO USUÁRIO:");
        console.log("🔵 Campos:", Object.keys(userUpdateData).join(', '));
        
        // ✅ Log de fotos sem expor base64
        if (userUpdateData.photos) {
          console.log(`🔵 Fotos: ${userUpdateData.photos.length} itens`);
        }
        console.log("🔵 ========================================");
        
        await storage.updateUser(userId, userUpdateData);
        
        console.log("🔵 ✅ Dados do usuário atualizados com sucesso!");
        
        // ✅ VERIFICAR SE PERFIL ESTÁ COMPLETO APÓS ATUALIZAÇÃO E SALVAR NO BD
        const updatedUser = await storage.getUser(userId);
        const isComplete = isProfileComplete(updatedUser);
        
        console.log("🔵 ========================================");
        console.log("🔵 VERIFICAÇÃO DE PERFIL COMPLETO:");
        console.log("🔵 birthDate:", !!updatedUser?.birthDate, updatedUser?.birthDate);
        console.log("🔵 gender:", !!updatedUser?.gender, updatedUser?.gender);
        console.log("🔵 photos:", updatedUser?.photos?.length || 0);
        console.log("🔵 interestedIn:", updatedUser?.interestedIn?.length || 0);
        console.log("🔵 RESULTADO:", isComplete ? "✅ COMPLETO" : "❌ INCOMPLETO");
        console.log("🔵 ========================================");
        
        // ✅ CRÍTICO: Atualizar isProfileComplete no banco de dados
        if (updatedUser && updatedUser.isProfileComplete !== isComplete) {
          console.log("🔵 Atualizando isProfileComplete no BD:", isComplete);
          await storage.updateUser(userId, { isProfileComplete: isComplete });
        }
      }
      
      // Verificar se perfil já existe
      const existingProfile = await storage.getProfile(userId);
      
      const profileData = insertProfileSchema.partial().parse(req.body);
      
      // IMPORTANTE: Garantir que fotos sejam sincronizadas em profiles.photos também
      if (req.body.photos && req.body.photos.length > 0) {
        profileData.photos = req.body.photos;
        console.log("🔵 Sincronizando fotos para profiles.photos:", req.body.photos.length, "fotos");
      }
      
      let profile;
      if (existingProfile) {
        // Atualizar perfil existente
        console.log("🔵 Perfil já existe, atualizando...");
        // ✅ Só atualizar se houver dados para atualizar
        if (Object.keys(profileData).length > 0) {
          profile = await storage.updateProfile(userId, profileData);
          console.log("🔵 ✅ Perfil atualizado com sucesso para userId:", userId);
        } else {
          console.log("🔵 Nenhum dado para atualizar no perfil, mantendo existente");
          profile = existingProfile;
        }
      } else {
        // Criar novo perfil
        console.log("🔵 Perfil não existe, criando...");
        
        // Calcular idade do usuário se birthDate existe
        let age = 18; // idade padrão
        const birthDateToUse = req.body.birthDate || user.birthDate;
        if (birthDateToUse) {
          const birth = new Date(birthDateToUse);
          const today = new Date();
          age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
        }
        
        // Criar o perfil com dados obrigatórios + fotos
        profile = await storage.createProfile({ 
          name: profileData.name || user.firstName || "User",
          age: age,
          ...profileData,
          photos: req.body.photos || [],
          userId 
        });
        console.log("🔵 ✅ Perfil criado com sucesso para userId:", userId);
      }
      
      res.json(profile);
    } catch (error: any) {
      console.error("🔴 Error creating/updating profile:", error);
      
      // Return detailed error message for better debugging
      if (error.name === 'ZodError') {
        console.error("🔴 Erros de validação Zod:", error.errors);
        return res.status(400).json({ 
          message: "Dados do perfil inválidos", 
          errors: error.errors 
        });
      }
      
      res.status(400).json({ 
        message: error.message || "Failed to create/update profile" 
      });
    }
  });

  // Discovery routes
  app.get("/api/discover", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // ⚡ CACHE: Adicionar headers de cache (5 minutos)
      res.setHeader('Cache-Control', 'private, max-age=300');
      res.setHeader('ETag', `discover-${currentUserId}-${Date.now()}`);
      
      console.time(`⏱️ Discover total - User ${currentUserId}`);
      
      // ⚡ OTIMIZAÇÃO: Usar método otimizado que faz tudo em uma query
      console.time('⏱️ getProfilesForDiscovery');
      const profiles = await storage.getProfilesForDiscovery(currentUserId, 50);
      console.timeEnd('⏱️ getProfilesForDiscovery');
      
      // ⚡ OTIMIZAÇÃO: Buscar swipes, matches e blocks em paralelo
      console.time('⏱️ getUserSwipes + getUserMatches + getBlockedUsers');
      const [userSwipes, userMatches, blockedUsers] = await Promise.all([
        storage.getUserSwipes(currentUserId),
        storage.getUserMatches(currentUserId),
        storage.getBlockedUsers?.(currentUserId) || Promise.resolve([])
      ]);
      console.timeEnd('⏱️ getUserSwipes + getUserMatches + getBlockedUsers');
      
      // ✅ CORREÇÃO: Apenas filtrar swipes (não matches - para permitir re-match após desfazer)
        const swipedUserIds = new Set(userSwipes.map((s: Swipe) => s.swipedId));
        
      // ✅ CORREÇÃO: Criar set de usuários bloqueados
      const blockedUserIds = new Set(blockedUsers.map((b: any) => b.blockedUserId));
      
      // ⚡ OTIMIZAÇÃO: Filtrar apenas perfis já swipados e bloqueados (NÃO matches)
      const filteredProfiles = profiles.filter(profile => 
        !swipedUserIds.has(profile.userId) && !blockedUserIds.has(profile.userId)
      );
      
      // ⚡ OTIMIZAÇÃO: Buscar todos os usuários em UMA query ao invés de N queries
      console.time('⏱️ getUsersByIds');
      const userIds = filteredProfiles.map(p => p.userId);
      const users = await storage.getUsersByIds?.(userIds) || [];
      console.timeEnd('⏱️ getUsersByIds');
      
      const usersMap = new Map(users.map(u => [u.id, u]));
      
      // ⚡ OTIMIZAÇÃO: Merge síncrono sem await
      const profilesWithOnlineStatus = filteredProfiles.map(profile => {
        const user = usersMap.get(profile.userId);
          return {
            ...profile,
            isOnline: user?.isOnline || false,
            lastSeen: user?.lastSeen || new Date()
          };
      });
      
      console.timeEnd(`⏱️ Discover total - User ${currentUserId}`);
      console.log(`✅ Discover retornou ${profilesWithOnlineStatus.length} perfis`);
      
      res.json(profilesWithOnlineStatus);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  app.get("/api/discover/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 10;
      const profiles = await storage.getProfilesForDiscovery(userId, limit);
      res.json(profiles);
    } catch (error) {
      res.status(400).json({ message: "Failed to get discovery profiles" });
    }
  });

  // Swipe routes
  app.post("/api/swipes", async (req, res) => {
    try {
      const { swipedId, type } = req.body;
      
      if (!swipedId || !type) {
        return res.status(400).json({ error: "Missing swipedId or type" });
      }
      
      if (!["like", "dislike"].includes(type)) {
        return res.status(400).json({ error: "Invalid swipe type" });
      }
      
      const swipeData = {
        swiperId: (req.user as any)?.id || 1, // Use actual user ID from session
        swipedId: parseInt(swipedId),
        isLike: type === "like",
        isSuperLike: false
      };
      
      console.log("Creating swipe with data:", swipeData);
      
      const swipe = await storage.createSwipe(swipeData);
      
      // Check if this creates a match (both users liked each other)
      let match = null;
      let matchProfile = null;
      if (swipeData.isLike) {
        try {
          console.log(`🔍 Verificando swipe recíproco: ${swipeData.swipedId} curtiu ${swipeData.swiperId}?`);
          const reciprocalSwipe = await storage.getSwipe(swipeData.swipedId, swipeData.swiperId);
          console.log("🔍 Swipe recíproco encontrado:", reciprocalSwipe ? "SIM" : "NÃO");
          
          if (reciprocalSwipe && reciprocalSwipe.isLike) {
            // Create a match
            console.log("✅ Ambos curtiram! Criando match...");
            match = await storage.createMatch(swipeData.swiperId, swipeData.swipedId);
            
            // Buscar dados completos do perfil do match (incluindo fotos)
            const matchedProfile = await storage.getProfile(swipeData.swipedId);
            if (matchedProfile) {
              matchProfile = {
                id: matchedProfile.userId,
                name: matchedProfile.name,
                age: matchedProfile.age,
                photos: matchedProfile.photos || [],
                bio: matchedProfile.bio || ""
              };
            }
            
            if (matchProfile) {
              console.log("🎉 MATCH CRIADO! ID:", match.id, "- Perfil:", {
                id: matchProfile.id,
                name: matchProfile.name,
                age: matchProfile.age,
                photos: matchProfile.photos?.length || 0
              });
            }
          } else if (reciprocalSwipe) {
            console.log("❌ Swipe encontrado mas não é like (é dislike)");
          } else {
            console.log("⏳ Swipe recíproco não existe ainda - aguardando retribuição");
          }
        } catch (error) {
          console.log("❌ Erro ao verificar swipe recíproco:", error);
        }
      }
      
      // Retornar dados completos do match
      if (match && matchProfile) {
        const matchResponse = { 
          swipe, 
          match: true,
          matchId: match.id,
          matchProfile: matchProfile
        };
        console.log("🎊 ========================================");
        console.log("🎊 ✅ MATCH CRIADO COM SUCESSO!");
        console.log("🎊 Match ID:", match.id);
        console.log("🎊 Usuário 1:", match.user1Id);
        console.log("🎊 Usuário 2:", match.user2Id);
        console.log("🎊 Perfil do match:", {
          id: matchProfile.id,
          name: matchProfile.name,
          age: matchProfile.age,
          photos: matchProfile.photos?.length || 0,
          bio: matchProfile.bio
        });
        console.log("🎊 ========================================");
        res.json(matchResponse);
      } else {
        console.log("❌ Sem match - retornando match: false");
        res.json({ swipe, match: false });
      }
    } catch (error) {
      console.error("Error creating swipe:", error);
      res.status(500).json({ error: "Failed to create swipe" });
    }
  });

  // NEW APIs for 100% completion
  // User profile routes
  app.get("/api/profiles/me", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const profile = await storage.getProfile(currentUserId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // User likes routes  
  app.get("/api/users/likes", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const likes = await storage.getUserLikes(currentUserId);
      res.json(likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ error: "Failed to fetch likes" });
    }
  });

  // User views routes
  app.get("/api/users/views", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const views = await storage.getUserViews(currentUserId);
      res.json(views);
    } catch (error) {
      console.error("Error fetching views:", error);
      res.status(500).json({ error: "Failed to fetch views" });
    }
  });

  // User favorites routes
  app.get("/api/users/favorites", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const favorites = await storage.getUserFavorites(currentUserId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/users/favorites", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const { profileId } = req.body;
      const success = await storage.addToFavorites(currentUserId, profileId);
      res.json({ success });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  });

  app.delete("/api/users/favorites/:profileId", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const profileId = parseInt(req.params.profileId);
      const success = await storage.removeFromFavorites(currentUserId, profileId);
      res.json({ success });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ error: "Failed to remove from favorites" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const notifications = await storage.getNotifications(currentUserId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Premium features routes
  app.post("/api/super-like", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { swipedId } = req.body;
      
      if (!swipedId) {
        return res.status(400).json({ error: "Missing swipedId" });
      }
      
      const swipe = await storage.createSuperLike(currentUserId, parseInt(swipedId));
      res.json({ success: true, swipe });
    } catch (error) {
      console.error("Error creating super like:", error);
      res.status(500).json({ error: "Failed to create super like" });
    }
  });

  app.post("/api/boost", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const boost = await storage.createBoost(currentUserId);
      res.json({ success: true, boost });
    } catch (error) {
      console.error("Error creating boost:", error);
      res.status(500).json({ error: "Failed to create boost" });
    }
  });

  app.get("/api/boost/active", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const boost = await storage.getUserActiveBoost(currentUserId);
      res.json({ hasActiveBoost: !!boost, boost });
    } catch (error) {
      console.error("Error checking boost:", error);
      res.status(500).json({ error: "Failed to check boost" });
    }
  });

  app.post("/api/rewind", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const result = await storage.createRewind(currentUserId);
      
      if (!result.swipe) {
        return res.status(404).json({ error: "No swipe to rewind" });
      }
      
      res.json({ success: true, swipe: result.swipe, rewind: result.rewind });
    } catch (error) {
      console.error("Error creating rewind:", error);
      res.status(500).json({ error: "Failed to create rewind" });
    }
  });

  // Matches routes - IMPLEMENTAÇÃO CRÍTICA CORRIGIDA
  app.get("/api/matches", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      console.log("🔵 GET /api/matches chamado - User ID:", currentUserId);
      
      const matches = await storage.getMatches(currentUserId);
      
      console.log("✅ Matches retornados:", {
        total: matches.length,
        novosMatches: matches.filter(m => m.lastMessage === null).length,
        conversas: matches.filter(m => m.lastMessage !== null).length,
        matches: matches.map(m => ({
          id: m.id,
          profileName: m.profile?.name,
          hasMessage: !!m.lastMessage,
          photos: m.profile?.photos?.length || 0
        }))
      });
      
      res.json(matches);
    } catch (error) {
      console.error("🔴 Erro ao buscar matches:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const matches = await storage.getMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching user matches:", error);
      res.status(500).json({ error: "Failed to fetch user matches" });
    }
  });

  // Get specific match by ID
  app.get("/api/match/:matchId", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      const currentUserId = (req.user as any)?.id;
      
      console.log("🔵 GET /api/match/:matchId chamado:", {
        matchId,
        currentUserId,
        authenticated: !!currentUserId
      });
      
      if (!currentUserId) {
        console.log("🔴 Usuário não autenticado");
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const match = await storage.getMatchById(matchId, currentUserId);
      
      if (!match) {
        console.log("🔴 Match não encontrado:", matchId);
        return res.status(404).json({ error: "Match not found" });
      }
      
      console.log("✅ Match encontrado:", {
        matchId: match.id,
        user1Id: match.user1Id,
        user2Id: match.user2Id,
        profileName: match.profile?.name,
        profilePhotos: match.profile?.photos?.length || 0
      });
      
      res.json(match);
    } catch (error) {
      console.error("🔴 Erro ao buscar match:", error);
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  // ✅ DELETE MATCH - Desfazer match
  app.delete("/api/matches/:userId", async (req, res) => {
    try {
      const targetUserId = parseInt(req.params.userId);
      const currentUserId = (req.user as any)?.id;

      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log("🔴 DELETE match:", { currentUserId, targetUserId });

      // Buscar o match entre os dois usuários
      const matches = await storage.getUserMatches(currentUserId);
      const match = matches.find(m => 
        (m.user1Id === currentUserId && m.user2Id === targetUserId) ||
        (m.user2Id === currentUserId && m.user1Id === targetUserId)
      );

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // ✅ CORREÇÃO: Deletar os swipes entre os dois usuários para permitir re-match
      await storage.deleteSwipesBetweenUsers?.(currentUserId, targetUserId);
      
      // Deletar o match
      await storage.deleteMatch(match.id);

      console.log(`✅ Match e swipes deletados entre ${currentUserId} e ${targetUserId}`);
      res.json({ success: true, message: "Match deleted successfully" });
    } catch (error) {
      console.error("Error deleting match:", error);
      res.status(500).json({ error: "Failed to delete match" });
    }
  });

  // ✅ BLOCK USER - Bloquear usuário
  app.post("/api/block/:userId", async (req, res) => {
    try {
      const blockedUserId = parseInt(req.params.userId);
      const currentUserId = (req.user as any)?.id;

      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log("🚫 BLOCK user:", { currentUserId, blockedUserId });

      // ✅ Criar registro de bloqueio
      await storage.createBlock?.(currentUserId, blockedUserId);

      // Deletar match se existir
      const matches = await storage.getUserMatches(currentUserId);
      const match = matches.find(m => 
        (m.user1Id === currentUserId && m.user2Id === blockedUserId) ||
        (m.user2Id === currentUserId && m.user1Id === blockedUserId)
      );

      if (match) {
        await storage.deleteMatch(match.id);
      }

      res.json({ success: true, message: "User blocked successfully" });
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ error: "Failed to block user" });
    }
  });

  // ✅ REPORT USER - Denunciar usuário
  app.post("/api/report/:userId", async (req, res) => {
    try {
      const reportedUserId = parseInt(req.params.userId);
      const currentUserId = (req.user as any)?.id;
      const { reason } = req.body;

      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log("🚩 REPORT user:", { currentUserId, reportedUserId, reason });

      // Criar registro de denúncia
      await storage.createReport({
        reporterId: currentUserId,
        reportedUserId: reportedUserId,
        reason: reason || "Comportamento inapropriado",
        status: "pending"
      });

      res.json({ success: true, message: "Report submitted successfully" });
    } catch (error) {
      console.error("Error reporting user:", error);
      res.status(500).json({ error: "Failed to submit report" });
    }
  });

  // Messages routes - IMPLEMENTAÇÃO CRÍTICA CORRIGIDA
  app.get("/api/messages/:matchId", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      console.log(`Fetching messages for match: ${matchId}`);
      
      const messages = await storage.getMessages(matchId);
      console.log(`Found messages: ${messages.length}`);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket
      console.log('📨 Broadcasting message via WebSocket:', newMessage.id);
      wsManager.notifyNewMessage(messageData.matchId, newMessage);
      
      res.json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Upload de imagem via base64
  app.post("/api/messages/image", async (req, res) => {
    try {
      const { matchId, senderId, imageData } = req.body;
      
      if (!matchId || !senderId || !imageData) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validar que é uma imagem base64
      if (!imageData.startsWith('data:image/')) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      const messageData = {
        matchId: parseInt(matchId),
        senderId: parseInt(senderId),
        content: "📷 Imagem",
        imageUrl: imageData
      };
      
      const newMessage = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket
      console.log('📨 Broadcasting image message via WebSocket:', newMessage.id);
      wsManager.notifyNewMessage(messageData.matchId, newMessage);
      
      res.json(newMessage);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // ✅ DELETE MESSAGE - Deletar mensagem própria
  app.delete("/api/messages/:messageId", async (req, res) => {
    try {
      const messageId = parseInt(req.params.messageId);
      const currentUserId = (req.user as any)?.id;

      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log("🗑️ DELETE message:", { messageId, currentUserId });

      // Verificar se a mensagem pertence ao usuário
      const message = await storage.getMessageById?.(messageId);
      
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      if (message.senderId !== currentUserId) {
        return res.status(403).json({ error: "You can only delete your own messages" });
      }

      // Deletar a mensagem
      await storage.deleteMessage?.(messageId);

      res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  app.post("/api/matches/:matchId/messages", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      const currentUserId = (req.user as any)?.id;
      const { content } = req.body;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      if (!content) {
        return res.status(400).json({ error: "Message content is required" });
      }
      
      const messageData = {
        matchId,
        senderId: currentUserId,
        content,
      };
      
      const newMessage = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket
      console.log('📨 Broadcasting message via WebSocket:', newMessage.id);
      wsManager.notifyNewMessage(matchId, newMessage);
      
      res.json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Conversations routes
  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Nearby users routes
  app.get("/api/nearby", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const maxDistance = parseInt(req.query.distance as string) || 50;
      const nearbyUsers = await storage.getNearbyUsers(currentUserId, maxDistance);
      res.json(nearbyUsers);
    } catch (error) {
      console.error("Error fetching nearby users:", error);
      res.status(500).json({ error: "Failed to fetch nearby users" });
    }
  });

  // Super likes routes
  app.get("/api/super-likes", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const count = await storage.getSuperLikesCount(currentUserId);
      res.json({ count, dailyLimit: 5, remaining: Math.max(0, 5 - count) });
    } catch (error) {
      console.error("Error fetching super likes:", error);
      res.status(500).json({ error: "Failed to fetch super likes" });
    }
  });

  // Boost routes
  app.get("/api/boost", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id || 1; // Get from session
      const boostStats = await storage.getBoostStats(currentUserId);
      res.json(boostStats);
    } catch (error) {
      console.error("Error fetching boost stats:", error);
      res.status(500).json({ error: "Failed to fetch boost stats" });
    }
  });

  // Profile routes
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      console.log("🔵 Fetching profile for user ID:", userId);
      const profile = await storage.getProfile(userId);
      if (profile) {
        console.log("🔵 ✅ Profile found:", profile.name);
        res.json(profile);
      } else {
        console.log("🔴 Profile not found for user:", userId);
        res.status(404).json({ message: "Profile not found" });
      }
    } catch (error) {
      console.error("🔴 Error getting profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile detail route (alias for compatibility)
  app.get("/api/profile/:profileId", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      
      // Validar se profileId é um número válido
      if (isNaN(profileId)) {
        console.log("🔴 Invalid profile ID:", req.params.profileId);
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      console.log("🔵 Fetching profile detail for ID:", profileId);
      const profile = await storage.getProfile(profileId);
      if (profile) {
        console.log("🔵 ✅ Profile found:", profile.name);
        res.json(profile);
      } else {
        console.log("🔴 Profile not found for ID:", profileId);
        res.status(404).json({ message: "Profile not found" });
      }
    } catch (error) {
      console.error("🔴 Error getting profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stripe payment routes for subscriptions
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Stripe not configured. Please add STRIPE_SECRET_KEY to Replit Secrets." 
      });
    }
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "brl", // Real brasileiro
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Setup real Stripe products (Admin only)
  app.post('/api/admin/setup-stripe', async (req, res) => {
    try {
      console.log("🔵 Setting up real Stripe products...");
      const result = await createStripeProducts();
      res.json({
        success: true,
        message: "Stripe products created successfully",
        priceIds: result
      });
    } catch (error: any) {
      console.error("Error setting up Stripe:", error);
      res.status(500).json({ 
        error: error.message || "Failed to setup Stripe products" 
      });
    }
  });

  // Get subscription plans
  app.get('/api/subscription-plans', async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });

  // Create subscription (real Stripe integration)
  app.post('/api/create-subscription', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        error: "Stripe not configured. Please add STRIPE_SECRET_KEY to Replit Secrets." 
      });
    }
    try {
      const { planId, userId } = req.body;
      
      if (!planId || !userId) {
        return res.status(400).json({ error: "Plan ID and User ID are required" });
      }

      console.log(`🔵 Creating real subscription for user ${userId}, plan ${planId}`);
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get plan data
      const plans = await storage.getSubscriptionPlans();
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      let customerId = user.stripeCustomerId;

      // Create Stripe customer if needed
      if (!customerId) {
        console.log("🔵 Creating Stripe customer");
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          metadata: { userId: user.id.toString() }
        });
        customerId = customer.id;
        
        // Update user with customer ID
        await storage.updateUserStripeInfo(userId, { customerId });
      }

      // Create Stripe subscription with PIX and card support
      console.log("🔵 Creating Stripe subscription with price:", plan.stripePriceId);
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card', 'boleto'] // Enable card and boleto for Brazil
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Save subscription to database
      const dbSubscription = await storage.createSubscription({
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        status: subscription.status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false
      });

      // Update user subscription type
      await storage.updateUserStripeInfo(userId, { 
        customerId, 
        subscriptionId: subscription.id 
      });

      const latestInvoice = subscription.latest_invoice as any;
      const paymentIntent = latestInvoice?.payment_intent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        status: subscription.status
      });

    } catch (error: any) {
      console.error("🔴 Error creating subscription:", error);
      res.status(400).json({ 
        error: { 
          message: error.message || "Erro ao criar assinatura" 
        } 
      });
    }
  });

  // Get subscription status
  app.get('/api/subscription-status/:userId', async (req, res) => {
    if (!stripe) {
      return res.json({ 
        status: 'none', 
        subscriptionType: 'free',
        plan: null 
      });
    }
    try {
      const userId = parseInt(req.params.userId);
      const subscription = await storage.getUserSubscription(userId);
      
      if (!subscription) {
        return res.json({ 
          status: 'none', 
          subscriptionType: 'free',
          plan: null 
        });
      }

      // Get latest status from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      
      // Update local subscription if status changed
      if (stripeSubscription.status !== subscription.status) {
        await storage.updateSubscription(subscription.stripeSubscriptionId, {
          status: stripeSubscription.status,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }

      const plans = await storage.getSubscriptionPlans();
      const plan = plans.find(p => p.id === subscription.planId);

      res.json({
        status: stripeSubscription.status,
        subscriptionType: stripeSubscription.status === 'active' ? plan?.name.toLowerCase() : 'free',
        currentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
        plan
      });

    } catch (error) {
      console.error("Error getting subscription status:", error);
      res.status(500).json({ error: "Failed to get subscription status" });
    }
  });

  // Cancel subscription
  app.post('/api/cancel-subscription', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        error: { message: "Stripe not configured. Please add STRIPE_SECRET_KEY to Replit Secrets." } 
      });
    }
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const subscription = await storage.getUserSubscription(userId);
      if (!subscription) {
        return res.status(404).json({ error: "No active subscription found" });
      }

      // Cancel subscription in Stripe
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );

      // Update local subscription
      await storage.updateSubscription(subscription.stripeSubscriptionId, {
        status: stripeSubscription.status,
        cancelAtPeriodEnd: true
      });

      res.json({ 
        success: true, 
        message: 'Assinatura será cancelada ao final do período',
        subscription: stripeSubscription 
      });
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      res.status(400).json({ error: { message: error.message } });
    }
  });

  // Check-in routes
  app.post('/api/check-in', async (req, res) => {
    try {
      const { userId, establishmentName, establishmentType, city, address, latitude, longitude, qrCodeData, checkInMethod } = req.body;
      
      if (!userId || !establishmentName || !checkInMethod) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Deactivate previous check-ins
      await storage.deactivateUserCheckIns(userId);

      // Create new check-in with expiration (4 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 4);

      const checkIn = await storage.createCheckIn({
        userId,
        establishmentName,
        establishmentType,
        city: city || "São Paulo",
        address,
        latitude,
        longitude,
        qrCodeData,
        checkInMethod,
        isActive: true,
        expiresAt
      });

      // Get users at the same location
      const usersAtLocation = await storage.getUsersAtLocation(establishmentName);

      res.json({
        success: true,
        checkIn,
        usersAtLocation: usersAtLocation.length
      });
    } catch (error: any) {
      console.error("Error creating check-in:", error);
      res.status(500).json({ error: error.message || "Failed to create check-in" });
    }
  });

  app.get('/api/check-in/active/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activeCheckIn = await storage.getUserActiveCheckIn(userId);
      
      if (!activeCheckIn) {
        return res.json({ hasActiveCheckIn: false });
      }

      const usersAtLocation = await storage.getUsersAtLocation(activeCheckIn.establishmentName);

      res.json({
        hasActiveCheckIn: true,
        checkIn: activeCheckIn,
        usersAtLocation: usersAtLocation.length
      });
    } catch (error: any) {
      console.error("Error getting active check-in:", error);
      res.status(500).json({ error: "Failed to get active check-in" });
    }
  });

  app.get('/api/check-in/history/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 20;
      
      const history = await storage.getUserCheckInHistory(userId, limit);
      res.json(history);
    } catch (error: any) {
      console.error("Error getting check-in history:", error);
      res.status(500).json({ error: "Failed to get check-in history" });
    }
  });

  app.delete('/api/check-in/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.deactivateUserCheckIns(userId);
      res.json({ success: true, message: "Check-in deactivated" });
    } catch (error: any) {
      console.error("Error deactivating check-in:", error);
      res.status(500).json({ error: "Failed to deactivate check-in" });
    }
  });

  // Establishment routes
  app.get('/api/establishments', async (req, res) => {
    try {
      const city = req.query.city as string;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const establishments = await storage.getEstablishments(city, limit);
      res.json(establishments);
    } catch (error: any) {
      console.error("Error getting establishments:", error);
      res.status(500).json({ error: "Failed to get establishments" });
    }
  });

  app.get('/api/establishments/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const establishment = await storage.getEstablishmentById(id);
      
      if (!establishment) {
        return res.status(404).json({ error: "Establishment not found" });
      }

      res.json(establishment);
    } catch (error: any) {
      console.error("Error getting establishment:", error);
      res.status(500).json({ error: "Failed to get establishment" });
    }
  });

  app.post('/api/establishments', async (req, res) => {
    try {
      const establishment = await storage.createEstablishment(req.body);
      res.json(establishment);
    } catch (error: any) {
      console.error("Error creating establishment:", error);
      res.status(500).json({ error: "Failed to create establishment" });
    }
  });

  app.get('/api/establishments/nearby', async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const radiusKm = parseInt(radius as string) || 5;
      const establishments = await storage.getNearbyEstablishments(
        latitude as string,
        longitude as string,
        radiusKm
      );

      res.json(establishments);
    } catch (error: any) {
      console.error("Error getting nearby establishments:", error);
      res.status(500).json({ error: "Failed to get nearby establishments" });
    }
  });

  // Profile views endpoint
  app.get("/api/profile/views", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      if (!currentUserId) {
        return res.status(401).json({ error: "Não autenticado" });
      }
      const views = await storage.getProfileViewsCount(currentUserId);
      res.json({ views });
    } catch (error) {
      console.error("Error fetching profile views:", error);
      res.status(500).json({ error: "Failed to fetch profile views" });
    }
  });

  // Verification status endpoint
  app.get("/api/verification/status", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      if (!currentUserId) {
        return res.status(401).json({ error: "Não autenticado" });
      }
      const verification = await storage.getVerificationStatus(currentUserId);
      res.json(verification);
    } catch (error) {
      console.error("Error fetching verification status:", error);
      res.status(500).json({ error: "Failed to fetch verification status" });
    }
  });

  // Request verification endpoint
  app.post("/api/verification/request", async (req, res) => {
    try {
      const currentUserId = (req.user as any)?.id;
      if (!currentUserId) {
        return res.status(401).json({ error: "Não autenticado" });
      }
      const { method, images } = req.body;
      const verification = await storage.requestVerification(currentUserId, method, images || []);
      res.json(verification);
    } catch (error) {
      console.error("Error requesting verification:", error);
      res.status(500).json({ error: "Failed to request verification" });
    }
  });

  // Placeholder image route - Generate SVG images instead of HTML
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const w = parseInt(width) || 400;
    const h = parseInt(height) || 300;
    
    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2563eb"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dy=".3em">
        ${w} × ${h}
      </text>
    </svg>`;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(svg);
  });

  // Register admin routes
  registerAdminRoutes(app);
  
  return httpServer;
}
