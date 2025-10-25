// API Routes for Authentication
import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../server/db.js';
import { users, profiles } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth login
router.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Credential is required' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    const { email, name, picture, sub } = payload;

    // Check if user exists
    let user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) {
      // Create new user
      const [newUser] = await db.insert(users).values({
        username: email.split('@')[0] + '_' + Date.now(),
        email: email,
        password: '',
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        profileImage: picture || '',
        isOnline: true,
        lastSeen: new Date(),
      }).returning();

      // Create profile
      await db.insert(profiles).values({
        userId: newUser.id,
        name: name || '',
        age: 25,
        bio: '',
        photos: picture ? [picture] : [],
        isActive: true,
      });

      user = [newUser];
    } else {
      // Update last seen
      await db.update(users)
        .set({ 
          isOnline: true, 
          lastSeen: new Date(),
          profileImage: picture || user[0].profileImage 
        })
        .where(eq(users.id, user[0].id));
    }

    // Set session
    req.session.userId = user[0].id;
    req.session.isAuthenticated = true;

    // Check if profile is complete
    const profile = await db.select().from(profiles).where(eq(profiles.userId, user[0].id)).limit(1);
    const isProfileComplete = profile.length > 0 && profile[0].name && profile[0].age > 0;

    res.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        profileImage: user[0].profileImage,
      },
      isProfileComplete
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Facebook OAuth login
router.post('/auth/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;

    if (!accessToken || !userID) {
      return res.status(400).json({ success: false, message: 'Access token and user ID are required' });
    }

    // Validate Facebook token and fetch user profile
    const fbResponse = await axios.get(`https://graph.facebook.com/v21.0/${userID}`, {
      params: {
        fields: 'id,name,email,picture.width(200).height(200)',
        access_token: accessToken
      }
    });

    const fbUser = fbResponse.data;

    if (!fbUser || !fbUser.id) {
      return res.status(400).json({ success: false, message: 'Invalid Facebook token' });
    }

    // Verify that the userID matches
    if (fbUser.id !== userID) {
      return res.status(400).json({ success: false, message: 'User ID mismatch' });
    }

    const email = fbUser.email || `facebook_${fbUser.id}@mixapp.com`;
    const name = fbUser.name || 'Facebook User';
    const picture = fbUser.picture?.data?.url || '';

    // Check if user exists by email or facebook ID
    let user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) {
      // Create new user
      const [newUser] = await db.insert(users).values({
        username: `fb_${fbUser.id}_${Date.now()}`,
        email: email,
        password: '',
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        profileImage: picture,
        isOnline: true,
        lastSeen: new Date(),
      }).returning();

      // Create profile
      await db.insert(profiles).values({
        userId: newUser.id,
        name: name,
        age: 25,
        bio: '',
        photos: picture ? [picture] : [],
        isActive: true,
      });

      user = [newUser];
    } else {
      // Update last seen and profile image
      await db.update(users)
        .set({ 
          isOnline: true, 
          lastSeen: new Date(),
          profileImage: picture || user[0].profileImage 
        })
        .where(eq(users.id, user[0].id));
    }

    // Set session
    req.session.userId = user[0].id;
    req.session.isAuthenticated = true;

    // Check if profile is complete
    const profile = await db.select().from(profiles).where(eq(profiles.userId, user[0].id)).limit(1);
    const isProfileComplete = profile.length > 0 && profile[0].name && profile[0].age > 0;

    res.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        profileImage: user[0].profileImage,
      },
      isProfileComplete
    });

  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Email/Phone login
router.post('/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/phone and password are required' });
    }

    // Find user by email or phone
    let user;
    if (identifier.includes('@')) {
      // Email login
      user = await db.select().from(users).where(eq(users.email, identifier)).limit(1);
    } else {
      // Phone login
      user = await db.select().from(users).where(eq(users.phone, identifier)).limit(1);
    }

    if (user.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last seen
    await db.update(users)
      .set({ isOnline: true, lastSeen: new Date() })
      .where(eq(users.id, user[0].id));

    // Set session
    req.session.userId = user[0].id;
    req.session.isAuthenticated = true;

    // Check if profile is complete
    const profile = await db.select().from(profiles).where(eq(profiles.userId, user[0].id)).limit(1);
    const isProfileComplete = profile.length > 0 && profile[0].name && profile[0].age > 0;

    res.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        profileImage: user[0].profileImage,
      },
      isProfileComplete
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Phone registration
router.post('/auth/phone/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Email, phone and password are required' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Check if phone already exists
    const existingPhone = await db.select().from(users)
      .where(eq(users.phone, phone))
      .limit(1);
    
    if (existingPhone.length > 0) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      username: username || email.split('@')[0] + '_' + Date.now(),
      email: email,
      phone: phone,
      password: hashedPassword,
      firstName: '',
      lastName: '',
      isOnline: true,
      lastSeen: new Date(),
    }).returning();

    // Set session
    req.session.userId = newUser.id;
    req.session.isAuthenticated = true;

    res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profileImage: newUser.profileImage,
      },
      isProfileComplete: false
    });

  } catch (error) {
    console.error('Phone registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get current user
router.get('/auth/user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
    
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if profile is complete
    const profile = await db.select().from(profiles).where(eq(profiles.userId, user[0].id)).limit(1);
    const isProfileComplete = profile.length > 0 && profile[0].name && profile[0].age > 0;

    res.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        profileImage: user[0].profileImage,
      },
      isProfileComplete
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Logout
router.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Register new user
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      username: email.split('@')[0] + '_' + Date.now(),
      email: email,
      password: hashedPassword,
      phone: phone || '',
      firstName: '',
      lastName: '',
      isOnline: true,
      lastSeen: new Date(),
    }).returning();

    // Set session
    req.session.userId = newUser.id;
    req.session.isAuthenticated = true;

    res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profileImage: newUser.profileImage,
      },
      isProfileComplete: false
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
