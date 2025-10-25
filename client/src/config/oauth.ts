// OAuth Configuration
// This file ensures the Client IDs are always available in production

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '853566020139-jqljs5sf7didb7tc35shj73s8snldhdr.apps.googleusercontent.com';

export const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

// Export for easy debugging
if (import.meta.env.DEV) {
  console.log('🔐 Google OAuth Client ID configured:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
  console.log('🔐 Facebook App ID configured:', FACEBOOK_APP_ID ? FACEBOOK_APP_ID.substring(0, 10) + '...' : 'Not configured');
}
