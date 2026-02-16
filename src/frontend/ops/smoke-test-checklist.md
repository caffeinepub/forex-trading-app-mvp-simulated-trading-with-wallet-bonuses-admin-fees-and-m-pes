# ForexPro Smoke Test Checklist

## Purpose
This checklist provides a repeatable set of smoke tests to verify core functionality after a redeploy or rebuild of the ForexPro application.

## Pre-Test Setup
- [ ] Clear browser cache and cookies
- [ ] Open browser developer console
- [ ] Note the deployment URL
- [ ] Prepare test credentials (Internet Identity)

## Test 1: Landing Page Load
**Objective**: Verify the landing page renders correctly at root URL

### Steps
1. Navigate to the root URL (/)
2. Wait for page to fully load
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Verify page loads again without errors

### Expected Results
- [ ] Page loads without errors on first visit
- [ ] Page loads without errors after hard refresh
- [ ] No "Not Found" or 404 error displayed
- [ ] Hero section displays with "Master Forex Trading with Eugene FX" heading
- [ ] Risk disclaimer alert is visible
- [ ] Three feature cards are displayed (Simulated Trading, Wallet Management, Secure Platform)
- [ ] Hero illustration image loads correctly
- [ ] Finance icons image loads correctly
- [ ] App logo in header loads correctly
- [ ] "Get Started" or "Start Trading" button is visible
- [ ] Footer displays with Caffeine.ai attribution
- [ ] No console errors

## Test 2: Navigation and Header
**Objective**: Verify header navigation and responsive menu

### Steps
1. Check header elements
2. Test navigation links (if authenticated)
3. Test mobile menu (resize browser or use mobile device)

### Expected Results
- [ ] Eugene FX logo and name display in header
- [ ] Logo image loads correctly (no broken image)
- [ ] Login button is visible and clickable
- [ ] Share button (copy link icon) is visible in header
- [ ] Navigation links appear for authenticated users (Trading, Wallet, Admin)
- [ ] Mobile menu icon appears on small screens
- [ ] Mobile menu opens and displays navigation options
- [ ] Current route is highlighted in navigation

## Test 3: Internet Identity Sign-In
**Objective**: Verify authentication flow works correctly

### Steps
1. Click "Login" button in header
2. Complete Internet Identity authentication
3. Return to application after authentication

### Expected Results
- [ ] Login button triggers Internet Identity flow
- [ ] Internet Identity window/tab opens
- [ ] User can authenticate with existing identity or create new one
- [ ] After authentication, user returns to ForexPro
- [ ] Login button changes to "Logout" with user indicator
- [ ] Profile setup dialog appears for first-time users
- [ ] Navigation menu shows authenticated routes (Trading, Wallet)

## Test 4: Profile Setup (First-Time Users)
**Objective**: Verify profile setup dialog for new users

### Steps
1. After first login, profile setup dialog should appear
2. Enter a display name
3. Submit the form

### Expected Results
- [ ] Profile setup dialog appears automatically
- [ ] Dialog cannot be dismissed without completing setup
- [ ] Display name input field is present and functional
- [ ] "Get Started" button is enabled when name is entered
- [ ] Form submits successfully
- [ ] Success toast notification appears
- [ ] Dialog closes after successful submission
- [ ] User can now access authenticated pages

## Test 5: Trading Page Access
**Objective**: Verify trading page loads and displays correctly

### Steps
1. Navigate to /trading (click Trading in navigation)
2. Wait for page to load

### Expected Results
- [ ] Trading page loads without errors
- [ ] Balance overview card displays
- [ ] Available balance is shown (may be 0 for new users)
- [ ] Trade ticket form is visible with forex pair selector
- [ ] Open trades section is present
- [ ] Trade history tabs are visible
- [ ] Risk warning is displayed
- [ ] No console errors

## Test 6: Wallet Page and M-Pesa Number Query
**Objective**: Verify wallet page loads and M-Pesa destination number is fetched

### Steps
1. Navigate to /wallet (click Wallet in navigation)
2. Wait for page to load
3. Locate M-Pesa instructions card

### Expected Results
- [ ] Wallet page loads without errors
- [ ] Balance overview card displays
- [ ] Deposit form is visible
- [ ] Withdraw form is visible
- [ ] M-Pesa instructions card is present
- [ ] M-Pesa destination number is displayed (fetched from backend)
- [ ] Transaction history section is visible
- [ ] No console errors during M-Pesa number fetch

### Backend Query Verification
- [ ] Network tab shows successful query to `getMpesaNumber`
- [ ] M-Pesa number displays in format: "255712345678" (or configured number)
- [ ] No authentication errors in console

## Test 7: Admin Page Access (Admin Users Only)
**Objective**: Verify admin page is accessible for admin users

### Steps
1. Navigate to /admin (click Admin in navigation, if visible)
2. Wait for page to load

### Expected Results
- [ ] Admin page loads without errors (for admin users)
- [ ] Platform statistics are displayed
- [ ] Tabs for different admin functions are visible
- [ ] Deposit requests review panel is present
- [ ] Bonus management panel is accessible
- [ ] Revenue panel displays
- [ ] User directory is available
- [ ] Non-admin users see access denied or cannot access route

