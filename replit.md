# Mix App Digital - Replit Guide

## Overview
Mix App Digital is a modern dating application designed to provide a comprehensive and engaging dating experience. It features user profiles, a swiping mechanism, real-time messaging, and administrative functionalities. The project aims to be a competitive platform in the digital dating market by prioritizing scalability, a rich user interface, and leveraging modern web technologies.

## User Preferences
Preferred communication style: Simple, everyday language.
Domain security: Production access restricted to https://mixapp.digital/ only
Development timeline: Alterações Finais phase from 04/08/2025 to 02/09/2025 (20 business days)
Design preference: Clean, professional interface with zero visual effects or animations

## System Architecture

### UI/UX Decisions
The application features a responsive, mobile-first PWA design with gradient backgrounds and card-based layouts, inspired by modern dating apps. It emphasizes a clean, professional interface, utilizing distinct gradient color schemes (e.g., blue MIX gradient `from-blue-900 via-blue-800 to-indigo-900`), rounded elements, and visual effects for key interactions. The Discover page, onboarding flow, and messaging interfaces are designed to align with Mix's aesthetic.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, Tailwind CSS with shadcn/ui for styling, React Query for state management, and Vite as the build tool. Client-side image compression is used for efficient photo uploads.
- **Backend**: Node.js with Express.js, PostgreSQL with Drizzle ORM, Passport.js for authentication (Google OAuth2, email/password), WebSocket for real-time messaging, and Express sessions for session management.
- **Database**: Drizzle ORM with PostgreSQL, using `shared/schema.ts` for type-safe operations. Key tables include Users, profiles, swipes, matches, and messages. Drizzle Kit handles migrations. Database queries are optimized using `LEFT JOIN` for performance.
- **Security**: Password hashing with bcrypt. Cache control headers ensure fresh content delivery. OAuth login flow fetches fresh user data from database after authentication to ensure correct `isProfileComplete` status before redirecting. Session cookies use Chrome CHIPS (partitioned) for iframe compatibility. Authenticated queries include `credentials: 'include'` for proper cookie transmission. Advanced error handling for Google OAuth DNS/network errors (EAI_AGAIN, ENOTFOUND, ETIMEDOUT, helium) with user-friendly error messages and automatic detection. DNS optimization with UV_THREADPOOL_SIZE=128 and Google DNS (8.8.8.8, 8.8.4.4) + Cloudflare DNS (1.1.1.1) for improved OAuth reliability. Proxy support enabled for Replit environment.
- **Photo Synchronization**: Automatic synchronization between `users.photos` array and `users.profileImage`. When photos are added, updated, or removed (onboarding or edit profile), the first photo (photos[0]) automatically becomes the profile image. If all photos are removed, profileImage is cleared. This ensures consistency across all pages (profile, edit profile, discover). Implementation in three backend routes: PATCH /api/user/update, PATCH /api/profiles/:userId, PUT /api/profiles/:userId.

### Feature Specifications
- **User Authentication**: Supports **3 authentication methods**: Google OAuth, Facebook OAuth, and phone-based registration. Email/password authentication has been removed. Authentication flow includes three pages: `/login` (3 tabs: Google/Facebook/Telefone + "Cadastre-se" link), `/register` (3 tabs: Google/Facebook/Telefone + "Entrar" link), and `/phone-auth` (phone registration form with email, phone, password fields and "Voltar" button). Google OAuth uses popup-based authentication with @react-oauth/google GoogleLogin component and JWT credential validation - no redirect URIs needed. Facebook OAuth uses @greatsumini/react-facebook-login with access token validation via Facebook Graph API. Backend validates tokens using google-auth-library.verifyIdToken() for Google and axios requests to Facebook Graph API for Facebook, preventing token forgery. Auto-login and persistent sessions are implemented using Chrome CHIPS for session cookies. Username is automatically generated from email. Default URL routing: Welcome flow → Terms → `/login` (primary entry point).

#### **Google OAuth Configuration**
⚠️ **CRÍTICO - OBRIGATÓRIO PARA PRODUÇÃO**: Para fazer login/cadastro com Google funcionar em **https://mixapp.digital**, você **DEVE** configurar:

### **PASSO A PASSO EXATO (OBRIGATÓRIO):**

