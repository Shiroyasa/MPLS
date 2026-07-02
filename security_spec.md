# Security Specifications for Realtime MPLS Cyber Academy

This document outlines the security rules and data integrity checks designed to protect real-time synchronization fields.

## 1. Data Invariants
- **ActivityPhoto**: Cannot be modified or created by unauthenticated clients. If the user is authenticated, they can update/delete activities they manage, or if they are in the PANITIA/Admin role.
- **Announcement**: Can only be created, updated, or deleted by authorized administrators or PANITIA STAFF.
- **Agent**: Anyone can read the agent profile list (for Leaderboard and public rosters), but a user can only create or edit their own profile document. No user can escalate their own role to 'admin' unless they exist in the trusted admins metadata.

## 2. The "Dirty Dozen" Payloads (Deny Scenarios)
1. **Activity Creation by Anonymous**: Creating a new activity without authentication. (Result: DENIED)
2. **Ghost-Field Injection in Activity**: Creating/updating an activity with an unapproved extra field like `isVerified: true` (Shadow Update). (Result: DENIED)
3. **Privilege Escalation on Agent Create**: Creating an agent profile with `role: "admin"` directly from the client. (Result: DENIED)
4. **Agent Profile Hijacking**: Updating another user's agent profile document. (Result: DENIED)
5. **Role Mutation by User**: An existing student attempts to change their own role to `"admin"`. (Result: DENIED)
6. **Anonymous Announcement Creation**: Creating an announcement without admin credentials. (Result: DENIED)
7. **Invalid Announcement Severity**: Creating/updating an announcement with severity set to `"MEGA_ALERT"` instead of enum options. (Result: DENIED)
8. **Massive ID Poisoning**: Trying to create an activity with a 10KB document ID to cause Denial of Wallet. (Result: DENIED)
9. **Timestamp Hijacking**: Creating an activity with a spoofed `createdAt` client-side timestamp instead of server timestamp (if applicable). (Result: DENIED)
10. **Array Overloading**: Attempting to upload tags array in ActivityPhoto exceeding maximum limits (e.g. 20 tags). (Result: DENIED)
11. **Negative Level/Exp Injection**: Attempting to set negative levels/exp in an agent profile. (Result: DENIED)
12. **Blanket Query Scraping**: Triggering a blanket query listing all private fields. (Result: DENIED)

## 3. Test Runner Design
We test using local test frameworks or ESLint rule validators to check the rules file structure and ensure it compiles successfully.
