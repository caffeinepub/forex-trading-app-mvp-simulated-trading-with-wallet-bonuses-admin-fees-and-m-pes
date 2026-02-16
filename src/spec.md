# Specification

## Summary
**Goal:** Allow the app owner’s M-Pesa deposit destination number to be configured and shown to users in the wallet deposit instructions.

**Planned changes:**
- Add backend storage for an owner-configurable M-Pesa destination number, initialized to "0701599601".
- Expose a backend query endpoint for the frontend to read the current M-Pesa destination number.
- Update the Wallet deposit UI (when M-Pesa is selected) to fetch and display the destination number in clear English, keeping deposits manually reviewed/approved.

**User-visible outcome:** When users choose M-Pesa on the wallet deposit screen, they see English instructions telling them to send funds to the configured number (initially 0701599601), with a note that deposits are manually reviewed/approved.
