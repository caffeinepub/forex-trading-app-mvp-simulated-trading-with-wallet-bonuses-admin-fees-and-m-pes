# Specification

## Summary
**Goal:** Fix Internet Identity login and onboarding so users can reliably authenticate, get started, and understand what to do when login/profile setup fails.

**Planned changes:**
- Make the Login button reliably launch the Internet Identity authorization flow in production and ensure the app transitions to an authenticated (non-anonymous) state after successful login.
- Add clear, user-facing error handling when Internet Identity configuration is missing/misconfigured or when the login flow fails, including a retry action and no stuck loading state.
- Update “Get Started / Start Trading” so unauthenticated users are prompted to log in (or login is initiated), then redirected to the intended destination (e.g., Trading) after login without navigation loops.
- Improve gating UX on authenticated routes (Trading, Wallet, Admin) to show a clear “login required” message and Login action instead of blank/broken screens; preserve existing access denied behavior for non-admin users who are logged in.

**User-visible outcome:** Users can click Login and successfully authenticate via Internet Identity, unauthenticated users are guided to log in before entering Trading/Wallet/Admin, and any login/onboarding/profile errors are shown in the UI with clear next steps.
