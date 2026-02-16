# ForexPro Smoke Test Checklist

## Purpose
This checklist provides a comprehensive set of manual verification steps to validate that a deployed ForexPro application is functioning correctly on the Internet Computer canister infrastructure.

## Test Environment Information

**Deployment URL:** `_______________________________`  
**Canister ID:** `_______________________________`  
**Network:** ☐ Local  ☐ IC Mainnet  
**Tester:** `_______________________________`  
**Date/Time:** `_______________________________`  
**Browser:** `_______________________________`  
**Browser Version:** `_______________________________`

---

## Test 1: Root URL Load & Hard Refresh

**Objective:** Verify the landing page loads correctly at the root URL and survives hard refresh.

**Steps:**
1. Open a new incognito/private browser window
2. Navigate to the deployment URL (root path, no hash)
3. Verify the landing page loads completely
4. Perform a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
5. Verify the page reloads without 404 or blank screen

**Expected Results:**
- Landing page displays with hero section
- "Get Started" button is visible
- App logo and branding appear correctly
- No 404 errors or blank screens
- Hard refresh reloads the same content

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 2: Static Asset Loading

**Objective:** Verify all static assets load correctly from canister storage.

**Steps:**
1. Open browser DevTools (F12)
2. Navigate to the Network tab
3. Reload the page
4. Check for any failed requests (red status codes)
5. Verify favicon appears in browser tab
6. Verify app logo appears in header

**Expected Results:**
- Favicon loads successfully (200 status)
- App logo image loads successfully (200 status)
- No 404 errors for any assets
- All images render correctly

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 3: Console Error Check

**Objective:** Verify no critical JavaScript errors occur during initial load.

**Steps:**
1. Open browser DevTools Console tab
2. Reload the page
3. Review all console messages
4. Look for red error messages
5. Check for any failed network requests

**Expected Results:**
- No critical JavaScript errors (red messages)
- No unhandled promise rejections
- No failed API calls during initial load
- Warning messages (yellow) are acceptable if non-critical

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 4: Navigation - Trading Route

**Objective:** Verify hash-based navigation to the trading page works correctly.

**Steps:**
1. From the landing page, click "Get Started" or navigate to `/#/trading`
2. Verify the trading page loads (may show login prompt if not authenticated)
3. Perform a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. Verify the trading page reloads correctly

**Expected Results:**
- Trading page loads or shows authentication required screen
- URL contains `/#/trading` hash
- Hard refresh maintains the trading page view
- No 404 errors or blank screens

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 5: Navigation - Wallet Route

**Objective:** Verify hash-based navigation to the wallet page works correctly.

**Steps:**
1. Navigate to `/#/wallet` directly in the address bar
2. Verify the wallet page loads (may show login prompt if not authenticated)
3. Perform a hard refresh
4. Verify the wallet page reloads correctly

**Expected Results:**
- Wallet page loads or shows authentication required screen
- URL contains `/#/wallet` hash
- Hard refresh maintains the wallet page view
- No 404 errors or blank screens

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 6: Navigation - Admin Route

**Objective:** Verify hash-based navigation to the admin page works correctly.

**Steps:**
1. Navigate to `/#/admin` directly in the address bar
2. Verify the admin page loads (may show login prompt or access denied)
3. Perform a hard refresh
4. Verify the admin page reloads correctly

**Expected Results:**
- Admin page loads, shows authentication required, or shows access denied
- URL contains `/#/admin` hash
- Hard refresh maintains the admin page view
- No 404 errors or blank screens

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 7: Internet Identity Login Flow

**Objective:** Verify Internet Identity authentication completes successfully.

**Steps:**
1. Navigate to the landing page
2. Click the "Login" button
3. Complete Internet Identity authentication flow
4. Verify successful return to the app
5. Check that login status changes to "Logout"

**Expected Results:**
- Internet Identity modal/window opens
- Authentication completes without errors
- User returns to the app successfully
- Login button changes to "Logout" button
- User identity is established

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 8: Profile Setup (First Login)

**Objective:** Verify profile setup dialog appears for new users.

**Steps:**
1. Complete login with a new Internet Identity
2. Verify profile setup dialog appears
3. Enter a display name
4. Submit the profile
5. Verify dialog closes and profile is saved

**Expected Results:**
- Profile setup dialog appears automatically
- Name input field is functional
- Submit button works correctly
- Dialog closes after successful submission
- User can proceed to use the app

