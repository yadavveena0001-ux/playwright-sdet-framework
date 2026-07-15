#!/bin/bash
# One-command setup: installs dependencies, browsers, and creates the env file.
# Run this once: bash setup.sh   (or: chmod +x setup.sh && ./setup.sh)

set -e

echo "Step 1/3: Installing npm dependencies..."
npm install

echo "Step 2/3: Installing Playwright browsers (Chromium, Firefox, WebKit)..."
npx playwright install --with-deps

echo "Step 3/3: Setting up environment file..."
if [ ! -f .env.staging ]; then
  cp .env.staging.example .env.staging
  echo "Created .env.staging"
else
  echo ".env.staging already exists, skipping"
fi

echo ""
echo "Setup complete! Now run:"
echo "  npm run test:smoke     -> quick check"
echo "  npm test                -> full suite"
echo "  npm run report          -> view results in browser"
