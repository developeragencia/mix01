import passport from "passport";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PgSession = connectPgSimple(session);

import type { Express } from "express";
import { storage } from "./storage";
import { OAuthStorage } from "./oauth-storage";
import type { User } from "@shared/schema";

export function setupAuth(app: Express) {
  // Always trust proxy in all environments (Replit uses proxies)
  app.set('trust proxy', 1);
  console.log('🔧 Trust proxy enabled');
  
  // ✅ CORREÇÃO CRÍTICA: Configuração dinâmica de cookies para desenvolvimento vs produção
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1' || 
                       process.env.NODE_ENV === 'production';
  
  // ✅ DETECTAR SE ESTAMOS EM IFRAME (Replit webview)
  const isInIframe = process.env.REPL_ID !== undefined;
  
  const cookieConfig = (isProduction || isInIframe) ? {
    // PRODUÇÃO ou IFRAME: Configuração CHIPS para iframe
    secure: true, // ✅ NECESSÁRIO para sameSite: none (Replit usa HTTPS)
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none' as const, // ✅ NECESSÁRIO para iframe
    path: '/',
    partitioned: true, // ✅ CHIPS - necessário para Chrome em iframe
  } : {
    // DESENVOLVIMENTO PURO (fora de Replit): Configuração padrão
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax' as const,
    path: '/',
  };
  
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'dev-session-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: cookieConfig as any,
    name: 'mix.sid',
    proxy: true
  }));
  
  console.log(`🔧 Session configured (${isProduction ? 'PRODUCTION' : isInIframe ? 'REPLIT_IFRAME' : 'DEVELOPMENT'}):`, {
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    partitioned: (cookieConfig as any).partitioned || false,
    proxy: true,
    isInIframe,
    replId: process.env.REPL_ID || 'none'
  });

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (userId: any, done) => {
    try {
      const user = await storage.getUser(Number(userId));
      if (user) {
        done(null, user);
      } else {
        done(null, null);
      }
    } catch (error) {
      console.error("🔴 Deserialization error:", error);
      done(error, null);
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}