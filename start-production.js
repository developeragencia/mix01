// Production startup script for Replit deployment
import { spawn } from 'child_process';

console.log('🚀 Starting Mix App Digital in production mode...');

// Set production environment
process.env.NODE_ENV = 'production';

// Start the server with proper error handling
const serverProcess = spawn('node', ['dist/index.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', PORT: process.env.PORT || '5000' }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server process:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});