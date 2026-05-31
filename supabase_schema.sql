-- SQL Schema for "Not Today" Supabase Database
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create habits table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  habit_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create streaks table
create table public.streaks (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null unique,
  current_streak integer default 0 not null,
  best_streak integer default 0 not null,
  total_resists integer default 0 not null,
  last_checkin timestamp with time zone
);

-- 3. Create checkins table
create table public.checkins (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  note text
);

-- 4. Enable Row Level Security (RLS) on all tables
alter table public.habits enable row level security;
alter table public.streaks enable row level security;
alter table public.checkins enable row level security;

-- 5. Create RLS Policies
-- Users can manage their own habits
create policy "Users can manage their own habits"
  on public.habits
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can manage streaks for their own habits
create policy "Users can manage streaks for their own habits"
  on public.streaks
  for all
  using (
    exists (
      select 1 from public.habits
      where habits.id = streaks.habit_id
      and habits.user_id = auth.uid()
    )
  );

-- Users can manage checkins for their own habits
create policy "Users can manage checkins for their own habits"
  on public.checkins
  for all
  using (
    exists (
      select 1 from public.habits
      where habits.id = checkins.habit_id
      and habits.user_id = auth.uid()
    )
  );
