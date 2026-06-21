-- ============================================================
-- ChronosFeed Database Migration: Operator Personas
-- Run this in Supabase SQL Editor to support Phase 13
-- ============================================================

create table if not exists operator_personas (
  id                  uuid primary key default gen_random_uuid(),
  world_id            uuid not null references worlds(id) on delete cascade,
  role                text not null,
  name                text not null,
  handle              text not null,
  bio                 text not null,
  followers_count     integer not null default 0,
  following_count     integer not null default 0,
  influence_score     integer not null default 50,
  custom_stat_label   text not null,
  custom_stat_value   integer not null default 50,
  created_at          timestamptz not null default now(),
  unique(world_id)
);

create index if not exists idx_operator_personas_world_id on operator_personas(world_id);
