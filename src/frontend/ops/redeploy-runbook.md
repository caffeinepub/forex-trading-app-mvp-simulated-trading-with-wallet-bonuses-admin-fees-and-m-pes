# ForexPro Redeploy Runbook

## Purpose
This runbook provides a repeatable, no-product-change procedure to trigger a fresh rebuild and redeploy of the ForexPro application to the Internet Computer canister infrastructure.

## Prerequisites
- DFX CLI installed and configured
- Node.js and pnpm installed
- Access to the project repository
- Internet connection for canister deployment

## Preflight Checklist

Before initiating a redeploy, verify the following canister-safe requirements:

### 1. Hash-Based Routing
- ✅ App uses `createHashHistory()` from TanStack Router
- ✅ All routes are prefixed with `#` (e.g., `/#/trading`, `/#/wallet`)
- ✅ Deep links work after hard refresh

### 2. Relative Asset Paths
- ✅ `index.html` uses relative paths (`./assets/...`, `./src/...`)
- ✅ No absolute paths starting with `/` (except for root `/`)
- ✅ Static assets load correctly from canister subdirectories

### 3. Root Route Configuration
- ✅ Root route (`/`) is properly defined and renders content
- ✅ Landing page loads without requiring hash navigation
- ✅ No blank screens on initial load

## Redeploy Procedure

### Step 1: Clean Build Environment
