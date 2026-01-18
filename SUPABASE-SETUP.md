# Supabase Setup Guide

## Overview
This guide will help you set up Supabase for your gift list application. Supabase is a free, open-source Firebase alternative that provides a PostgreSQL database, authentication, and real-time subscriptions.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `gift-list` (or any name you prefer)
   - **Database Password**: Choose a strong password (you won't need this often)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free (500MB database, 1GB file storage)
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be created

## Step 3: Run the Database Setup Script

1. In your Supabase dashboard, click on the **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy the entire contents of the `supabase-setup.sql` file from your project
4. Paste it into the SQL Editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see a success message: "Success. No rows returned"

This script will:
- Create the `guests` table
- Create the `reservations` table
- Create the `messages` table
- Set up indexes for better performance
- Configure Row Level Security (RLS) policies

## Step 4: Get Your API Credentials

1. In your Supabase dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

## Step 5: Configure Your Local Environment

1. In your project root, create a file named `.env.local` (copy from `.env.local.example`)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

**IMPORTANT**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser (this is safe for the anon key)

## Step 6: Install Dependencies (Already Done)

The Supabase client library has already been installed:
```bash
npm install @supabase/supabase-js
```

## Step 7: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`
3. Try to log in with a name
4. Try to reserve a gift

If everything works, you should see the reservation in your Supabase dashboard:
1. Go to **Table Editor** in the left sidebar
2. Click on **reservations** table
3. You should see your test reservation

## Step 8: Deploy to Vercel

1. Push your code to GitHub (make sure `.env.local` is NOT included)
2. Go to [https://vercel.com](https://vercel.com)
3. Import your GitHub repository
4. In the deployment settings, add your environment variables:
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your project URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key
5. Click "Deploy"

## Verify Setup

### Check Database Tables
```sql
-- Run this in SQL Editor to verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('guests', 'reservations', 'messages');
```

You should see:
- guests
- reservations
- messages

### Check Row Level Security
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('guests', 'reservations', 'messages');
```

All three tables should have `rowsecurity = true`

## Troubleshooting

### Error: "Failed to fetch"
- Check that your `.env.local` file exists and has the correct values
- Restart your development server after adding environment variables
- Verify the Supabase URL doesn't have trailing slashes

### Error: "JWT expired" or "Invalid API key"
- Your anon key might be copied incorrectly (make sure you get the entire key)
- Regenerate the anon key in Supabase Settings > API if needed

### Reservations not showing up
- Check the browser console for errors
- Verify the database tables were created correctly
- Check that RLS policies are set up (run the SQL script again if needed)

### Can't reserve the same gift twice
- This is expected behavior! The unique constraint on `gift_id` prevents duplicate reservations
- If you need to test, cancel the reservation first or use a different gift

## Features Enabled

✅ **Multi-device sync**: Reservations work across all devices
✅ **Real-time updates**: Changes appear instantly for all users
✅ **Data persistence**: No data loss on browser refresh
✅ **Conflict prevention**: Only one person can reserve each gift
✅ **Free hosting**: Supabase free tier is generous for this use case

## Database Schema

### guests table
- `id` (UUID): Primary key
- `name` (TEXT): Guest name
- `has_companion` (BOOLEAN): Whether guest has a companion
- `created_at` (TIMESTAMP): When guest was created

### reservations table
- `id` (UUID): Primary key
- `gift_id` (TEXT): ID of the reserved gift
- `guest_id` (UUID): Foreign key to guests table
- `guest_name` (TEXT): Denormalized guest name for easier queries
- `has_companion` (BOOLEAN): Whether guest has a companion
- `reserved_at` (TIMESTAMP): When the gift was reserved

### messages table
- `id` (UUID): Primary key
- `guest_name` (TEXT): Name of person sending message
- `message` (TEXT): Message content
- `created_at` (TIMESTAMP): When the message was created

## Cost Estimate

**Supabase Free Tier Limits:**
- Database: 500MB (plenty for thousands of reservations)
- Storage: 1GB
- Bandwidth: 2GB/month
- Monthly Active Users: Up to 50,000

**Expected Usage:**
- ~100-500 guests
- ~100KB database storage
- Well within free tier limits

## Support

If you encounter any issues:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the troubleshooting section above
3. Check browser console for error messages
4. Verify all environment variables are set correctly

## Security Notes

- The `anon` key is safe to use in the browser
- Row Level Security (RLS) policies control data access
- No sensitive data is stored (only guest names)
- All database operations go through Supabase's secure API
