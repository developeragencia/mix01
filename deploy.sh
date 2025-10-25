#!/bin/bash

echo "🚀 MIX App Deploy Script"
echo "========================"

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set"
    exit 1
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ ERROR: STRIPE_SECRET_KEY not set"
    exit 1
fi

echo "✅ Environment variables OK"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo "📁 Frontend: $(du -sh dist/public | cut -f1)"
echo "📁 Backend: $(du -sh dist/index.js | cut -f1)"

# Test production build
echo "🧪 Testing production build..."
timeout 10s node dist/index.js &
PID=$!
sleep 3

if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Production server test passed"
    kill $PID 2>/dev/null
else
    echo "❌ Production server test failed"
    kill $PID 2>/dev/null
    exit 1
fi

echo "🎉 Deploy ready! Use 'npm start' to run in production"
echo "🌐 The app will be available on your deployed URL"