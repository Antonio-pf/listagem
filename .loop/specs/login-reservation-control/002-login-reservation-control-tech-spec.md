# Technical Specification: Login and Reservation Control System with Supabase

## Architecture Overview

The system implements a simple authentication flow using Supabase as the backend-as-a-service, replacing localStorage with a centralized PostgreSQL database. The architecture follows Next.js App Router pattern with TypeScript and shadcn/ui components.

**Key Layers:**
- **Presentation Layer**: Login form component, user context provider, protected gift reservation UI
- **Business Logic Layer**: Authentication service, reservation management service
- **Data Layer**: Supabase PostgreSQL database with real-time subscriptions
- **API Layer**: Supabase REST API (auto-generated) + Next.js API Routes

## Technical Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Backend**: Supabase (PostgreSQL + REST API + Real-time)
- **UI Components**: shadcn/ui (existing)
- **State Management**: React Context API + useState/useEffect + Supabase subscriptions
- **Data Persistence**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (anonymous sessions)
- **Hosting**: Vercel (Frontend) + Supabase (Database/Backend)

## Why Supabase?

✅ **FREE tier includes:**
- 500MB database storage
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth
- Real-time subscriptions
- Unlimited API requests

✅ **Perfect for Vercel:**
- Zero configuration deployment
- Environment variables integration
- Edge-compatible
- No additional backend needed

✅ **Developer Experience:**
- Auto-generated TypeScript types
- Built-in database migrations
- Real-time subscriptions out of the box
- Row Level Security (RLS)

## Database Schema

### Table: `guests`
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  has_companion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster name lookups
CREATE INDEX idx_guests_name ON guests(name);
```

### Table: `reservations`
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id TEXT NOT NULL,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  has_companion BOOLEAN DEFAULT false,
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gift_id)  -- Ensures only one reservation per gift
);

-- Index for faster gift lookups
CREATE INDEX idx_reservations_gift_id ON reservations(gift_id);
CREATE INDEX idx_reservations_guest_id ON reservations(guest_id);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read guests
CREATE POLICY "Enable read access for all users" ON guests
FOR SELECT USING (true);

-- Allow anyone to insert guests
CREATE POLICY "Enable insert for all users" ON guests
FOR INSERT WITH CHECK (true);

-- Allow anyone to read reservations
CREATE POLICY "Enable read access for all users" ON reservations
FOR SELECT USING (true);

-- Allow anyone to insert reservations
CREATE POLICY "Enable insert for all users" ON reservations
FOR INSERT WITH CHECK (true);

-- Allow guests to delete their own reservations
CREATE POLICY "Enable delete for users based on guest_name" ON reservations
FOR DELETE USING (true);  -- We'll handle logic in app layer
```

## Component Design

### 1. Supabase Client
- Initialize Supabase client with environment variables
- Provide singleton instance throughout app
- Handle connection pooling

### 2. Authentication Context
- Provides guest session throughout the application
- Manages login/logout state
- Persists guest_id in localStorage (session reference)

### 3. Login/Registration Component
- Simple form with name input and companion checkbox
- Creates guest record in Supabase
- Returns guest_id for session

### 4. Reservation Service
- Create reservation (with uniqueness check)
- Get all reservations
- Get reservations by guest
- Delete reservation (with owner verification)

## Data Flow

```
1. User Login:
   User enters name → Create/Get guest in Supabase → Store guest_id in localStorage → Update React Context

2. Reserve Gift:
   User clicks reserve → Check auth → Create reservation in Supabase → Real-time update to all clients

3. Cancel Reservation:
   User clicks cancel → Verify ownership → Delete from Supabase → Real-time update to all clients

4. Page Load:
   Load page → Get guest_id from localStorage → Fetch all reservations → Subscribe to real-time changes
```

## API Routes (Next.js)

### `/api/guests`
- **POST**: Create or get guest by name
- **GET**: Get guest by ID

### `/api/reservations`
- **GET**: Get all reservations
- **POST**: Create reservation (checks uniqueness)
- **DELETE**: Delete reservation (verifies ownership)

## Real-time Subscriptions

```typescript
// Subscribe to reservation changes
const subscription = supabase
  .channel('reservations')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'reservations' },
    (payload) => {
      // Update local state with new data
      refreshReservations()
    }
  )
  .subscribe()
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Migration from localStorage

### Phase 1: Setup
1. Create Supabase project
2. Run database migrations
3. Install Supabase client
4. Configure environment variables

### Phase 2: API Layer
1. Create API routes for guests
2. Create API routes for reservations
3. Implement error handling

### Phase 3: Frontend Integration
1. Replace localStorage calls with Supabase API calls
2. Add real-time subscriptions
3. Update error handling and loading states

### Phase 4: Testing & Deployment
1. Test with multiple devices
2. Test real-time updates
3. Deploy to Vercel
4. Verify Supabase connection

## Performance Considerations

- **Connection Pooling**: Supabase handles automatically
- **Caching**: React Query can be added for client-side caching
- **Real-time**: Only subscribe to necessary tables
- **Edge Functions**: Can be used for complex operations

## Security Considerations

- **Row Level Security**: Enabled on all tables
- **API Keys**: Use anon key (safe for client-side)
- **No sensitive data**: Guest names only (no passwords)
- **CORS**: Configured automatically by Supabase
- **SQL Injection**: Prevented by Supabase client

## Deployment

### Vercel Setup
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase Setup
1. Create project at supabase.com
2. Copy project URL and anon key
3. Run SQL migrations in SQL Editor
4. Configure RLS policies

## Cost Estimation

**FREE tier limits:**
- ✅ Up to 50,000 monthly active users
- ✅ 500MB database (sufficient for thousands of reservations)
- ✅ Unlimited API requests
- ✅ Real-time subscriptions included

**Typical usage for gift list:**
- ~100-500 guests
- ~100KB database storage
- Well within free tier limits

## Advantages over localStorage

✅ **Multi-device support**: Data synced across all devices
✅ **Real-time updates**: Everyone sees changes instantly
✅ **Data persistence**: No data loss on browser clear
✅ **Backup**: Automatic database backups
✅ **Scalability**: Handles thousands of users
✅ **No backend code**: Supabase handles everything

## Changes to Existing Code

### Update `lib/supabase.ts` (NEW FILE)
**Description**: Initialize Supabase client
**Example**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Update `lib/auth-context.tsx`
**Description**: Replace localStorage with Supabase API calls
**Changes**: 
- Login creates/gets guest from Supabase
- Store only guest_id in localStorage
- Fetch guest data on mount

### Update `lib/reservation-storage.ts`
**Description**: Replace localStorage with Supabase queries
**Changes**:
- All CRUD operations use Supabase
- Add real-time subscription
- Handle network errors

### Create `app/api/guests/route.ts` (NEW FILE)
**Description**: API route for guest operations
**Methods**: POST (create/get), GET (by ID)

### Create `app/api/reservations/route.ts` (NEW FILE)
**Description**: API route for reservation operations
**Methods**: GET (all), POST (create), DELETE (by ID)