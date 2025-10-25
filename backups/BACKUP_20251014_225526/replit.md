# MIX Dating App - Replit Guide

## Overview
MIX is a modern dating application designed to provide a comprehensive platform with features such as user profiles, swiping mechanics, real-time messaging, and administrative functionalities. The project aims to deliver a seamless and engaging dating experience, leveraging modern web technologies to ensure scalability and a rich user interface.

## User Preferences
Preferred communication style: Simple, everyday language.
Domain security: Production access restricted to https://mixapp.digital/ only
Development timeline: Alterações Finais phase from 04/08/2025 to 02/09/2025 (20 business days)
Design preference: Clean, professional interface with zero visual effects or animations

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite for fast development and optimized builds
- **UI/UX Design**: Responsive design with a mobile-first approach, featuring gradient backgrounds, smooth animations, transitions, and card-based layouts. Integrates PWA capabilities for an installable app experience and push notifications.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with Google OAuth2 and Facebook strategies, supporting traditional email/password.
- **Real-time**: WebSocket support for live messaging.
- **Session Management**: Express sessions with secure configuration.

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect.
- **Schema Location**: `shared/schema.ts` for type-safe database operations.
- **Tables**: Users, profiles, swipes, matches, messages with proper relationships.
- **Migrations**: Managed through Drizzle Kit.

### Core Features
- **User Authentication**: Multi-provider OAuth and traditional email/password.
- **Profile Management**: Comprehensive user profiles with photos, bio, interests, and preferences.
- **Discovery System**: Location-based matching with swipe mechanics.
- **Messaging**: Real-time chat between matched users.
- **Admin Dashboard**: Complete administrative interface for user and content management.
- **PWA Capabilities**: Service worker registration, installable app experience, push notifications support, and mobile-optimized interface.
- **Payment System**: Integrated Stripe for real payment processing.
- **Development Status Page**: Project timeline tracking with domain security restrictions.

### Recent Updates (October 2025)
- **Discover Page Production-Ready**: Integrated real database profiles with Unsplash photos, proper end-of-list handling, and full interactivity
- **Database Profiles**: Created 6 real user profiles with authentic photos and information for production testing
- **UI/UX Improvements**: Added data-testid attributes to all interactive elements for testing, proper image fallback handling
- **End-of-List Handling**: Implemented graceful "no more profiles" screen instead of placeholder content

### Previous Updates (January 2025)
- **Domain Security**: Implemented production access restriction to mixapp.digital only
- **Timeline Finalization**: Added specific dates for alterations phase (04/08/2025 - 02/09/2025)
- **Layout Optimization**: Enhanced responsive grid design with improved text alignment and spacing
- **Visual Consistency**: Maintained clean blue and white design theme throughout application

## External Dependencies

### Frontend Dependencies
- React ecosystem (`@tanstack/react-query`, `wouter`, `@radix-ui`)
- Styling (`tailwindcss`, `class-variance-authority`)
- Form handling (`react-hook-form`, `zod`)
- Maps integration (`@googlemaps/js-api-loader`)

### Backend Dependencies
- Database (`@neondatabase/serverless`, `drizzle-orm`)
- Authentication (`passport`, `bcrypt`)
- Email service (`@sendgrid/mail`)
- WebSocket (`ws`)
- Session management (`express-session`)

### Development Tools
- TypeScript
- Vite
- ESBuild
- Drizzle Kit