# Task List: Login and Reservation Control System with Vercel Postgres

## Project: Present List - Multi-User Reservation Control with Database
**Created:** 2026-01-14
**Status:** In Progress

---

## Previous Implementation Status

### Phase 1: Local Storage Implementation ✅ COMPLETED
- [x] Authentication context with localStorage
- [x] Login modal component
- [x] Reservation storage service
- [x] Gift list integration
- [x] User info display in header

**Limitation Identified**: localStorage only works on the same browser/device - no synchronization between users on different devices.

---

## New Implementation: Vercel Postgres Database

### Phase 1: Setup Vercel Postgres Database
- [ ] Install Vercel Postgres packages: `@vercel/postgres` and `@vercel/kv`
- [ ] Create database schema for `users` table with fields: id (uuid), name, has_companion, created_at
- [ ] Create database schema for `reservations` table with fields: id (uuid), gift_id, user_name, has_companion, reserved_at, created_at
- [ ] Create `.env.local` file with Vercel Postgres connection strings (will be auto-populated by Vercel)
- [ ] Add environment variable types to TypeScript configuration

### Phase 2: Create API Routes (Next.js API Routes in App Router)
- [ ] Create `app/api/auth/login/route.ts` to handle user login (POST method) - saves user to database, returns session token
- [ ] Create `app/api/auth/logout/route.ts` to handle logout (POST method)
- [ ] Create `app/api/reservations/route.ts` to handle GET all reservations and POST new reservation
- [ ] Create `app/api/reservations/[giftId]/route.ts` to handle DELETE reservation by gift ID with user validation
- [ ] Add error handling and validation to all API routes

### Phase 3: Update Authentication Context
- [ ] Modify `lib/auth-context.tsx` to call API routes instead of localStorage: update login() to POST to /api/auth/login, update logout() to POST to /api/auth/logout and clear session
- [ ] Keep user session in sessionStorage for client-side state (backup for quick access)
- [ ] Add API error handling with toast notifications

### Phase 4: Update Reservation Storage Service
- [ ] Modify `lib/reservation-storage.ts` to call API routes instead of localStorage: update saveReservation() to POST to /api/reservations, update getReservations() to GET from /api/reservations, update removeReservation() to DELETE from /api/reservations/[giftId]
- [ ] Add loading states for async operations
- [ ] Implement optimistic UI updates (update UI immediately, then sync with database)
- [ ] Add retry logic for failed API calls

### Phase 5: Update Gift List Component
- [ ] Modify `components/gift-list.tsx` to use async/await for reservation operations: update handleReserve() to await API call, update handleCancelReservation() to await API call
- [ ] Add loading spinners during API operations
- [ ] Add error handling with user-friendly messages
- [ ] Implement real-time refresh mechanism (poll every 10 seconds to check for new reservations)

### Phase 6: Database Migration Script
- [ ] Create `scripts/migrate-localstorage-to-db.ts` to migrate existing localStorage data to Vercel Postgres (optional helper for testing)
- [ ] Add instructions in README for running migration

### Phase 7: Environment Variables Documentation
- [ ] Update README.md with Vercel Postgres setup instructions
- [ ] Document required environment variables: POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING
- [ ] Add local development setup guide

### Phase 8: Testing and Validation
- [ ] Test multi-user scenario: User A reserves on device 1, User B sees reservation on device 2
- [ ] Test concurrent reservations: Two users try to reserve same gift simultaneously
- [ ] Test session persistence after browser refresh
- [ ] Test API error scenarios: database connection failure, invalid data
- [ ] Verify no localStorage dependencies remain for critical data
- [ ] Test on Vercel deployment environment

### Phase 9: Update Specifications
- [ ] Update technical specification `.loop/specs/login-reservation-control/002-login-reservation-control-tech-spec.md` with database architecture
- [ ] Update implementation plan `.loop/specs/login-reservation-control/003-login-reservation-control-plan.md` with new phases
- [ ] Document API endpoints and data models in technical spec

---

## Vercel Deployment Checklist

- [ ] Install Vercel Postgres from Vercel dashboard (Storage → Create Database → Postgres)
- [ ] Link environment variables automatically (Vercel will inject them)
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Run database initialization (create tables on first deploy)
- [ ] Test deployed application with multiple users on different devices
- [ ] Verify real-time synchronization works

---

## Technical Stack Updates

**Added Dependencies:**
- `@vercel/postgres` - Vercel Postgres client
- `uuid` - Generate unique IDs for users and reservations (if not using DB auto-increment)

**Architecture Changes:**
- Client → API Routes → Vercel Postgres
- Serverless functions for all database operations
- No separate backend server needed (Next.js handles it)

---

## Benefits of New Implementation

✅ **Multi-device synchronization**: All users see real-time updates
✅ **Free hosting**: Vercel free tier includes Postgres database
✅ **Zero backend code**: Next.js API routes handle everything
✅ **Automatic scaling**: Serverless functions scale automatically
✅ **Easy deployment**: One command deployment to Vercel

---

## Notes

- Vercel Postgres free tier limits: 256 MB storage, 60 hours compute time per month
- Sufficient for gift list application (typical use case: ~50-100 users, ~20-30 gifts)
- Session management uses sessionStorage on client (survives page refresh)
- Database stores all critical data (users, reservations)
- API routes validate all operations server-side

---

**Total New Tasks:** 28 implementation steps across 9 phases