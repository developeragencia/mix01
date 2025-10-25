// Vercel Serverless Function Entry Point
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import authRoutes from './auth.js';

const app = express();

// CORS configuration for Vercel
app.use(cors({
  origin: [
    'https://mixvercell1.vercel.app',
    'https://mixvercell1-git-main.vercel.app',
    'https://mixapp.digital',
    /https:\/\/.*\.vercel\.app$/,
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration for Vercel
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'mix.session'
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api', authRoutes);

// Basic API routes for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Serve static files from dist/public
app.use(express.static(path.join(process.cwd(), 'dist/public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true
}));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Catch-all handler for SPA routes
app.get('*', (req, res) => {
  // If it's an API route that wasn't handled, return 404
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint não encontrado' });
  }
  
  // For all other routes, serve the index.html (SPA)
  res.sendFile(path.join(process.cwd(), 'dist/public', 'index.html'));
});

// Export the app for Vercel
export default app;