**Pass/Fail:** ☐ Pass  ☐ Fail  ☐ N/A (existing user)  
**Notes:** `_______________________________`

---

## Test 9: Authenticated Route Access - Trading Page

**Objective:** Verify authenticated users can access and use the trading page.

**Steps:**
1. Ensure you are logged in
2. Navigate to `/#/trading`
3. Verify the trading page renders completely
4. Check that balance overview is visible
5. Verify trade ticket form is functional
6. Check that candlestick chart renders

**Expected Results:**
- Trading page loads without errors
- Balance information displays
- Trade ticket form is interactive
- Candlestick chart renders with data
- No runtime errors in console

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 10: Canister Deep-Link Verification

**Objective:** Verify that deep links to hash routes work correctly when accessed directly from external sources.

**Steps:**
1. Copy the full canister URL with a hash route (e.g., `https://{canister-id}.ic0.app/#/trading`)
2. Open a new incognito/private browser window
3. Paste and navigate to the copied URL
4. Verify the correct page loads
5. Repeat for root URL without hash (`https://{canister-id}.ic0.app/`)
6. Verify landing page loads correctly

**Expected Results:**
- Direct hash route URLs load the correct page
- Root URL loads the landing page
- No 404 errors or blank screens
- Authentication prompts appear if required
- All routes are accessible via direct URL entry

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 11: Unknown Route Handling

**Objective:** Verify that navigating to an unknown route displays the 404 page.

**Steps:**
1. Navigate to an invalid hash route (e.g., `/#/nonexistent-page`)
2. Verify the 404 Not Found page displays
3. Click "Return to Home" button
4. Verify navigation back to landing page works

**Expected Results:**
- 404 page displays for unknown routes
- "Page Not Found" message is visible
- "Return to Home" button is functional
- Navigation back to home works correctly

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 12: Authenticated Route Access - Wallet Page

**Objective:** Verify authenticated users can access and use the wallet page.

**Steps:**
1. Ensure you are logged in
2. Navigate to `/#/wallet`
3. Verify the wallet page renders completely
4. Check that balance overview is visible
5. Verify deposit and withdraw forms are functional
6. Check that transaction history displays

**Expected Results:**
- Wallet page loads without errors
- Balance information displays
- Deposit form is interactive
- Withdraw form is interactive
- Transaction history table renders
- M-Pesa instructions are visible

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 13: Admin-Only Access Control

**Objective:** Verify that admin page is accessible only to admin users.

**Steps:**
1. Log in as a non-admin user
2. Navigate to `/#/admin`
3. Verify access denied screen appears
4. Log out and log in as an admin user
5. Navigate to `/#/admin`
6. Verify admin dashboard loads correctly

**Expected Results:**
- Non-admin users see "Access Denied" screen
- Admin users can access the admin dashboard
- Admin dashboard displays platform stats
- Management tabs are functional
- No unauthorized access is possible

**Pass/Fail:** ☐ Pass  ☐ Fail  ☐ N/A (no admin account)  
**Notes:** `_______________________________`

---

## Test 14: Logout Functionality

**Objective:** Verify logout clears authentication and returns to landing page.

**Steps:**
1. Ensure you are logged in
2. Click the "Logout" button
3. Verify logout completes successfully
4. Check that login button reappears
5. Verify navigation to authenticated routes shows login prompt

**Expected Results:**
- Logout completes without errors
- "Logout" button changes to "Login" button
- User is redirected appropriately
- Authenticated routes require re-login
- Query cache is cleared

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Test 15: Responsive Design Check

**Objective:** Verify the app is responsive and works on mobile devices.

**Steps:**
1. Open browser DevTools
2. Toggle device emulation (mobile view)
3. Test navigation on mobile viewport
4. Verify mobile menu works correctly
5. Check that forms are usable on mobile

**Expected Results:**
- Layout adapts to mobile viewport
- Mobile menu (hamburger) appears and functions
- All interactive elements are accessible
- Forms are usable on touch devices
- No horizontal scrolling issues

**Pass/Fail:** ☐ Pass  ☐ Fail  
**Notes:** `_______________________________`

---

## Overall Test Summary

**Total Tests:** 15  
**Passed:** `_______`  
**Failed:** `_______`  
**N/A:** `_______`

**Critical Issues Found:**
