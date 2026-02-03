-- Create habit_completions table for tracking daily habit achievements
-- Run this SQL in your Supabase SQL Editor

create table if not exists habit_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  habit_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for efficient queries by user and date
create index if not exists idx_habit_completions_user_date 
  on habit_completions(user_id, created_at);

-- Enable Row Level Security
alter table habit_completions enable row level security;

-- Allow users to view their own completions
create policy "Users can view their own habit completions"
  on habit_completions for select
  using (auth.uid() = user_id);

-- Allow users to insert their own completions
create policy "Users can insert their own habit completions"
  on habit_completions for insert
  with check (auth.uid() = user_id);

-- Allow users to delete their own completions (for undo functionality)
create policy "Users can delete their own habit completions"
  on habit_completions for delete
  using (auth.uid() = user_id);
