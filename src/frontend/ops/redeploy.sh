#!/bin/bash

# ForexPro Redeploy Script
# This script automates the clean rebuild and redeploy sequence
# Usage: ./redeploy.sh [network]
# Example: ./redeploy.sh ic

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default network
NETWORK="${1:-ic}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}ForexPro Redeploy Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Network: ${NETWORK}${NC}"
echo ""

# Step 1: Clean build environment
echo -e "${BLUE}[Step 1/6] Cleaning build environment...${NC}"
rm -rf frontend/dist
rm -rf .dfx/local/canisters
rm -rf node_modules/.vite
echo -e "${GREEN}✓ Build environment cleaned${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}[Step 2/6] Installing dependencies...${NC}"
cd frontend
pnpm install
cd ..
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Generate backend bindings
echo -e "${BLUE}[Step 3/6] Generating backend bindings...${NC}"
dfx canister create backend --network ${NETWORK} || true
dfx generate backend
echo -e "${GREEN}✓ Backend bindings generated${NC}"
echo ""

# Step 4: Build frontend
echo -e "${BLUE}[Step 4/6] Building frontend...${NC}"
cd frontend
pnpm run build:skip-bindings
cd ..
echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Step 5: Deploy canisters
echo -e "${BLUE}[Step 5/6] Deploying canisters...${NC}"
dfx deploy backend --network ${NETWORK}
dfx deploy frontend --network ${NETWORK}
echo -e "${GREEN}✓ Canisters deployed${NC}"
echo ""

# Step 6: Display deployment URL
echo -e "${BLUE}[Step 6/6] Retrieving deployment URL...${NC}"
FRONTEND_CANISTER_ID=$(dfx canister id frontend --network ${NETWORK})

if [ "${NETWORK}" = "ic" ]; then
    DEPLOYMENT_URL="https://${FRONTEND_CANISTER_ID}.ic0.app"
else
    DEPLOYMENT_URL="http://${FRONTEND_CANISTER_ID}.localhost:4943"
fi

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Deployment URL: ${DEPLOYMENT_URL}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Post-deploy verification instructions
echo -e "${YELLOW}Next Steps - Manual Verification Required:${NC}"
echo ""
echo "1. Root URL Load Test:"
echo "   - Open ${DEPLOYMENT_URL} in a new incognito window"
echo "   - Verify landing page loads without errors"
echo "   - Perform hard refresh (Ctrl+Shift+R / Cmd+Shift+R)"
echo ""
echo "2. Hash Route Deep-Link Test:"
echo "   - Test ${DEPLOYMENT_URL}/#/trading"
echo "   - Test ${DEPLOYMENT_URL}/#/wallet"
echo "   - Test ${DEPLOYMENT_URL}/#/admin"
echo "   - Perform hard refresh on each route"
echo ""
echo "3. Internet Identity Login:"
echo "   - Click Login button"
echo "   - Complete authentication flow"
echo "   - Verify successful return to app"
echo ""
echo "4. Console Error Check:"
echo "   - Open browser DevTools Console"
echo "   - Look for any red error messages"
echo "   - Verify no failed network requests"
echo ""
echo "5. Static Asset Verification:"
echo "   - Check favicon loads correctly"
echo "   - Verify app logo appears in header"
echo "   - Inspect Network tab for 404 errors"
echo ""
echo -e "${YELLOW}For complete smoke test checklist, see:${NC}"
echo "   frontend/ops/smoke-test-checklist.md"
echo ""
echo -e "${YELLOW}To document test results, use:${NC}"
echo "   frontend/ops/smoke-test-report-template.md"
echo ""
echo -e "${GREEN}Deployment script completed successfully!${NC}"
