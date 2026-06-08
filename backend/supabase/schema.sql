-- ============================================================
-- ChronosFeed Database Schema
-- Run this once in Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- WORLD
-- The root entity. Every piece of generated content belongs
-- to a World. status tracks async generation progress.
-- ============================================================
create table if not exists worlds (
  id          uuid primary key default gen_random_uuid(),
  prompt      text not null,
  name        text not null default '',
  summary     text not null default '',
  era         text not null default '',
  tech_level  text not null default '',
  gov_type    text not null default '',
  status      text not null default 'generating',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- EVENT
-- Historical milestones within a World's alternate timeline.
-- ============================================================
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  world_id    uuid not null references worlds(id) on delete cascade,
  year        text not null,
  title       text not null,
  description text not null,
  impact      text not null
);

-- ============================================================
-- PERSONA
-- AI-generated social media users living in a World.
-- role: INFLUENCER | SCIENTIST | POLITICIAN | BRAND
-- ============================================================
create table if not exists personas (
  id              uuid primary key default gen_random_uuid(),
  world_id        uuid not null references worlds(id) on delete cascade,
  name            text not null,
  handle          text not null,
  avatar          text not null default '',
  bio             text not null,
  role            text not null,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  influence_score integer not null default 50,
  interests       text[] not null default '{}',
  personality     text not null
);

-- ============================================================
-- POST
-- Social media posts authored by a Persona within a World.
-- media_type: IMAGE | TEXT | MEME
-- ============================================================
create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  world_id      uuid not null references worlds(id) on delete cascade,
  persona_id    uuid not null references personas(id) on delete cascade,
  content       text not null,
  media_url     text,
  media_type    text,
  likes_count   integer not null default 0,
  reposts_count integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- COMMENT
-- Replies to posts, authored by a Persona.
-- ============================================================
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts(id) on delete cascade,
  persona_id  uuid not null references personas(id) on delete cascade,
  content     text not null,
  likes_count integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- NEWS
-- Alternate-history news articles for a World.
-- category: POLITICS | SCIENCE | BUSINESS | CULTURE | TECHNOLOGY
-- ============================================================
create table if not exists news (
  id          uuid primary key default gen_random_uuid(),
  world_id    uuid not null references worlds(id) on delete cascade,
  title       text not null,
  content     text not null,
  category    text not null,
  publisher   text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- AD
-- Alternate-era advertisements for a World.
-- ============================================================
create table if not exists ads (
  id           uuid primary key default gen_random_uuid(),
  world_id     uuid not null references worlds(id) on delete cascade,
  company_name text not null,
  tagline      text not null,
  description  text not null,
  image_url    text,
  price        text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- All foreign key columns that will be queried frequently.
-- ============================================================
create index if not exists idx_events_world_id     on events(world_id);
create index if not exists idx_personas_world_id   on personas(world_id);
create index if not exists idx_posts_world_id      on posts(world_id);
create index if not exists idx_posts_persona_id    on posts(persona_id);
create index if not exists idx_comments_post_id    on comments(post_id);
create index if not exists idx_comments_persona_id on comments(persona_id);
create index if not exists idx_news_world_id       on news(world_id);
create index if not exists idx_ads_world_id        on ads(world_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- Automatically updates updated_at on worlds row change.
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger worlds_updated_at
  before update on worlds
  for each row
  execute function update_updated_at();