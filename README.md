It is still stuck.
## Browser console
```
forward-logs-shared.ts:120 [HMR] connected
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()

```

## Server Console
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-complication 200 in 74ms (next.js: 28ms, application-code: 46ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 48ms (next.js: 20ms, application-code: 27ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 44ms (next.js: 18ms, application-code: 25ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 46ms (next.js: 20ms, application-code: 27ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 52ms (next.js: 21ms, application-code: 31ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 49ms (next.js: 20ms, application-code: 29ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 50ms (next.js: 20ms, application-code: 30ms)


There should be a simpler solution to this.


```sql
-- ============================================================
-- Mission 1 Domain Model
-- Migration: 002_mission1_domain_model.sql
--
-- Purpose:
--   Establish the domain persistence model required by Mission 1.
--
-- Design principles:
--   1. Program structure lives in program_content.
--   2. User journey state lives in user_progress.
--   3. Durable user/domain knowledge lives in domain tables.
--   4. AI interactions are auditable in ai_logs.
--   5. Component implementation remains in application code.
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 1. PROGRAM CONTENT
--
-- Persisted representation of the program nodes.
--
-- The TypeScript configuration remains the source used to
-- construct the application. This table gives us a stable
-- database identity for each node and allows user_progress
-- to reference nodes.
-- ============================================================

alter table public.program_content
  add column if not exists program_key text,
  add column if not exists mission_key text,
  add column if not exists quest_key text,
  add column if not exists role text,
  add column if not exists container_type text,
  add column if not exists container_key text,
  add column if not exists component_key text,
  add column if not exists interaction_type text,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists ai_context_keys jsonb not null default '[]'::jsonb,
  add column if not exists dependencies jsonb not null default '[]'::jsonb,
  add column if not exists resources jsonb not null default '[]'::jsonb,
  add column if not exists stories jsonb not null default '[]'::jsonb,
  add column if not exists video_url text,
  add column if not exists audio_url text,
  add column if not exists sort_order integer,
  add column if not exists config_version integer not null default 1;

create unique index if not exists program_content_key_idx
  on public.program_content(key);

create index if not exists program_content_program_idx
  on public.program_content(program_key);

create index if not exists program_content_mission_idx
  on public.program_content(mission_key);

create index if not exists program_content_quest_idx
  on public.program_content(quest_key);

create index if not exists program_content_container_idx
  on public.program_content(container_type, container_key);


-- ============================================================
-- 2. USER PROFILE
--
-- Durable understanding of the user.
--
-- JSONB is intentional here. These concepts are expected to
-- evolve as we learn more about the program.
-- ============================================================

alter table public.user_profile
  add column if not exists mission_starting_point jsonb not null default '{}'::jsonb,
  add column if not exists motivations jsonb not null default '[]'::jsonb,
  add column if not exists fears jsonb not null default '[]'::jsonb,
  add column if not exists perceived_barriers jsonb not null default '[]'::jsonb,
  add column if not exists desired_future jsonb not null default '{}'::jsonb,
  add column if not exists quit_conditions jsonb not null default '[]'::jsonb,
  add column if not exists perceived_deficits jsonb not null default '[]'::jsonb,
  add column if not exists resources jsonb not null default '[]'::jsonb,
  add column if not exists constraints jsonb not null default '[]'::jsonb,
  add column if not exists capabilities jsonb not null default '[]'::jsonb,
  add column if not exists experience jsonb not null default '[]'::jsonb,
  add column if not exists network_context jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();


-- Make sure there is one profile per user.
create unique index if not exists user_profile_user_id_idx
  on public.user_profile(user_id);


drop trigger if exists user_profile_updated_at
  on public.user_profile;

create trigger user_profile_updated_at
before update on public.user_profile
for each row
execute function public.set_updated_at();


-- ============================================================
-- 3. USER OPPORTUNITIES
--
-- Ideas and explorations that may eventually become projects.
-- ============================================================

create table if not exists public.user_opportunities (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text,
  description text,

  status text not null default 'exploring',

  source text,
  source_node_id uuid
    references public.program_content(id)
    on delete set null,

  problem text,
  customer text,
  hypothesis text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_opportunities_user_id_idx
  on public.user_opportunities(user_id);

create index if not exists user_opportunities_source_node_idx
  on public.user_opportunities(source_node_id);

drop trigger if exists user_opportunities_updated_at
  on public.user_opportunities;

create trigger user_opportunities_updated_at
before update on public.user_opportunities
for each row
execute function public.set_updated_at();


-- ============================================================
-- 4. USER CONTACTS
--
-- Actual people in the user's network.
-- ============================================================

create table if not exists public.user_contacts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null,
  role text,
  organization text,

  relationship text,
  context text,

  contact_details jsonb not null default '{}'::jsonb,

  source_node_id uuid
    references public.program_content(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_contacts_user_id_idx
  on public.user_contacts(user_id);

create index if not exists user_contacts_source_node_idx
  on public.user_contacts(source_node_id);

drop trigger if exists user_contacts_updated_at
  on public.user_contacts;

create trigger user_contacts_updated_at
before update on public.user_contacts
for each row
execute function public.set_updated_at();


-- ============================================================
-- 5. USER COMMITMENTS
--
-- Durable commitments made by the user.
--
-- Different from tasks:
--
-- Commitment = "I will..."
-- Task       = "I need to do..."
-- ============================================================

create table if not exists public.user_commitments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  commitment text not null,
  reason text,

  status text not null default 'active',

  source_node_id uuid
    references public.program_content(id)
    on delete set null,

  starts_at timestamptz,
  due_at timestamptz,
  completed_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_commitments_user_id_idx
  on public.user_commitments(user_id);

create index if not exists user_commitments_status_idx
  on public.user_commitments(user_id, status);

create index if not exists user_commitments_source_node_idx
  on public.user_commitments(source_node_id);

drop trigger if exists user_commitments_updated_at
  on public.user_commitments;

create trigger user_commitments_updated_at
before update on public.user_commitments
for each row
execute function public.set_updated_at();


-- ============================================================
-- 6. USER TASKS
--
-- Concrete actions the user needs to take.
-- These may be program tasks or off-program actions.
-- ============================================================

create table if not exists public.user_tasks (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null,
  description text,

  status text not null default 'pending',

  task_type text,

  source_node_id uuid
    references public.program_content(id)
    on delete set null,

  due_at timestamptz,
  completed_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_tasks_user_id_idx
  on public.user_tasks(user_id);

create index if not exists user_tasks_status_idx
  on public.user_tasks(user_id, status);

create index if not exists user_tasks_source_node_idx
  on public.user_tasks(source_node_id);

drop trigger if exists user_tasks_updated_at
  on public.user_tasks;

create trigger user_tasks_updated_at
before update on public.user_tasks
for each row
execute function public.set_updated_at();


-- ============================================================
-- 7. USER OBSERVATIONS
--
-- Evidence gathered from the real world.
--
-- This becomes particularly important in Quest 3 and later
-- missions.
-- ============================================================

alter table public.user_observations
  add column if not exists type text,
  add column if not exists title text,
  add column if not exists content jsonb not null default '{}'::jsonb,
  add column if not exists source_node_id uuid,
  add column if not exists observed_at timestamptz,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Add the foreign key only if it doesn't already exist.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_observations_source_node_id_fkey'
  ) then
    alter table public.user_observations
      add constraint user_observations_source_node_id_fkey
      foreign key (source_node_id)
      references public.program_content(id)
      on delete set null;
  end if;
end;
$$;

create index if not exists user_observations_user_id_idx
  on public.user_observations(user_id);

create index if not exists user_observations_source_node_idx
  on public.user_observations(source_node_id);

create index if not exists user_observations_observed_at_idx
  on public.user_observations(user_id, observed_at);

drop trigger if exists user_observations_updated_at
  on public.user_observations;

create trigger user_observations_updated_at
before update on public.user_observations
for each row
execute function public.set_updated_at();


-- ============================================================
-- 8. USER PROGRESS
--
-- One row per user × program node.
--
-- This represents journey state, not the user's entire domain
-- model.
-- ============================================================

alter table public.user_progress
  add column if not exists program_content_id uuid,
  add column if not exists status text not null default 'not_started',
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists ai_data jsonb not null default '[]'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();


-- Add FK if absent.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_progress_program_content_id_fkey'
  ) then
    alter table public.user_progress
      add constraint user_progress_program_content_id_fkey
      foreign key (program_content_id)
      references public.program_content(id)
      on delete cascade;
  end if;
end;
$$;


create index if not exists user_progress_user_id_idx
  on public.user_progress(user_id);

create index if not exists user_progress_program_content_idx
  on public.user_progress(program_content_id);

create index if not exists user_progress_user_node_idx
  on public.user_progress(user_id, program_content_id);


-- This assumes program_content_id is the canonical node identity.
-- Do NOT create this constraint until any legacy duplicate rows
-- have been cleaned up.
--
-- Once the table is clean, run:
--
-- create unique index user_progress_user_node_unique_idx
--   on public.user_progress(user_id, program_content_id);


drop trigger if exists user_progress_updated_at
  on public.user_progress;

create trigger user_progress_updated_at
before update on public.user_progress
for each row
execute function public.set_updated_at();


-- ============================================================
-- 9. AI LOGS
--
-- Immutable-ish audit trail of AI interactions.
--
-- user_progress.ai_data is for convenient node-level retrieval.
-- ai_logs is the detailed historical record.
-- ============================================================

alter table public.ai_logs
  add column if not exists user_id uuid,
  add column if not exists program_content_id uuid,
  add column if not exists purpose text,
  add column if not exists component_key text,
  add column if not exists model text,
  add column if not exists provider text,
  add column if not exists request jsonb not null default '{}'::jsonb,
  add column if not exists context jsonb not null default '{}'::jsonb,
  add column if not exists response jsonb not null default '{}'::jsonb,
  add column if not exists latency_ms integer,
  add column if not exists status text not null default 'completed',
  add column if not exists created_at timestamptz not null default now();


do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ai_logs_user_id_fkey'
  ) then
    alter table public.ai_logs
      add constraint ai_logs_user_id_fkey
      foreign key (user_id)
      references auth.users(id)
      on delete cascade;
  end if;
end;
$$;


do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ai_logs_program_content_id_fkey'
  ) then
    alter table public.ai_logs
      add constraint ai_logs_program_content_id_fkey
      foreign key (program_content_id)
      references public.program_content(id)
      on delete set null;
  end if;
end;
$$;


create index if not exists ai_logs_user_id_idx
  on public.ai_logs(user_id);

create index if not exists ai_logs_program_content_idx
  on public.ai_logs(program_content_id);

create index if not exists ai_logs_user_node_idx
  on public.ai_logs(user_id, program_content_id);

create index if not exists ai_logs_created_at_idx
  on public.ai_logs(created_at);


-- ============================================================
-- 10. ROW LEVEL SECURITY
-- ============================================================

alter table public.user_profile enable row level security;
alter table public.user_opportunities enable row level security;
alter table public.user_contacts enable row level security;
alter table public.user_commitments enable row level security;
alter table public.user_tasks enable row level security;
alter table public.user_observations enable row level security;
alter table public.user_progress enable row level security;
alter table public.ai_logs enable row level security;


-- ============================================================
-- USER PROFILE POLICIES
-- ============================================================

drop policy if exists "Users can view own profile"
  on public.user_profile;

create policy "Users can view own profile"
on public.user_profile
for select
using (auth.uid() = user_id);


drop policy if exists "Users can insert own profile"
  on public.user_profile;

create policy "Users can insert own profile"
on public.user_profile
for insert
with check (auth.uid() = user_id);


drop policy if exists "Users can update own profile"
  on public.user_profile;

create policy "Users can update own profile"
on public.user_profile
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- OPPORTUNITIES
-- ============================================================

drop policy if exists "Users can manage own opportunities"
  on public.user_opportunities;

create policy "Users can manage own opportunities"
on public.user_opportunities
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- CONTACTS
-- ============================================================

drop policy if exists "Users can manage own contacts"
  on public.user_contacts;

create policy "Users can manage own contacts"
on public.user_contacts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- COMMITMENTS
-- ============================================================

drop policy if exists "Users can manage own commitments"
  on public.user_commitments;

create policy "Users can manage own commitments"
on public.user_commitments
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- TASKS
-- ============================================================

drop policy if exists "Users can manage own tasks"
  on public.user_tasks;

create policy "Users can manage own tasks"
on public.user_tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- OBSERVATIONS
-- ============================================================

drop policy if exists "Users can manage own observations"
  on public.user_observations;

create policy "Users can manage own observations"
on public.user_observations
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- PROGRESS
-- ============================================================

drop policy if exists "Users can manage own progress"
  on public.user_progress;

create policy "Users can manage own progress"
on public.user_progress
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- ============================================================
-- AI LOGS
-- ============================================================

drop policy if exists "Users can view own AI logs"
  on public.ai_logs;

create policy "Users can view own AI logs"
on public.ai_logs
for select
using (auth.uid() = user_id);


-- AI logs should ideally be written by trusted server-side code.
-- We therefore intentionally do NOT give normal browser clients
-- an INSERT policy here.


-- ============================================================
-- PROGRAM CONTENT
--
-- Program content is application-owned rather than user-owned.
-- For now allow authenticated users to read it.
-- Writes should be performed by the sync/deployment process.
-- ============================================================

alter table public.program_content enable row level security;

drop policy if exists "Authenticated users can view program content"
  on public.program_content;

create policy "Authenticated users can view program content"
on public.program_content
for select
to authenticated
using (true);


-- ============================================================
-- END
-- ============================================================

```