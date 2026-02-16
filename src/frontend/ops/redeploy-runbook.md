# ForexPro Redeploy Runbook

## Purpose
This runbook describes how to trigger a fresh rebuild and redeploy of the ForexPro application when a build/session has expired, without requiring any application code changes.

## Prechecks

### Symptoms of Build/Session Expiration
- Application shows "draft app has expired" message
- Routes return 404 or fail to load
- Deployment URLs are no longer accessible
- Build artifacts are missing or stale

### Verification Steps
1. Check if the landing page (/) loads
2. Verify if authenticated routes (/trading, /wallet, /admin) are accessible
3. Confirm Internet Identity login flow works
4. Test backend canister connectivity

## Redeploy Process

### Step 1: Trigger Rebuild
The rebuild process is initiated automatically when the user requests "rebuild it" or similar commands. The system will:
- Use the existing codebase without modifications
- Recompile frontend and backend
- Generate fresh deployment artifacts
- Deploy to the Internet Computer network

### Step 2: Verify Deployment
After the rebuild completes:
1. Access the landing page at the root URL (/)
2. Verify the page loads without errors (not a "Not Found" page)
3. Check browser console for any runtime errors
4. Confirm all static assets load correctly (logo, images)
5. Hard refresh (Ctrl+Shift+R) and verify the app still loads

### Step 3: Test Core Routes
Navigate to each main route and verify:
- `/` - Landing page with hero section and features
- `/trading` - Trading page (requires authentication)
- `/wallet` - Wallet page (requires authentication)
- `/admin` - Admin dashboard (requires admin role)

### Step 4: Verify Authentication
1. Click "Login" button in header
2. Complete Internet Identity flow
3. Verify profile setup dialog appears for new users
4. Confirm authenticated navigation works

## Post-Deploy Validation

### Critical Checks
- [ ] Landing page renders correctly at root URL (/)
- [ ] Hard refresh on root URL continues to load the app (no "Not Found")
- [ ] All static assets (logo, images) load correctly
- [ ] Internet Identity login completes successfully
- [ ] Profile setup dialog appears for first-time users
- [ ] Trading page loads and displays balance
- [ ] Wallet page shows M-Pesa instructions
- [ ] Admin page accessible for admin users
- [ ] No console errors or warnings

### Backend Connectivity
- [ ] Backend canister responds to queries
- [ ] User profile can be fetched
- [ ] Balance queries return data
- [ ] M-Pesa number query works

### Deep Link & Refresh Tests
- [ ] Copy app link button works
- [ ] Copied links use hash-based routing format (#/route)
- [ ] Direct links to /trading, /wallet, /admin load correctly
- [ ] Hard refresh on any route continues to work
- [ ] Browser back/forward navigation works

## Rollback Procedure
If the redeploy fails or introduces issues:
1. Check deployment logs for errors
2. Verify backend canister is running
3. Confirm frontend build completed successfully
4. Review any error messages in browser console
5. If needed, trigger another rebuild with the same codebase

## Common Issues

### Issue: Routes return 404 or "Not Found"
**Solution**: 
- Verify all asset paths use relative paths (./assets/...) not absolute (/assets/...)
- Confirm hash-based routing is configured correctly in App.tsx
- Check that index.html uses relative paths for favicon and script tags
- Ensure NotFoundPage is wired into the router for unknown routes

### Issue: Authentication fails
**Solution**: Check Internet Identity integration in useInternetIdentity hook and verify canister IDs are correct.

### Issue: Backend calls fail
**Solution**: Verify actor initialization in useActor hook and confirm backend canister is deployed and running.

### Issue: Assets not loading
**Solution**: 
- Check that static assets use relative paths (./assets/generated/) not absolute paths
- Verify assets are in the correct directories
- Confirm build process includes assets in output

### Issue: Hard refresh shows "Not Found"
**Solution**: 
- Verify hash-based routing is used (createHashHistory in App.tsx)
- Confirm all asset references use relative paths
- Check that the canister serves index.html for all routes

## Support Contacts
For deployment issues, refer to:
- Caffeine.ai platform documentation
- Internet Computer developer resources
- Project repository issues

## Notes
- This runbook assumes no code changes are required
- All application functionality should work identically after redeploy
- Session expiration only affects deployment availability, not code integrity
- The rebuild process preserves all existing features and data structures
- Hash-based routing ensures canister-safe navigation
- Relative asset paths ensure correct loading in canister context