## Test 8: Logout Flow
**Objective**: Verify logout clears session and cache

### Steps
1. Click "Logout" button in header
2. Confirm logout action
3. Verify state after logout

### Expected Results
- [ ] Logout button triggers logout process
- [ ] User is logged out successfully
- [ ] Login button reappears in header
- [ ] Authenticated routes are no longer accessible
- [ ] Query cache is cleared
- [ ] Redirected to landing page or current page updates
- [ ] No console errors

## Test 9: Cross-Route Navigation
**Objective**: Verify navigation between routes works smoothly

### Steps
1. Navigate between different routes multiple times
2. Use both navigation menu and direct URL entry
3. Test browser back/forward buttons

### Expected Results
- [ ] All routes load correctly
- [ ] No blank screens or loading states that never resolve
- [ ] Browser back/forward buttons work correctly
- [ ] Route transitions are smooth
- [ ] Active route is highlighted in navigation
- [ ] No memory leaks or performance degradation

## Test 10: Canister Deep-Link Verification (CRITICAL)
**Objective**: Verify direct links and refresh work on canister-hosted deployment

### Steps
1. While authenticated, navigate to /trading
2. Click the "Copy app link" button (share icon in header)
3. Verify the copied URL format in clipboard
4. Open a new browser tab
5. Paste the copied URL and press Enter
6. Verify the trading page loads correctly
7. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
8. Verify the page still loads correctly after refresh
9. Repeat steps 1-8 for /wallet route
10. Repeat steps 1-8 for /admin route (if admin user)
11. Navigate to root (/) and hard refresh multiple times

### Expected Results
- [ ] Copy link button successfully copies URL to clipboard
- [ ] Copied URL includes hash-based routing format (e.g., https://example.com/#/trading)
- [ ] Pasting URL in new tab loads the correct page (not 404 or landing page)
- [ ] Trading page displays correctly from direct link
- [ ] Hard refresh on /trading does not break routing or show "Not Found"
- [ ] Wallet page displays correctly from direct link
- [ ] Hard refresh on /wallet does not break routing or show "Not Found"
- [ ] Admin page displays correctly from direct link (for admin users)
- [ ] Hard refresh on /admin does not break routing or show "Not Found"
- [ ] Root URL (/) loads landing page consistently
- [ ] Hard refresh on root (/) continues to load landing page (no "Not Found")
- [ ] All pages maintain authentication state after refresh
- [ ] No console errors related to routing or navigation
- [ ] All static assets (logo, images) load correctly after refresh

### Canister URL Format Verification
- [ ] URLs use hash-based routing: `https://<canister-id>.ic0.app/#/route`
- [ ] No server-side path routing attempted (no `/route` without `#`)
- [ ] Browser history navigation (back/forward) works correctly with hash routing
- [ ] Asset paths are relative (./assets/...) not absolute (/assets/...)

## Test 11: Unknown Route Handling
**Objective**: Verify unknown routes show proper 404 page

### Steps
1. Navigate to a non-existent route (e.g., /#/does-not-exist)
2. Verify the not found page displays
3. Click "Return to Home" button

### Expected Results
- [ ] Unknown route shows in-app "Page Not Found" screen
- [ ] Not found page displays with proper styling
- [ ] "Return to Home" button is visible and functional
- [ ] Clicking "Return to Home" navigates to landing page
- [ ] No console errors
- [ ] No blank screen or infinite loading

## Test 12: Error Handling
**Objective**: Verify error states are handled gracefully

### Steps
1. Test with network throttling or offline mode
2. Attempt actions that might fail
3. Check error messages and recovery

### Expected Results
- [ ] Network errors show appropriate messages
- [ ] Failed queries display error states
- [ ] Toast notifications appear for errors
- [ ] Application remains functional after errors
- [ ] User can retry failed actions
- [ ] No unhandled promise rejections in console

## Post-Test Verification

### Console Check
- [ ] No critical errors in browser console
- [ ] No unhandled promise rejections
- [ ] No React warnings about keys or hooks
- [ ] No CORS or network errors
- [ ] No 404 errors for assets

### Performance Check
- [ ] Page load times are acceptable (< 3 seconds)
- [ ] No excessive re-renders
- [ ] Smooth animations and transitions
- [ ] Responsive on different screen sizes

### Data Integrity
- [ ] User profile persists across sessions
- [ ] Balance data is consistent
- [ ] Transaction history displays correctly
- [ ] Admin data is accurate (for admin users)

## Test Summary
**Date**: _____________  
**Tester**: _____________  
**Deployment URL**: _____________  
**Overall Result**: ☐ Pass ☐ Fail ☐ Pass with Issues

### Issues Found
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Notes
_____________________________________________
_____________________________________________
_____________________________________________

## Sign-Off
- [ ] All critical tests passed
- [ ] Root URL (/) loads consistently without "Not Found"
- [ ] Hard refresh works on all routes
- [ ] Deep-link and refresh tests passed on canister deployment
- [ ] All static assets load correctly
- [ ] Known issues documented
- [ ] Deployment approved for production use

**Approved by**: _____________  
**Date**: _____________