1. **Acesse**: [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

2. **Clique** na credencial OAuth 2.0:
   - Client ID: `853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com`

3. **Em "Origens JavaScript autorizadas" (Authorized JavaScript origins), ADICIONE EXATAMENTE:**
   ```
   https://mixapp.digital
   ```
   ⚠️ **ATENÇÃO**: 
   - Use **HTTPS** (não HTTP)
   - **NÃO** adicione barra no final (`/`)
   - **NÃO** adicione paths (`/register`, `/login`, etc)
   - Formato correto: `https://mixapp.digital`

4. **TAMBÉM adicione o domínio de desenvolvimento (se quiser testar no Replit):**
   ```
   https://691a6e09-1d81-4028-ab66-5583a14ba75b-00-1m4ir1sblui66.spock.replit.dev
   ```

5. **NÃO precisa** adicionar nada em "URIs de redirecionamento" (não é usado)

6. **Clique em "SALVAR"** no topo da página

7. **AGUARDE 5-10 MINUTOS** - As mudanças do Google levam tempo para propagar

8. **Limpe o cache do navegador**:
   - Chrome: F12 → Aba "Application" → "Clear storage" → "Clear site data"
   - Ou: Ctrl+Shift+Delete → "Cached images and files"

9. **Teste o login** em: https://mixapp.digital/login

### **❌ Erros Comuns:**
- **"Erro ao validar credencial do Google"** = Domínio não está nas origens autorizadas
- **"origin_mismatch"** = Domínio não bate exatamente com o registrado
- **Mudanças não funcionam** = Aguarde 10 minutos + limpe cache

💡 **Dica**: Se mudar o domínio do Replit, atualize a origem autorizada.

#### **Facebook OAuth Configuration**
⚠️ **OBRIGATÓRIO PARA FACEBOOK LOGIN**: Para fazer login/cadastro com Facebook funcionar, você **DEVE** configurar:

### **PASSO A PASSO EXATO:**

1. **Acesse**: [Facebook Developers - Meus Apps](https://developers.facebook.com/apps/)

2. **Crie um novo app** ou selecione um app existente

3. **Configure as credenciais**:
   - Copie o **App ID** (será usado como `VITE_FACEBOOK_APP_ID`)
   - Exemplo: `123456789012345`

4. **Em "Settings" → "Basic"**:
   - **App Domains**: Adicione seu domínio sem https://
     ```
     mixapp.digital
     ```

5. **Em "Facebook Login" → "Settings"**:
   - **Valid OAuth Redirect URIs**: Adicione seus domínios completos
     ```
     https://mixapp.digital
     https://691a6e09-1d81-4028-ab66-5583a14ba75b-00-1m4ir1sblui66.spock.replit.dev
     ```

6. **Configure a variável de ambiente**:
   - No Replit: Adicione `VITE_FACEBOOK_APP_ID` com o App ID
   - Em produção: Configure a mesma variável no seu servidor

7. **Salve as alterações**

8. **Mude o app para modo "Live"** (Production) quando estiver pronto

### **❌ Erros Comuns:**
- **"Facebook App ID não configurado"** = Variável VITE_FACEBOOK_APP_ID não está definida
- **"Can't Load URL"** = Domínio não está nos Valid OAuth Redirect URIs
- **"App Not Setup"** = App ainda está em modo Development

💡 **Dica**: Facebook requer verificação do domínio e revisão do app para apps em produção.

- **Profile Management**: Comprehensive user profiles with up to 9 photos, bio, interests, preferences, and 13 additional fields.
- **Discovery System**: Location-based matching with Mix-style swipe mechanics (Rewind, X, Super Like, Like, Boost) and a photo carousel.
- **Match Celebration**: Tinder-style "IT'S A MATCH" celebration page with green gradient background, overlapping circular photos, message input field with emojis (👋 😊 ❤️ 😍), and direct messaging integration. Users can send first message or continue swiping.
- **Real-time Messaging**: Enabled via WebSocket.
- **Admin Dashboard**: Functionality for user and content management.
- **PWA Capabilities**: Installable app and push notifications support.
- **Payment System**: Stripe integration for premium features.
- **Premium Features**: Super Like, Boost, Rewind with database persistence.
- **Verification System**: Profile verification badges.
- **Onboarding Flow**: A unified, multi-step (13 screens) onboarding process for all authentication methods, covering personal details, preferences, interests, and photo uploads with robust validation. `isProfileComplete` checks `birthDate`, `gender`, at least 2 photos, and at least 1 `interestedIn` item.
- **Location Features**: Redesigned location page with check-in, nearby people, and QR code premium options, utilizing Google Maps JavaScript API for interactive maps and geolocalization.
- **Splash Screen**: Animated splash screen for initial loading, transitioning to the welcome page.

## External Dependencies

### Frontend
- `@tanstack/react-query`: Data fetching and state management.
- `wouter`: Client-side routing.
- `@radix-ui/react-*`: UI components.
- `tailwindcss`: CSS framework.
- `class-variance-authority`: Conditional styling.
- `react-hook-form`: Form management and validation.
- `zod`: Schema declaration and validation.
- `@googlemaps/js-api-loader`: Google Maps API integration.
- `framer-motion`: Animation library (used for specific effects like location page).
- `@react-oauth/google`: Google OAuth integration with popup-based authentication.
- `@greatsumini/react-facebook-login`: Facebook OAuth integration with access token validation.

### Backend
- `@neondatabase/serverless`: Serverless PostgreSQL client.
- `drizzle-orm`: TypeScript ORM.
- `passport`, `passport-google-oauth20`, `passport-local`: Authentication middleware.
- `bcrypt`: Password hashing.
- `@sendgrid/mail`: Email sending service.
- `ws`: WebSocket implementation.
- `express-session`: Session management.
- `stripe`: Payment processing.
- `axios`: HTTP client for Facebook Graph API token validation.

## Deployment

### Production Deployment Platforms
The application is configured for deployment on **Railway** and **Render** (October 24, 2025):
- ✅ All Vercel/Netlify configurations removed
- ✅ `railway.toml` created with Railway-specific configuration
- ✅ `render.yaml` created with Render Blueprint configuration
- ✅ `Procfile` updated for production deployment
- ✅ Health check endpoint added at `/api/health`
- ✅ Comprehensive deployment guide in `DEPLOYMENT_GUIDE.md`

### Build Configuration
- **Build Command:** `npm install && npm run build:production`
- **Start Command:** `npm run start:production`
- **Health Check:** `/api/health` endpoint returns JSON status
- **Important:** Do NOT set `NODE_ENV=production` manually - platforms handle this automatically during runtime

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random secure secret for sessions
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (optional)
- `STRIPE_SECRET_KEY`: Stripe API secret key (optional)
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (optional)

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.