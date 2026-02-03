
create table if not exists daily_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mood_score integer,
  notes text,
  energy_level integer,
  stress_level integer
);

alter table daily_checkins enable row level security;

create policy "Users can view their own checkins"
  on daily_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own checkins"
  on daily_checkins for insert
  with check (auth.uid() = user_id);
