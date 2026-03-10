#!/bin/bash
# ByteCart EC2 Setup Script
# Run this after SSHing into your EC2 instance

set -e  # Exit on any error

echo "=== ByteCart EC2 Setup ==="

# 1. Update system
echo "[1/6] Updating system packages..."
sudo apt update -y

# 2. Install Node.js 20
echo "[2/6] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# 3. Install git (usually pre-installed on Ubuntu)
sudo apt install -y git

# 4. Clone the repository
echo "[3/6] Cloning repository..."
git clone https://github.com/saulatbukhari1040-lgtm/bytecart_ecommerce_web.git bytecart
cd bytecart

# 5. Install dependencies
echo "[4/6] Installing dependencies..."
npm install

# 6. Set environment variables (EDIT THESE IF NEEDED)
echo "[5/6] Setting environment variables..."
export DATABASE_URL="postgresql://postgres:bytecartdb123@bytecart-db.crmgyieyoukd.eu-north-1.rds.amazonaws.com:5432/postgres?schema=public"
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_cHJvdmVuLW11bGxldC03OS5jbGVyay5hY2NvdW50cy5kZXYk"
export CLERK_SECRET_KEY="sk_test_8YPuvR9oHAY5og2S3k55kjq2vve0iZ1Gy1w204DTO3"
export NEXT_PUBLIC_APP_URL="http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
export NODE_ENV="production"

# 7. Build the application
echo "[6/6] Building application..."
npm run build

echo ""
echo "=== Setup Complete! ==="
echo "Starting ByteCart on port 80..."
echo "Your site will be at: $NEXT_PUBLIC_APP_URL"
echo ""

# Start the app on port 80
sudo -E npm run start -- -p 80
