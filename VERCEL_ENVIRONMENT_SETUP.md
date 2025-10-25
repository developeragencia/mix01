# MIX App - Environment Variables Configuration

## Required Environment Variables for Vercel Deployment

### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```
- **Description**: PostgreSQL connection string for your database
- **Example**: `postgresql://user:pass@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb`

### Session Configuration
```bash
SESSION_SECRET=your-super-secret-session-key-here
```
- **Description**: Secret key for session encryption
- **Example**: `mix-app-session-secret-2024-very-long-random-string`

### Google OAuth Configuration
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
- **Description**: Google OAuth 2.0 credentials
- **How to get**: Google Cloud Console > APIs & Services > Credentials

## Optional Environment Variables

### Stripe Configuration (for payments)
```bash
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### App Configuration
```bash
NODE_ENV=production
PORT=3000
```

### CORS Origins
```bash
ALLOWED_ORIGINS=https://mixvercell1.vercel.app,https://mixapp.digital
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with its value
5. Make sure to set them for "Production", "Preview", and "Development" environments

## Database Setup Instructions

### Option 1: Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set as `DATABASE_URL` in Vercel

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Set as `DATABASE_URL` in Vercel

### Option 3: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Copy the connection string
4. Set as `DATABASE_URL` in Vercel

## Database Migration

After setting up your database, run the migration script:

```sql
-- Run the contents of database-migration.sql in your database
-- This will create all necessary tables and indexes
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set authorized origins:
   - `https://mixvercell1.vercel.app`
   - `https://mixvercell1-git-main.vercel.app`
6. Set redirect URIs:
   - `https://mixvercell1.vercel.app/api/auth/google/callback`
7. Copy Client ID and Client Secret to Vercel environment variables

## Testing the Setup

After deployment, test these endpoints:

- `GET /api/health` - Should return server status
- `GET /api/test` - Should return "API funcionando!"
- `POST /api/auth/register` - Test user registration
- `POST /api/auth/login` - Test user login

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible from Vercel
   - Check SSL requirements

2. **Google OAuth Error**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Check authorized origins in Google Console
   - Ensure OAuth consent screen is configured

3. **Session Issues**
   - Verify SESSION_SECRET is set
   - Check cookie settings for production
   - Ensure CORS is properly configured

4. **Build Errors**
   - Check all dependencies are in package.json
   - Verify TypeScript compilation
   - Check for missing environment variables

## Security Notes

- Never commit `.env` files to version control
- Use strong, random SESSION_SECRET
- Regularly rotate API keys
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs
